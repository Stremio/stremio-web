// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useCore } from 'stremio/core';
import { useModelState } from 'stremio/common';

const MODEL = 'live_tv_continue_watching';
const DAY_ROLLOVER_CHECK_INTERVAL = 60 * 1000;

export type LiveTvContinueWatching = {
    items: LiveTvGuideChannel[],
};

const useLiveTvContinueWatching = (): LiveTvContinueWatching => {
    const core = useCore();
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'LiveTvContinueWatching'
        }
    }), []);
    const liveTvContinueWatching = useModelState({ model: MODEL, action }) as LiveTvContinueWatching;
    React.useEffect(() => {
        let dayKey = new Date().toDateString();
        const interval = window.setInterval(() => {
            const nextKey = new Date().toDateString();
            if (nextKey !== dayKey) {
                dayKey = nextKey;
                core.transport.dispatch(action, MODEL);
            }
        }, DAY_ROLLOVER_CHECK_INTERVAL);
        return () => window.clearInterval(interval);
    }, [action]);
    return liveTvContinueWatching;
};

export default useLiveTvContinueWatching;
