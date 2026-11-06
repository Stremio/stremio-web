// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCore } from 'stremio/core';

export const MAX_CATALOGS = 3;

const NUDGE_DURATION = 2400;

export type Nudge = {
    id: number,
    keepOne: boolean,
};

const useBoardSpotlight = (profile: Profile, catalogs: BoardCatalog[]) => {
    const core = useCore();
    const spotlight = profile.settings.boardSpotlight;
    const [nudge, setNudge] = useState<Nudge | null>(null);
    const picks = useMemo(() => {
        return catalogs
            .filter(({ selected }) => selected !== null)
            .sort((a, b) => (a.selected ?? 0) - (b.selected ?? 0));
    }, [catalogs]);
    const isDefault = useMemo(() => {
        const defaults = catalogs.filter((catalog) => catalog.default);
        return picks.length === defaults.length && picks.every((pick, index) => pick === defaults[index]);
    }, [catalogs, picks]);

    useEffect(() => {
        if (nudge !== null) {
            const timeout = setTimeout(() => setNudge(null), NUDGE_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [nudge]);

    const update = useCallback((changes: Partial<BoardSpotlight>) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    boardSpotlight: {
                        ...profile.settings.boardSpotlight,
                        ...changes,
                    },
                },
            },
        });
    }, [profile.settings, core.transport]);

    const toggleEnabled = useCallback(() => update({ enabled: !spotlight.enabled }), [spotlight.enabled, update]);
    const toggleCatalogRows = useCallback(() => update({ showCatalogRows: !spotlight.showCatalogRows }), [spotlight.showCatalogRows, update]);
    const reset = useCallback(() => {
        setNudge(null);
        update({ catalogs: [] });
    }, [update]);
    const remove = useCallback((catalog: BoardCatalog) => {
        setNudge(null);
        update({ catalogs: picks.filter((pick) => pick !== catalog).map(({ request }) => request) });
    }, [picks, update]);
    const toggle = useCallback((catalog: BoardCatalog) => {
        if (catalog.selected === null && picks.length < MAX_CATALOGS) {
            setNudge(null);
            update({ catalogs: [...picks, catalog].map(({ request }) => request) });
        } else if (catalog.selected !== null && picks.length > 1) {
            remove(catalog);
        } else {
            setNudge((nudge) => ({ id: (nudge?.id ?? 0) + 1, keepOne: catalog.selected !== null }));
        }
    }, [picks, update, remove]);

    return {
        enabled: spotlight.enabled,
        showCatalogRows: spotlight.showCatalogRows,
        picks,
        isDefault,
        nudge,
        toggleEnabled,
        toggleCatalogRows,
        toggle,
        remove,
        reset,
    };
};

export default useBoardSpotlight;
