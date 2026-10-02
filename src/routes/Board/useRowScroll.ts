// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 1;

const useRowScroll = (itemsCount: number) => {
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollForward, setCanScrollForward] = useState(false);

    const onScroll = useCallback(() => {
        const list = nodeRef.current;
        if (list === null) {
            setCanScrollBack(false);
            setCanScrollForward(false);
            return;
        }

        setCanScrollBack(list.scrollLeft > SCROLL_THRESHOLD);
        setCanScrollForward(list.scrollLeft + list.clientWidth < list.scrollWidth - SCROLL_THRESHOLD);
    }, []);

    const scrollBy = useCallback((direction: number) => {
        const list = nodeRef.current;
        if (list !== null) {
            list.scrollBy({ left: direction * list.clientWidth * 0.9, behavior: 'smooth' });
        }
    }, []);

    const scrollBack = useCallback(() => scrollBy(-1), [scrollBy]);
    const scrollForward = useCallback(() => scrollBy(1), [scrollBy]);

    // Callback ref so the observer follows the list element as it mounts, unmounts or is replaced.
    const listRef = useCallback((node: HTMLDivElement | null) => {
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;
        nodeRef.current = node;
        if (node !== null) {
            resizeObserverRef.current = new ResizeObserver(onScroll);
            resizeObserverRef.current.observe(node);
        }

        onScroll();
    }, [onScroll]);

    // Adding items widens the content but not the list box, so the observer won't fire.
    useEffect(() => {
        onScroll();
    }, [itemsCount, onScroll]);

    return { listRef, canScrollBack, canScrollForward, onScroll, scrollBack, scrollForward };
};

export default useRowScroll;
