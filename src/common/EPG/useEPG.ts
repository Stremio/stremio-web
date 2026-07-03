// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useState } from 'react';
import { addonResourceUrl, EPG_NOW_REFRESH_INTERVAL } from './utils';

export type EPGChannel = {
    id: string;
    type: string;
    name: string;
    logo: string | null;
    deepLinks?: MetaItemDeepLinks;
};

export type EPGProgram = {
    id?: string;
    title: string;
    overview: string | null;
    thumbnail?: string | null;
    links?: Link[];
    runtime?: string | null;
    releaseInfo?: string | null;
    released?: string | null;
    genres?: string[];
    cast?: string[];
    directors?: string[];
    startTime: Date;
    endTime: Date;
    channelId: string;
    channelName: string;
    channelLogo: string | null;
    deepLinks?: MetaItemDeepLinks | VideoDeepLinks;
    raw: Record<string, unknown>;
};

type VideoLike = {
    id?: string;
    title?: string;
    name?: string;
    overview?: string | null;
    thumbnail?: string | null;
    links?: Link[];
    runtime?: string | null;
    released?: string | null;
    releaseInfo?: string | null;
    genres?: string[];
    cast?: string[];
    directors?: string[];
    startTime?: string;
    endTime?: string;
    deepLinks?: VideoDeepLinks;
};

export type EPGData = {
    programs: Record<string, EPGProgram[]>;
    loading: boolean;
    error: string | null;
};

export const useEpgNow = (
    enabled: boolean,
    intervalMs = EPG_NOW_REFRESH_INTERVAL
): number => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        setNow(Date.now());
        const interval = window.setInterval(() => setNow(Date.now()), intervalMs);

        return () => window.clearInterval(interval);
    }, [enabled, intervalMs]);

    return now;
};

type MetaResponse = {
    meta?: {
        videos?: VideoLike[];
    };
};

const metaCache = new Map<string, Promise<EPGProgram[]>>();

const programDeepLinks = (video: VideoLike, channel: EPGChannel): MetaItemDeepLinks | VideoDeepLinks | undefined => {
    if (video.deepLinks) {
        return video.deepLinks;
    }

    if (typeof video.id !== 'string' || video.id.length === 0 || !channel.deepLinks) {
        return channel.deepLinks;
    }

    const base = typeof channel.deepLinks.metaDetailsStreams === 'string' ?
        channel.deepLinks.metaDetailsStreams
        :
        typeof channel.deepLinks.metaDetailsVideos === 'string' ?
            channel.deepLinks.metaDetailsVideos
            :
            null;

    if (base === null) {
        return channel.deepLinks;
    }

    return {
        ...channel.deepLinks,
        metaDetailsStreams: `${base.replace(/\/$/, '')}/${encodeURIComponent(video.id)}`,
    };
};

const normalizeProgram = (video: VideoLike, channel: EPGChannel): EPGProgram | null => {
    if (typeof video.startTime !== 'string' || typeof video.endTime !== 'string') {
        return null;
    }

    const startTime = new Date(video.startTime);
    const endTime = new Date(video.endTime);

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || endTime <= startTime) {
        return null;
    }

    return {
        id: video.id,
        title: video.title ?? video.name ?? channel.name,
        overview: video.overview ?? null,
        thumbnail: video.thumbnail ?? null,
        links: video.links,
        runtime: video.runtime ?? null,
        releaseInfo: video.releaseInfo ?? null,
        released: video.released ?? null,
        genres: video.genres,
        cast: video.cast,
        directors: video.directors,
        startTime,
        endTime,
        channelId: channel.id,
        channelName: channel.name,
        channelLogo: channel.logo,
        deepLinks: programDeepLinks(video, channel),
        raw: video as unknown as Record<string, unknown>,
    };
};

const fetchChannelPrograms = async (base: string, channel: EPGChannel): Promise<EPGProgram[]> => {
    const url = addonResourceUrl(base, 'meta', channel.type, channel.id);
    if (url === null) return [];

    const resp = await fetch(url);
    if (!resp.ok) return [];

    const result = await resp.json() as MetaResponse;
    return (result.meta?.videos ?? [])
        .map((video) => normalizeProgram(video, channel))
        .filter((program): program is EPGProgram => program !== null);
};

const getChannelPrograms = (base: string, channel: EPGChannel): Promise<EPGProgram[]> => {
    const key = `${base}|${channel.type}|${channel.id}`;
    const cached = metaCache.get(key);
    if (cached) return cached;

    const request = fetchChannelPrograms(base, channel).catch(() => []);
    metaCache.set(key, request);
    return request;
};

export const useEPG = (base: string | null, channels: EPGChannel[]): EPGData => {
    const [state, setState] = useState<EPGData>({
        programs: {},
        loading: false,
        error:    null,
    });

    useEffect(() => {
        if (base === null || channels.length === 0) {
            setState({ programs: {}, loading: false, error: null });
            return;
        }

        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true, error: null }));

        Promise.all(channels.map((channel) => getChannelPrograms(base, channel))).then((results) => {
            if (cancelled) return;

            const programs = channels.reduce<Record<string, EPGProgram[]>>((result, channel, index) => {
                result[channel.id] = results[index] ?? [];
                return result;
            }, {});

            setState({
                programs,
                loading: false,
                error: null,
            });
        }).catch((err: unknown) => {
            if (!cancelled) {
                const msg = err instanceof Error ? err.message : String(err);
                setState((prev) => ({ ...prev, loading: false, error: msg }));
            }
        });

        return () => { cancelled = true; };
    }, [base, channels]);

    return state;
};
