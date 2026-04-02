// Copyright (C) 2017-2023 Smart code 203358507

import { useEffect, useState } from 'react';
import { parseThumbnailVtt, type ThumbnailCue } from './parseThumbnailVtt';

function useThumbnailCues(vttUrl: string | null | undefined): { cues: ThumbnailCue[], error: Error | null } {
    const [cues, setCues] = useState<ThumbnailCue[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (typeof vttUrl !== 'string' || vttUrl.length === 0) {
            setCues([]);
            setError(null);
            return;
        }

        let cancelled = false;
        setError(null);

        fetch(vttUrl, { credentials: 'omit' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Thumbnails VTT: ${res.status}`);
                }
                return res.text();
            })
            .then((text) => {
                if (cancelled) {
                    return;
                }
                setCues(parseThumbnailVtt(text));
            })
            .catch((e: unknown) => {
                if (cancelled) {
                    return;
                }
                setCues([]);
                setError(e instanceof Error ? e : new Error(String(e)));
            });

        return () => {
            cancelled = true;
        };
    }, [vttUrl]);

    return { cues, error };
}

export default useThumbnailCues;
