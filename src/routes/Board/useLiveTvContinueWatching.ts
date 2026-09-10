// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useCore } from 'stremio/core';
import { useModelState } from 'stremio/common';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { useEpgNow } from 'stremio/common/EPG';

const MODEL = 'live_tv_continue_watching';

export type LiveTvContinueWatching = {
    items: LiveTvGuideChannel[],
};

const useLiveTvContinueWatching = (): LiveTvContinueWatching => {
    const core = useCore();
    const active = useRouteActive();
    const now = useEpgNow(active);
    const state = useModelState({ model: MODEL, action: null }) as LiveTvContinueWatching;
    React.useEffect(() => {
        core.transport.dispatch(active ? {
            action: 'Load', args: { model: 'LiveTvContinueWatching' },
        } : { action: 'Unload' }, MODEL);
    }, [active, now, core.transport]);
    return state;
};

export default useLiveTvContinueWatching;
