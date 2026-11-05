// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useMemo } from 'react';
import { useCore } from 'stremio/core';
import useModelState from 'stremio/common/useModelState';

const map = (ctx: Ctx) => ({ catalogs: ctx.boardCatalogs });

const useBoardSpotlight = (profile: Profile) => {
    const core = useCore();
    const { catalogs } = useModelState({ model: 'ctx', action: null, map }) as { catalogs: BoardCatalog[] };
    const spotlight = profile.settings.boardSpotlight;
    const selected = useMemo(() => catalogs.find(({ selected }) => selected) ?? null, [catalogs]);
    const isDefault = selected === null || selected === catalogs[0];

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
        catalogs,
        selected,
        isDefault,
        toggleEnabled,
        toggleCatalogRow,
        select,
    };
};

export default useBoardSpotlight;
