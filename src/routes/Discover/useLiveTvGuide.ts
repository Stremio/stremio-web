// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useMemo } from 'react';
import { useCore } from 'stremio/core';
import { useModelState } from 'stremio/common';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { EPGChannel, EPGProgram, epgDateKey, epgDayWindow, parseEpgDate, toEpgProgram, useEpgNow } from 'stremio/common/EPG';

const MODEL = 'live_tv_guide';

const toChannel = ({ id, type, name, logo, poster }: MetaItemPreview, deepLinks?: MetaItemDeepLinks): EPGChannel => ({
    id,
    type,
    name,
    logo: logo ?? poster ?? null,
    deepLinks,
});

const useLiveTvGuide = (discover: Discover, epgDate: string | null, enabled: boolean) => {
    const core = useCore();
    const routeActive = useRouteActive();
    const active = enabled && routeActive;
    const now = useEpgNow(active);
    const followedDate = epgDate ?? epgDateKey(new Date(now));
    const day = useMemo(() => {
        const { start, end } = epgDayWindow(parseEpgDate(followedDate) ?? new Date());
        return { start: new Date(start).toISOString(), end: new Date(end).toISOString() };
    }, [followedDate]);
    const request = discover.selected?.request ?? null;
    const state = useModelState({ model: MODEL, action: null }) as LiveTvGuide | null;

    useEffect(() => {
        if (!active || request === null) return;
        core.transport.dispatch({
            action: 'Load',
            args: {
                model: 'LiveTvGuide',
                args: {
                    request,
                    date: followedDate,
                    day,
                    utcOffset: -new Date().getTimezoneOffset(),
                },
            },
        }, MODEL);
    }, [active, request, followedDate, day, core.transport]);

    useEffect(() => {
        if (!enabled) core.transport.dispatch({ action: 'Unload' }, MODEL);
    }, [enabled, core.transport]);

    const channels = useMemo(() => {
        return (state?.channels ?? []).map(({ channel, deepLinks }) => toChannel(channel, deepLinks));
    }, [state?.channels]);
    const programs = useMemo(() => {
        return (state?.channels ?? []).reduce<Record<string, EPGProgram[]>>((result, { channel, shows }) => {
            const epgChannel = toChannel(channel);
            result[channel.id] = shows
                .map((show) => toEpgProgram(show, epgChannel))
                .filter((program): program is EPGProgram => program !== null);
            return result;
        }, {});
    }, [state?.channels]);
    const catalog = state?.catalog ?? [];
    const errorPage = catalog.find((page): page is Extract<Loadable<void>, { type: 'Err' }> => page.type === 'Err');
    const loadNextPage = useCallback(() => {
        core.transport.dispatch({ action: 'LiveTvGuide', args: { action: 'LoadNextPage' } }, MODEL);
    }, [core.transport]);
    const onRetry = useCallback(() => {
        core.transport.dispatch({ action: 'LiveTvGuide', args: { action: 'Retry' } }, MODEL);
    }, [core.transport]);

    return {
        now,
        channels,
        programs,
        loading: catalog.length === 0 || catalog.some((page) => page.type === 'Loading'),
        error: errorPage === undefined ? null : typeof errorPage.content === 'string' ? errorPage.content : errorPage.content.content.message,
        hasNextPage: (state?.selectable?.nextPage ?? null) !== null,
        loadNextPage,
        onRetry,
        selectedDate: state?.selected?.date ?? epgDate,
        today: state?.selectable?.today ?? null,
        dayWindow: state?.selected?.day ?? null,
    };
};

export default useLiveTvGuide;
