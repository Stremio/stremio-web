// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useRef } from 'react';
import { revealNearest, scrollToFraction } from './scroll';

const ANCHOR_FRACTION = 0.4;

const useReveal = (
    containerRef: React.RefObject<HTMLElement>,
    selectedKey: string | null,
    nowToken: number,
    getAnchor: (container: HTMLElement) => HTMLElement | null,
    scrollOnMount: boolean,
) => {
    const revealedKeyRef = useRef(selectedKey);
    const anchoredTokenRef = useRef<number | null>(null);

    useEffect(() => {
        if (revealedKeyRef.current === selectedKey) {
            return;
        }

        revealedKeyRef.current = selectedKey;
        const selected = containerRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
        if (selected) {
            revealNearest(selected);
        }
    }, [selectedKey, containerRef]);

    useEffect(() => {
        const container = containerRef.current;
        const anchor = container ? getAnchor(container) : null;
        if (!anchor || anchoredTokenRef.current === nowToken) {
            return;
        }

        if (anchoredTokenRef.current !== null) {
            anchoredTokenRef.current = nowToken;
            scrollToFraction(anchor, ANCHOR_FRACTION, true);
            return;
        }

        const frame = requestAnimationFrame(() => {
            anchoredTokenRef.current = nowToken;
            if (scrollOnMount) {
                scrollToFraction(anchor, ANCHOR_FRACTION, false);
            }
        });
        return () => cancelAnimationFrame(frame);
    }, [nowToken, containerRef, getAnchor, scrollOnMount]);
};

export default useReveal;
