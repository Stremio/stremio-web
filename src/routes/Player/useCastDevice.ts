// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { useCore } from 'stremio/core';
import { useTranslation } from 'react-i18next';
import { useToast } from 'stremio/common';

type Track = { id: string, url?: string | null, fallbackUrl?: string | null };
type Video = {
    state: {
        paused: boolean | null,
        time: number | null,
        duration: number | null,
        volume: number | null,
        muted: boolean | null,
        subtitlesTracks: Track[],
        selectedSubtitlesTrackId: string | null,
        extraSubtitlesTracks: Track[],
        selectedExtraSubtitlesTrackId: string | null,
        extraSubtitlesDelay: number | null,
    },
    setPaused: (paused: boolean) => void,
    setTime: (time: number) => void,
};
type RemoteState = {
    paused: boolean,
    time: number,
    duration: number | null,
    volume: number,
    muted: boolean,
    buffering: boolean,
    loaded: boolean,
};
type Intent = { device: string, source: string, started: number, time: number, revision: number };

const useCastDevice = (streamingUrl: string | null, session: StreamingServer['casting'], video: Video,
    playingOnExternalDevice: MutableRefObject<boolean>, baseUrl: string | null, resumeTime = 0) => {
    const core = useCore();
    const toast = useToast();
    const { t } = useTranslation();
    const intent = useRef<Intent | null>(null);
    const config = useRef({ baseUrl, toast, video, t });
    config.current = { baseUrl, toast, video, t };
    const [remoteState, setRemoteState] = useState<RemoteState | null>(null);
    const previousVolume = useRef(1);
    const localPositionReady = useRef({ source: streamingUrl, ready: false });
    if (localPositionReady.current.source !== streamingUrl) localPositionReady.current = { source: streamingUrl, ready: false };
    if (video.state.time !== null && video.state.time > 0) localPositionReady.current.ready = true;
    const extraTrack = video.state.extraSubtitlesTracks.find(({ id }) => id === video.state.selectedExtraSubtitlesTrackId);
    const track = extraTrack ?? video.state.subtitlesTracks.find(({ id }) => id === video.state.selectedSubtitlesTrackId);
    const trackUrl = track?.fallbackUrl ?? track?.url;
    const subtitlesSrc = trackUrl && /^https?:\/\//i.test(trackUrl) ? trackUrl : null;
    const subtitlesDelay = extraTrack ? Math.round(video.state.extraSubtitlesDelay ?? 0) : 0;
    const subtitles = useMemo(() => ({ subtitlesSrc, subtitlesDelay }), [subtitlesSrc, subtitlesDelay]);

    const request = useCallback(async (current: Intent, params?: object, signal?: AbortSignal) => {
        if (!config.current.baseUrl) throw new Error('Streaming server URL is unavailable');
        const url = `${config.current.baseUrl.replace(/\/$/, '')}/casting/${encodeURIComponent(current.device)}/player`;
        const revision = current.revision;
        const response = await fetch(url, {
            method: params ? 'POST' : 'GET',
            headers: params ? { 'Content-Type': 'application/json' } : undefined,
            body: params ? JSON.stringify(params) : undefined,
            signal,
        });
        const status = await response.json();
        if (!response.ok || status.error) throw new Error(status.error || response.statusText);
        if (intent.current === current && current.revision === revision) {
            if ([3, 4].includes(status.state) && Number.isFinite(status.time)) current.time = status.time;
            const waiting = Date.now() - current.started < 25000 && [1, 5, 6].includes(status.state);
            const volume = Number.isFinite(status.volume) ? Math.round(status.volume * 100) : null;
            if (volume !== null && volume > 0) previousVolume.current = volume / 100;
            setRemoteState((previous) => ({
                paused: status.state === 4 || (!waiting && [5, 6, 7].includes(status.state)),
                time: current.time,
                duration: Number.isFinite(status.length) && status.length > 0 ? status.length : previous?.duration ?? null,
                volume: volume ?? previous?.volume ?? 100,
                muted: volume === null ? previous?.muted ?? false : volume === 0,
                buffering: waiting || status.state === 2,
                loaded: true,
            }));
        }
        return status;
    }, []);

    const command = useCallback((params: object) => {
        const current = intent.current;
        if (!current) return false;
        current.revision += 1;
        request(current, params).catch(() => {
            if (intent.current === current) {
                config.current.toast.show({ type: 'error', title: config.current.t('PLAYER_PLAYBACK_ERROR'), timeout: 5000 });
            }
        });
        return true;
    }, [request]);

    const stop = useCallback((syncPosition = true) => {
        const position = intent.current?.time;
        if (syncPosition && position !== undefined) config.current.video.setTime(position);
        intent.current = null;
        playingOnExternalDevice.current = false;
        setRemoteState(null);
        core.transport.dispatch({ action: 'StreamingServer', args: { action: 'StopCasting' } });
    }, [core.transport, playingOnExternalDevice]);

    const castToDevice = (device: string) => {
        if (!streamingUrl) return;
        if (intent.current?.device === device) {
            stop();
            return;
        }
        const localTime = localPositionReady.current.ready || resumeTime <= 0 ? video.state.time ?? resumeTime : resumeTime;
        const time = Math.max(0, Math.round(remoteState?.time ?? localTime));
        intent.current = { device, source: streamingUrl, started: Date.now(), time, revision: 0 };
        playingOnExternalDevice.current = true;
        video.setPaused(true);
        setRemoteState({ paused: false, time, duration: video.state.duration,
            volume: video.state.volume ?? 100, muted: false, buffering: true, loaded: true });
        core.transport.dispatch({
            action: 'StreamingServer',
            args: { action: 'CastToDevice', args: {
                device, source: streamingUrl, time, subtitles,
            } },
        });
    };

    const active = remoteState !== null;
    useEffect(() => {
        if (!active) return;
        let stopped = false;
        let timer: ReturnType<typeof setTimeout>;
        let controller: AbortController;
        const poll = async () => {
            const current = intent.current;
            if (stopped || !current) return;
            controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            try { await request(current, undefined, controller.signal); }
            catch { /* A missed status response must not disconnect playback. */ }
            finally {
                clearTimeout(timeout);
                if (!stopped) timer = setTimeout(poll, 1200);
            }
        };
        timer = setTimeout(poll, 1000);
        return () => { stopped = true; clearTimeout(timer); controller?.abort(); };
    }, [active, request]);

    const sessionId = session?.id;
    const sessionDevice = session?.device;
    useEffect(() => {
        if (sessionId && intent.current && sessionDevice === intent.current.device) {
            core.transport.dispatch({ action: 'StreamingServer', args: {
                action: 'SetCastingSubtitles', args: { id: sessionId, subtitles },
            } });
        }
    }, [core.transport, sessionId, sessionDevice, subtitles]);

    useEffect(() => {
        if (streamingUrl && intent.current && intent.current.source !== streamingUrl) stop(false);
    }, [streamingUrl, stop]);

    useEffect(() => {
        const onEvent = (name: string) => {
            if (name === 'StoppedCasting' && intent.current) {
                config.current.video.setTime(intent.current.time);
                intent.current = null;
                playingOnExternalDevice.current = false;
                setRemoteState(null);
            }
        };
        const onError = (source: CoreEvent, error: CoreEventError) => {
            if (intent.current && ['PlayingOnDevice', 'StoppedCasting', 'CastingSubtitlesChanged'].includes(source.event)) {
                toast.show({ type: 'error', title: error.message, timeout: 5000 });
            }
        };
        core.on('event', onEvent);
        core.on('error', onError);
        return () => {
            core.off('event', onEvent);
            core.off('error', onError);
        };
    }, [core, toast, playingOnExternalDevice]);

    useEffect(() => () => { if (intent.current) stop(false); }, [stop]);

    const isCasting = useCallback(() => intent.current !== null, []);
    const setPaused = useCallback((paused: boolean) => command({ paused }), [command]);
    const setTime = useCallback((time: number) => command({ time: Math.max(0, Math.round(time)) }), [command]);
    const setVolume = useCallback((volume: number) => {
        const level = Math.max(0, Math.min(1, volume / 100));
        if (level > 0) previousVolume.current = level;
        return command({ volume: level });
    }, [command]);
    const setMuted = useCallback((muted: boolean) => command({ volume: muted ? 0 : previousVolume.current }), [command]);
    return { castToDevice, isCasting, state: remoteState, setPaused, setTime, setVolume, setMuted };
};

export default useCastDevice;
