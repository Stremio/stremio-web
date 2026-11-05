// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useState } from 'react';

const useCarousel = (count: number, initiallyPaused: boolean) => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(initiallyPaused);
    const [shown, setShown] = useState(() => new Set(count > 0 ? [0, 1 % count] : []));
    const current = count > 0 ? index % count : 0;

    const go = useCallback((next: number, manual: boolean) => {
        if (count > 0) {
            const slide = ((next % count) + count) % count;
            const preload = (slide + 1) % count;
            setIndex(slide);
            setShown((shown) => shown.has(slide) && shown.has(preload) ? shown : new Set([...shown, slide, preload]));
        }

        if (manual) {
            setPaused(true);
        }
    }, [count]);

    const pause = useCallback(() => setPaused(true), []);
    const togglePaused = useCallback(() => setPaused((paused) => !paused), []);

    return { index: current, paused, shown, go, pause, togglePaused };
};

export default useCarousel;
