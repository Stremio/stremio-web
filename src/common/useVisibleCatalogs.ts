// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import getVisibleChildrenRange from './getVisibleChildrenRange';
import { useRouteActive } from './useRouteFocused';

const debounce: (callback: () => void, wait: number) => { (): void, cancel: () => void } = require('lodash.debounce');

type Props = {
    catalogs: NonNullable<CatalogsWithExtra['catalogs']>,
    loadRange: (range: { start: number, end: number }) => void,
    leadingRows?: number,
    preloadRows?: number,
};

const useVisibleCatalogs = ({ catalogs, loadRange, leadingRows = 0, preloadRows = 0 }: Props) => {
    const active = useRouteActive();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const catalogRows = useMemo(() => catalogs
        .map((catalog, index) => ({ catalog, index }))
        .filter(({ catalog }) => catalog.content?.type !== 'Err' || catalog.content.content !== 'EmptyContent'), [catalogs]);

    const measure = useCallback(() => {
        if (!active || !scrollContainerRef.current || catalogRows.length === 0) return;

        const range = getVisibleChildrenRange(scrollContainerRef.current);
        if (range === null) return;

        const firstRow = catalogRows[Math.max(0, range.start - leadingRows)];
        const lastIndex = range.end - leadingRows;
        const lastRowIndex = lastIndex < 0 ? firstRow.index - 1 : catalogRows[lastIndex].index;
        const start = Math.max(0, firstRow.index - preloadRows);
        const end = Math.min(catalogs.length - 1, lastRowIndex + preloadRows);
        if (end >= start) loadRange({ start, end });
    }, [active, catalogRows, catalogs.length, leadingRows, preloadRows, loadRange]);

    const onScroll = useMemo(() => debounce(measure, 250), [measure]);

    useLayoutEffect(() => {
        measure();
        return () => onScroll.cancel();
    }, [measure, onScroll]);

    return { catalogRows, scrollContainerRef, onScroll };
};

export default useVisibleCatalogs;
