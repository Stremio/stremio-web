// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect } from 'react';

export type ScrollMemory = { key: string, top: number };

export const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
    let parent = element?.parentElement ?? null;
    while (parent !== null && !['auto', 'scroll', 'overlay'].includes(window.getComputedStyle(parent).overflowY)) {
        parent = parent.parentElement;
    }

    return parent;
};

const useScrollMemory = (
    listRef: React.RefObject<HTMLElement>,
    memoryRef: React.MutableRefObject<ScrollMemory | null>,
    key: string,
    ready: boolean,
) => {
    useEffect(() => {
        const scrollParent = getScrollParent(listRef.current);
        if (!ready || !scrollParent || memoryRef.current?.key !== key) {
            return;
        }

        scrollParent.scrollTop = memoryRef.current.top;
        memoryRef.current = null;
    }, [listRef, memoryRef, key, ready]);

    return useCallback(() => {
        memoryRef.current = { key, top: getScrollParent(listRef.current)?.scrollTop ?? 0 };
    }, [listRef, memoryRef, key]);
};

export default useScrollMemory;
