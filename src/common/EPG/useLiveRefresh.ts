// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { useCore } from 'stremio/core';
import { EPG_NOW_REFRESH_INTERVAL } from './constants';
import { useEpgNow } from './useEpgNow';

export const useLiveRefresh = (model: string, field: string, enabled: boolean, intervalMs = EPG_NOW_REFRESH_INTERVAL): number => {
    const core = useCore();
    const now = useEpgNow(enabled, intervalMs);

    useEffect(() => {
        if (enabled) {
            core.transport.dispatch({ action: model, args: { action: 'RefreshLive' } }, field);
        }
    }, [enabled, now, model, field, core.transport]);

    return now;
};
