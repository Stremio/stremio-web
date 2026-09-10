// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EPGProgram, EPG_PIXELS_PER_HOUR, HOUR_IN_MS } from 'stremio/common/EPG';

const MIN_SCALE = 30;
const MAX_SCALE = 9600;
const TRANSITION_DURATION = 300;
const clampScale = (scale: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));

const useScheduleViewport = (start: number, visible: boolean) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<number | null>(null);
    const animationRef = useRef<number | null>(null);
    const originRef = useRef(start);
    const [viewport, setViewport] = useState({ left: 0, width: 0 });
    const [scale, setScale] = useState(EPG_PIXELS_PER_HOUR);

    const measure = useCallback(() => {
        const element = viewportRef.current;
        if (element && element.clientWidth > 0) setViewport((previous) => previous.left === element.scrollLeft && previous.width === element.clientWidth
            ? previous : { left: element.scrollLeft, width: element.clientWidth });
    }, []);

    const moveTo = useCallback((time: number, nextScale: number, smooth = false) => {
        const element = viewportRef.current;
        if (!element) return;
        if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        const value = clampScale(nextScale);
        if (element.clientWidth === 0) {
            anchorRef.current = time;
            setScale(value);
            return;
        }
        const fromLeft = element.scrollLeft;
        const toLeft = Math.max(0, (time - start) * value / HOUR_IN_MS);
        const apply = (progress: number) => {
            const currentScale = scale + (value - scale) * progress;
            const left = Math.round(fromLeft + (toLeft - fromLeft) * progress);
            if (value !== scale) {
                anchorRef.current = start + left * HOUR_IN_MS / currentScale;
                setScale(currentScale);
                setViewport({ left, width: element.clientWidth });
            } else {
                element.scrollLeft = left;
                measure();
            }
        };
        if (!smooth || matchMedia('(prefers-reduced-motion: reduce)').matches) {
            apply(1);
            return;
        }
        const began = performance.now();
        const animate = (now: number) => {
            const progress = Math.min(1, (now - began) / TRANSITION_DURATION);
            // Interpolate both coordinates together so every programme moves continuously while zooming.
            apply(1 - Math.pow(1 - progress, 3));
            if (progress < 1) animationRef.current = requestAnimationFrame(animate);
            else animationRef.current = null;
        };
        animationRef.current = requestAnimationFrame(animate);
    }, [scale, start, measure]);

    useEffect(() => () => {
        if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    }, []);

    useLayoutEffect(() => {
        const element = viewportRef.current;
        if (!element || element.clientWidth === 0) return;
        if (originRef.current !== start) {
            anchorRef.current ??= originRef.current + element.scrollLeft * HOUR_IN_MS / scale;
            originRef.current = start;
        }
        if (anchorRef.current !== null) {
            element.scrollLeft = Math.max(0, (anchorRef.current - start) * scale / HOUR_IN_MS);
            anchorRef.current = null;
        }
        measure();
    }, [scale, start, visible, measure]);

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        let frame: number | null = null;
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(() => { frame = null; measure(); });
        };
        const onInput = () => {
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
            anchorRef.current = null;
        };
        const onWheel = (event: WheelEvent) => {
            if (event.ctrlKey) return;
            onInput();
            if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
            const previous = element.scrollLeft;
            element.scrollLeft += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1);
            if (element.scrollLeft !== previous) event.preventDefault();
        };
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        element.addEventListener('scroll', onScroll, { passive: true });
        element.addEventListener('wheel', onWheel, { passive: false });
        element.addEventListener('pointerdown', onInput, { passive: true });
        element.addEventListener('keydown', onInput);
        measure();
        return () => {
            observer.disconnect();
            element.removeEventListener('scroll', onScroll);
            element.removeEventListener('wheel', onWheel);
            element.removeEventListener('pointerdown', onInput);
            element.removeEventListener('keydown', onInput);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, [measure]);

    const zoom = (factor: number) => {
        const element = viewportRef.current;
        if (!element) return;
        const value = clampScale(scale * factor);
        const center = start + (element.scrollLeft + element.clientWidth / 2) * HOUR_IN_MS / scale;
        moveTo(center - element.clientWidth * HOUR_IN_MS / value / 2, value, true);
    };
    const focus = (program: EPGProgram, fit = false) => {
        const element = viewportRef.current;
        if (!element) return;
        const from = program.startTime.getTime();
        const to = program.endTime.getTime();
        const value = fit ? clampScale(element.clientWidth * HOUR_IN_MS / Math.max(HOUR_IN_MS / 2, (to - from) * 1.2)) : scale;
        const time = fit ? (from + to - element.clientWidth * HOUR_IN_MS / value) / 2 : from;
        moveTo(time, value, true);
    };
    const showTime = (time: number) => {
        const element = viewportRef.current;
        if (!element) return;
        const width = element.clientWidth || element.parentElement?.clientWidth || 0;
        moveTo(time - width * HOUR_IN_MS / scale / 2, scale, true);
    };

    return { viewportRef, viewport, scale, zoom, focus, showTime, canZoomOut: scale > MIN_SCALE, canZoomIn: scale < MAX_SCALE };
};

export default useScheduleViewport;
