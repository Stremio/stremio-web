// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback } from 'react';
import { useCore } from 'stremio/core';

const useBoardSpotlight = (profile: Profile, catalogs: BoardCatalog[]) => {
    const core = useCore();
    const spotlight = profile.settings.boardSpotlight;
    const selected = catalogs.find(({ selected }) => selected) ?? null;
    const isDefault = selected === null || selected.default;

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
    const toggleCatalogRow = useCallback(() => update({ showCatalogRow: !spotlight.showCatalogRow }), [spotlight.showCatalogRow, update]);
    const select = useCallback((catalog: BoardCatalog | null) => update({ catalog: catalog?.request ?? null }), [update]);

    return {
        enabled: spotlight.enabled,
        showCatalogRow: spotlight.showCatalogRow,
        selected,
        isDefault,
        toggleEnabled,
        toggleCatalogRow,
        select,
    };
};

export default useBoardSpotlight;
