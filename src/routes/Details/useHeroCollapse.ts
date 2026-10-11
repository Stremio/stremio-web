// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect } from 'react';
import { getInterfaceScale } from 'stremio/common/interfaceScale';

const COLLAPSED_RATIO = 0.42;
const SHRINK_RATIO = 0.85;
const FADE_DISTANCE = 215;
const COPY_FADE_DISTANCE = 90;
const BAR_FADE_DISTANCE = 50;

const PROPERTIES = ['--hero-base', '--hero-shrink', '--hero-out', '--hero-opacity', '--hero-copy-scale', '--hero-copy-opacity', '--hero-bar-opacity'];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const useHeroCollapse = (rootRef: React.RefObject<HTMLElement>, scrollRef: React.RefObject<HTMLElement>, enabled: boolean) => {
    useEffect(() => {
        const root = rootRef.current;
        const scroller = scrollRef.current;
        if (!enabled || !root || !scroller) {
            return;
        }

        let frame: number | null = null;
        let base = 0;

        const update = () => {
            frame = null;
            const collapsed = base * COLLAPSED_RATIO;
            const limit = (base - collapsed) * SHRINK_RATIO;
            const offset = Math.max(0, scroller.scrollTop);
            const shrink = Math.min(offset, limit);
            const out = Math.max(0, offset - limit);
            root.style.setProperty('--hero-shrink', `${shrink}px`);
            root.style.setProperty('--hero-out', `${out}px`);
            root.style.setProperty('--hero-opacity', String(clamp(1 - out / FADE_DISTANCE)));
            root.style.setProperty('--hero-copy-scale', String(1 - 0.16 * (limit > 0 ? shrink / limit : 0)));
            root.style.setProperty('--hero-copy-opacity', String(clamp(1 - out / COPY_FADE_DISTANCE)));
            root.style.setProperty('--hero-bar-opacity', String(clamp((out - COPY_FADE_DISTANCE) / BAR_FADE_DISTANCE)));
        };

        const measure = () => {
            const scale = getInterfaceScale();
            base = Math.min((window.innerWidth / scale) * 4 / 3, (window.innerHeight / scale) * 0.7);
            root.style.setProperty('--hero-base', `${base}px`);
            update();
        };

        const onScroll = () => {
            if (frame === null) {
                frame = requestAnimationFrame(update);
            }
        };

        measure();
        scroller.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', measure);
        return () => {
            scroller.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measure);
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
            PROPERTIES.forEach((property) => root.style.removeProperty(property));
        };
    }, [rootRef, scrollRef, enabled]);
};

export default useHeroCollapse;
