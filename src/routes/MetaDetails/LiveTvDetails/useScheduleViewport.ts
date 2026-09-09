// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EPGProgram, EPG_PIXELS_PER_HOUR, HOUR_IN_MS } from 'stremio/common/EPG';

const MIN_SCALE = 30;
const MAX_SCALE = 9600;
const MIN_PROGRAM_WIDTH = 160;
const TRANSITION_DURATION = 300;
const clampScale = (scale: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
const programIndexAt = (programs: EPGProgram[], time: number, tolerance = 0) => programs.findIndex((program) => program.endTime.getTime() > time + tolerance);

const fitScale = (programs: EPGProgram[], index: number, width: number) => {
    const nearby = programs.slice(index, index + 3);
    const first = nearby[0];
    const available = Math.max(1, width - 16);
    const duration = (program: EPGProgram) => program.endTime.getTime() - program.startTime.getTime();
    const span = Math.max(...nearby.map((program) => program.endTime.getTime())) - first.startTime.getTime();
    // Keep the focused programme visible while fitting readable neighbours where space allows.
    return clampScale(Math.min(available * HOUR_IN_MS / duration(first), Math.max(
        available * HOUR_IN_MS / span,
        MIN_PROGRAM_WIDTH * HOUR_IN_MS / Math.min(...nearby.map(duration))
    )));
};

const useScheduleViewport = (programs: EPGProgram[], start: number, activeStart: number | undefined) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<number | null>(null);
    const animationRef = useRef<number | null>(null);
    const focusRef = useRef<{ start: number; activeStart: number; width: number } | null>(null);
    const followingRef = useRef(true);
    const [viewport, setViewport] = useState({ left: 0, width: 0 });
    const [scale, setScale] = useState(EPG_PIXELS_PER_HOUR);
    const [automatic, setAutomatic] = useState(true);

    const measure = useCallback(() => {
        const element = viewportRef.current;
        if (element) setViewport((previous) => previous.left === element.scrollLeft && previous.width === element.clientWidth
            ? previous : { left: element.scrollLeft, width: element.clientWidth });
    }, []);

    const moveTo = useCallback((time: number, nextScale: number, smooth = false) => {
        const element = viewportRef.current;
        if (!element) return;
        if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        const value = clampScale(nextScale);
        const fromLeft = element.scrollLeft;
        const toLeft = Math.max(0, (time - start) * value / HOUR_IN_MS);
        const apply = (progress: number) => {
            const currentScale = scale + (value - scale) * progress;
            const left = fromLeft + (toLeft - fromLeft) * progress;
            if (value !== scale) {
                anchorRef.current = start + left * HOUR_IN_MS / currentScale;
                setScale(currentScale);
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
        if (element && anchorRef.current !== null) {
            element.scrollLeft = Math.max(0, (anchorRef.current - start) * scale / HOUR_IN_MS);
            anchorRef.current = null;
            measure();
        }
    }, [scale, start, measure]);

    useLayoutEffect(() => {
        if (viewport.width === 0 || activeStart === undefined) return;
        const previous = focusRef.current;
        focusRef.current = { start, activeStart, width: viewport.width };
        const follow = !previous || followingRef.current && previous.activeStart !== activeStart;
        const resized = previous && previous.width !== viewport.width;
        const shifted = previous && previous.start !== start;
        if (!follow && !resized && !shifted) return;
        const time = follow ? activeStart : previous.start + viewport.left * HOUR_IN_MS / scale;
        const index = programIndexAt(programs, time, follow ? 0 : HOUR_IN_MS / scale);
        if (index >= 0) moveTo(time, automatic ? fitScale(programs, index, viewport.width) : scale);
    }, [activeStart, start, viewport, programs, automatic, scale, moveTo]);

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        let frame: number | null = null;
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(() => { frame = null; measure(); });
        };
        const onInput = () => {
            followingRef.current = false;
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
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
        followingRef.current = false;
        setAutomatic(false);
        const value = clampScale(scale * factor);
        const center = start + (element.scrollLeft + element.clientWidth / 2) * HOUR_IN_MS / scale;
        moveTo(center - element.clientWidth * HOUR_IN_MS / value / 2, value, true);
    };
    const fit = () => {
        const element = viewportRef.current;
        if (!element) return;
        followingRef.current = false;
        setAutomatic(true);
        const time = start + element.scrollLeft * HOUR_IN_MS / scale;
        const index = programIndexAt(programs, time, HOUR_IN_MS / scale);
        if (index >= 0) moveTo(time, fitScale(programs, index, element.clientWidth), true);
    };

    return { viewportRef, viewport, scale, automatic, zoom, fit, canZoomOut: scale > MIN_SCALE, canZoomIn: scale < MAX_SCALE };
};

export default useScheduleViewport;
