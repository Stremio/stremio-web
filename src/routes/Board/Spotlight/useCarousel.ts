// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useState } from 'react';

const useCarousel = (ids: string[], initiallyPaused: boolean) => {
    const [activeId, setActiveId] = useState(ids[0]);
    const [paused, setPaused] = useState(initiallyPaused);
    const [shown, setShown] = useState(() => new Set(ids.slice(0, 2)));
    const index = Math.max(ids.indexOf(activeId), 0);
    const currentId = ids[index];
    const nextId = ids[(index + 1) % ids.length];

    useEffect(() => {
        setShown((shown) => shown.has(currentId) && shown.has(nextId) ? shown : new Set(shown).add(currentId).add(nextId));
    }, [currentId, nextId]);

    const go = useCallback((next: number, manual: boolean) => {
        if (ids.length > 0) {
            setActiveId(ids[((next % ids.length) + ids.length) % ids.length]);
        }

        if (manual) {
            setPaused(true);
        }
    }, [ids]);

    const pause = useCallback(() => setPaused(true), []);
    const togglePaused = useCallback(() => setPaused((paused) => !paused), []);

    return { index, paused, shown, go, pause, togglePaused };
};

export default useCarousel;
