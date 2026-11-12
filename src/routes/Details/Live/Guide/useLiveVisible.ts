// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { getScrollParent } from './scroll';

const useLiveVisible = (containerRef: React.RefObject<HTMLElement>, now: number, onChange?: (visible: boolean) => void) => {
    useEffect(() => {
        const container = containerRef.current;
        if (typeof onChange !== 'function' || !container) {
            return;
        }

        const live = container.querySelector<HTMLElement>('[aria-current="true"]');
        if (!live) {
            onChange(false);
            return;
        }

        const observer = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), {
            root: getScrollParent(container),
            rootMargin: '-25% 0px 0px 0px',
        });
        observer.observe(live);
        return () => observer.disconnect();
    }, [containerRef, now, onChange]);
};

export default useLiveVisible;
