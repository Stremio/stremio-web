// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EPG_MAX_PIXELS_PER_HOUR, EPG_MIN_PIXELS_PER_HOUR, EPG_PIXELS_PER_HOUR, HOUR_IN_MS } from 'stremio/common/EPG';

export type GuideViewport = {
    left: number;
    top: number;
    width: number;
    height: number;
    minTickWidth: number;
};

const useGuideViewport = (dayStart: number, dayEnd: number, now: number) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const channelColumnRef = useRef<HTMLDivElement>(null);
    const nowRef = useRef(now);
    const positionRef = useRef<{ day: string; center: number | null }>({ day: '', center: null });
    const [viewport, setViewport] = useState<GuideViewport>({ left: 0, top: 0, width: 0, height: 0, minTickWidth: 100 });
    const [pixelsPerHour, setPixelsPerHour] = useState(EPG_PIXELS_PER_HOUR);

    useEffect(() => {
        nowRef.current = now;
    }, [now]);

    useLayoutEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        let frame: number | null = null;
        const measure = () => {
            frame = null;
            if (headerRef.current) headerRef.current.scrollLeft = element.scrollLeft;
            if (channelColumnRef.current) channelColumnRef.current.style.transform = `translateY(-${element.scrollTop}px)`;
            const minTickWidth = 6.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
            setViewport({ left: element.scrollLeft, top: element.scrollTop, width: element.clientWidth, height: element.clientHeight, minTickWidth });
        };
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(measure);
        };
        const observer = new ResizeObserver(onScroll);
        observer.observe(element);
        element.addEventListener('scroll', onScroll, { passive: true });
        measure();
        return () => {
            observer.disconnect();
            element.removeEventListener('scroll', onScroll);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    const scrollToTime = useCallback((time: number) => {
        const element = viewportRef.current;
        if (!element) return;
        element.scrollLeft = Math.max(0, ((time - dayStart) / HOUR_IN_MS) * pixelsPerHour - element.clientWidth / 2);
    }, [dayStart, pixelsPerHour]);

    // Day changes select Now; zoom preserves the time at the viewport centre.
    useLayoutEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        const day = `${dayStart}:${dayEnd}`;
        let time = positionRef.current.center;
        if (positionRef.current.day !== day) {
            element.scrollTop = 0;
            time = nowRef.current >= dayStart && nowRef.current < dayEnd ? nowRef.current : dayStart;
        }
        positionRef.current = { day, center: null };
        if (time === null) return;
        element.scrollLeft = Math.max(0, ((time - dayStart) / HOUR_IN_MS) * pixelsPerHour - element.clientWidth / 2);
        if (headerRef.current) headerRef.current.scrollLeft = element.scrollLeft;
        setViewport((previous) => ({ ...previous, left: element.scrollLeft, top: element.scrollTop }));
    }, [dayStart, dayEnd, pixelsPerHour]);

    const zoom = useCallback((factor: number) => {
        const element = viewportRef.current;
        if (!element) return;
        const next = Math.max(EPG_MIN_PIXELS_PER_HOUR, Math.min(EPG_MAX_PIXELS_PER_HOUR, pixelsPerHour * factor));
        if (next === pixelsPerHour) return;
        positionRef.current.center = dayStart + (element.scrollLeft + element.clientWidth / 2) * HOUR_IN_MS / pixelsPerHour;
        setPixelsPerHour(next);
    }, [dayStart, pixelsPerHour]);

    return { viewportRef, headerRef, channelColumnRef, viewport, pixelsPerHour, zoom, scrollToTime };
};

export default useGuideViewport;
