// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useMemo, useState } from 'react';

export type EPGChannel = {
    id: string;
    name: string;
    logo: string | null;
    streamUrl: string | null;
};

export type EPGProgram = {
    title: string;
    start: string;
    stop: string;
    thumbnail: string | null;
    description: string | null;
};

export type EPGData = {
    channels: EPGChannel[];
    programs: Record<string, EPGProgram[]>;
    loading: boolean;
    error: string | null;
};

type EPGResponse = {
    channels: EPGChannel[];
    programs: Record<string, EPGProgram[]>;
};

const addonBaseUrl = (transportUrl: string): string | null => {
    try {
        const { protocol, host } = new URL(transportUrl);
        return `${protocol}//${host}`;
    } catch {
        return null;
    }
};

const addonCfg = (transportUrl: string): string | null => {
    try {
        const parts = new URL(transportUrl).pathname.split('/').filter(Boolean);
        return parts.find((p) => p.startsWith('c_')) ?? null;
    } catch {
        return null;
    }
};

const fetchEPG = async (addon: Addon, date: string): Promise<EPGResponse | null> => {
    const endpoint = addon.manifest.behaviorHints?.epgEndpoint;
    if (!endpoint) return null;

    const base = addonBaseUrl(addon.transportUrl);
    const cfg = addonCfg(addon.transportUrl);
    if (!base || !cfg) return null;

    const url = `${base}${endpoint}?cfg=${encodeURIComponent(cfg)}&date=${encodeURIComponent(date)}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return resp.json() as Promise<EPGResponse>;
};

export const useEPG = (addon: Addon | null, date?: string | Date): EPGData => {
    const [state, setState] = useState<EPGData>({
        channels: [],
        programs: {},
        loading:  true,
        error:    null,
    });

    const dateStr = useMemo(() => {
        if (typeof date === 'string') return date;
        const d = date instanceof Date ? date : new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [date]);

    useEffect(() => {
        if (!addon || !addon.manifest.types?.includes('tv')) {
            setState({ channels: [], programs: {}, loading: false, error: null });
            return;
        }

        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true, error: null }));

        fetchEPG(addon, dateStr).then((result: EPGResponse | null) => {
            if (cancelled) return;
            setState({
                channels: result?.channels ?? [],
                programs: result?.programs ?? {},
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
    }, [addon, dateStr]);

    return state;
};
