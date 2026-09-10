// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

const useMediaQuery = (query: string): boolean => {
    const subscribe = useCallback((onStoreChange: () => void) => {
        const mediaQuery = window.matchMedia(query);
        mediaQuery.addEventListener('change', onStoreChange);
        return () => {
            mediaQuery.removeEventListener('change', onStoreChange);
        };
    }, [query]);

    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMediaQuery;
