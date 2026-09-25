// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useCore } from 'stremio/core';
import { useToast } from 'stremio/common';

type Track = { id: string, url?: string | null, fallbackUrl?: string | null };

type Video = {
    state: {
        paused: boolean | null,
        time: number | null,
        subtitlesTracks: Track[],
        selectedSubtitlesTrackId: string | null,
        extraSubtitlesTracks: Track[],
        selectedExtraSubtitlesTrackId: string | null,
        extraSubtitlesDelay: number | null,
    },
    setPaused: (paused: boolean) => void,
};

const useCastDevice = (streamingUrl: string | null, session: StreamingServer['casting'], video: Video, playingOnExternalDevice: MutableRefObject<boolean>) => {
    const core = useCore();
    const toast = useToast();
    const { setPaused } = video;
    const intent = useRef<{ device: string, resume: boolean } | null>(null);
    const extraTrack = video.state.extraSubtitlesTracks.find(({ id }) => id === video.state.selectedExtraSubtitlesTrackId);
    const track = extraTrack ?? video.state.subtitlesTracks.find(({ id }) => id === video.state.selectedSubtitlesTrackId);
    const trackUrl = track?.fallbackUrl ?? track?.url;
    const subtitlesSrc = trackUrl && /^https?:\/\//i.test(trackUrl) ? trackUrl : null;
    const subtitlesDelay = extraTrack ? Math.round(video.state.extraSubtitlesDelay ?? 0) : 0;
    const subtitles = useMemo(() => ({ subtitlesSrc, subtitlesDelay }), [subtitlesSrc, subtitlesDelay]);
    const stop = useCallback(() => {
        core.transport.dispatch({ action: 'StreamingServer', args: { action: 'StopCasting' } });
    }, [core.transport]);

    const castToDevice = (device: string) => {
        if (!streamingUrl) return;
        intent.current = { device, resume: intent.current?.resume ?? video.state.paused === false };
        playingOnExternalDevice.current = true;
        video.setPaused(true);
        core.transport.dispatch({
            action: 'StreamingServer',
            args: {
                action: 'CastToDevice',
                args: { device, source: streamingUrl, time: Math.max(0, Math.round(video.state.time ?? 0)), subtitles }
            }
        });
    };

    const stopBeforeLocalPlay = useCallback(() => {
        if (!intent.current) return false;
        intent.current.resume = true;
        stop();
        return true;
    }, [stop]);
    const isCasting = useCallback(() => intent.current !== null, []);

    useEffect(() => {
        if (session && intent.current && session.device === intent.current.device) {
            core.transport.dispatch({
                action: 'StreamingServer',
                args: { action: 'SetCastingSubtitles', args: { id: session.id, subtitles } }
            });
        }
    }, [session?.id, subtitles]);

    useEffect(() => {
        const onEvent = (name: string) => {
            if (name === 'StoppedCasting' && intent.current) {
                const resume = intent.current.resume;
                intent.current = null;
                playingOnExternalDevice.current = false;
                if (resume) setPaused(false);
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
    }, [core, playingOnExternalDevice, setPaused, toast]);

    useEffect(() => () => {
        if (intent.current) {
            intent.current = null;
            playingOnExternalDevice.current = false;
            stop();
        }
    }, [streamingUrl, stop, playingOnExternalDevice]);

    return { castToDevice, stopBeforeLocalPlay, isCasting };
};

export default useCastDevice;
