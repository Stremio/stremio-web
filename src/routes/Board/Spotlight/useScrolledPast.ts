// Copyright (C) 2017-2026 Smart code 203358507

import React, { useLayoutEffect, useState } from 'react';

const useScrolledPast = (sentinelRef: React.RefObject<HTMLElement>, scrollRef: React.RefObject<HTMLElement>, enabled: boolean) => {
    const [scrolled, setScrolled] = useState(false);

    useLayoutEffect(() => {
        const sentinel = sentinelRef.current;
        const root = scrollRef.current;
        if (!enabled || !sentinel || !root) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            setScrolled(!entry.isIntersecting && entry.rootBounds !== null && entry.boundingClientRect.top < entry.rootBounds.top);
        }, { root });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [sentinelRef, scrollRef, enabled]);

    return enabled && scrolled;
};

export default useScrolledPast;
