// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useSyncExternalStore } from 'react';
import { scaleMediaQuery } from './interfaceScale';

const getServerSnapshot = () => false;

const useMediaQuery = (query: string): boolean => {
    const subscribe = useCallback((onStoreChange: () => void) => {
        const mediaQuery = window.matchMedia(scaleMediaQuery(query));
        mediaQuery.addEventListener('change', onStoreChange);
        window.addEventListener('resize', onStoreChange);
        return () => {
            mediaQuery.removeEventListener('change', onStoreChange);
            window.removeEventListener('resize', onStoreChange);
        };
    }, [query]);

    const getSnapshot = useCallback(() => window.matchMedia(scaleMediaQuery(query)).matches, [query]);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMediaQuery;
