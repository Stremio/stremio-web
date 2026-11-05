// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useState } from 'react';

const useCarousel = (count: number) => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [shown, setShown] = useState(() => new Set<number>());
    const current = count > 0 ? index % count : 0;

    const go = useCallback((next: number, manual: boolean) => {
        if (count > 0) {
            setIndex(((next % count) + count) % count);
        }

        if (manual) {
            setPaused(true);
        }
    }, [count]);

    const togglePaused = useCallback(() => setPaused((paused) => !paused), []);

    useEffect(() => {
        if (count === 0) {
            return;
        }

        setShown((shown) => {
            const next = [current, (current + 1) % count].filter((slide) => !shown.has(slide));
            return next.length > 0 ? new Set([...shown, ...next]) : shown;
        });
    }, [current, count]);

    return { index: current, paused, shown, go, togglePaused };
};

export default useCarousel;
