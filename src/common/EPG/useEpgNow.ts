// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useState } from 'react';
import { EPG_NOW_REFRESH_INTERVAL } from './utils';

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
