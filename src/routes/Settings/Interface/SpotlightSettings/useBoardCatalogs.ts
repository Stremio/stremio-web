// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import useModelState from 'stremio/common/useModelState';

const useBoardCatalogs = (all: boolean): BoardCatalog[] => {
    const action = useMemo(() => ({
        action: 'Load',
        args: {
            model: 'BoardCatalogs',
            args: { all },
        },
    }), [all]);
    const { catalogs } = useModelState({ model: 'board_catalogs', action, deps: ['ctx'] }) as BoardCatalogs;
    return catalogs;
};

export default useBoardCatalogs;
