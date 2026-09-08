// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EPGProgram, EPG_PIXELS_PER_HOUR, HOUR_IN_MS } from 'stremio/common/EPG';

const MIN_SCALE = 120;
const MAX_SCALE = 9600;
const MIN_PROGRAM_WIDTH = 160;

const useScheduleViewport = (programs: EPGProgram[], start: number, activeStart: number | undefined) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<{ time: number; fraction: number } | null>(null);
    const focusRef = useRef('');
    const [viewport, setViewport] = useState({ left: 0, width: 0 });
    const [scale, setScale] = useState(EPG_PIXELS_PER_HOUR);
    const [automatic, setAutomatic] = useState(true);

    const changeScale = useCallback((next: number, anchor?: number, fraction = 0.5) => {
        const element = viewportRef.current;
        const value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
        if (!element || value === scale) return;
        anchorRef.current = { time: anchor ?? start + ((element.scrollLeft + element.clientWidth / 2) / scale) * HOUR_IN_MS, fraction };
        setScale(value);
    }, [scale, start]);

    const fitVisible = useCallback((focus?: number) => {
        const element = viewportRef.current;
        if (!element) return;
        const from = start + (element.scrollLeft / scale) * HOUR_IN_MS;
        const to = from + (element.clientWidth / scale) * HOUR_IN_MS;
        const visible = programs.filter((program) => program.endTime.getTime() > from && program.startTime.getTime() < to);
        const duration = (program: EPGProgram) => program.endTime.getTime() - program.startTime.getTime();
        const shortest = Math.min(...visible.map(duration));
        let next = Math.max(EPG_PIXELS_PER_HOUR, MIN_PROGRAM_WIDTH * HOUR_IN_MS / shortest);
        const center = (from + to) / 2;
        if (next < scale && focus === undefined) {
            const candidates = Array.from(new Set([EPG_PIXELS_PER_HOUR, ...programs.map((program) => MIN_PROGRAM_WIDTH * HOUR_IN_MS / duration(program))]))
                .filter((candidate) => candidate >= EPG_PIXELS_PER_HOUR && candidate < scale).sort((a, b) => a - b);
            // Keep short entries readable in the expanded view as well, so Auto stays stable.
            next = candidates.find((candidate) => {
                const halfWindow = (element.clientWidth / candidate) * HOUR_IN_MS / 2;
                return programs.every((program) => program.endTime.getTime() <= center - halfWindow || program.startTime.getTime() >= center + halfWindow
                    || duration(program) * candidate / HOUR_IN_MS >= MIN_PROGRAM_WIDTH);
            }) ?? scale;
        }
        const dense = visible.filter((program) => duration(program) === shortest)
            .sort((a, b) => Math.abs(a.startTime.getTime() + shortest / 2 - center) - Math.abs(b.startTime.getTime() + shortest / 2 - center))[0];
        changeScale(next, focus ?? (next > scale && dense ? dense.startTime.getTime() + shortest / 2 : undefined), focus === undefined ? 0.5 : 0.25);
    }, [programs, scale, start, changeScale]);

    useLayoutEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        const focus = `${start}:${activeStart}:${viewport.width}`;
        if (focusRef.current !== focus && activeStart !== undefined) {
            focusRef.current = focus;
            anchorRef.current = null;
            element.scrollLeft = Math.max(0, ((activeStart - start) / HOUR_IN_MS) * scale - element.clientWidth / 4);
            if (automatic && viewport.width > 0) fitVisible(activeStart);
        } else if (anchorRef.current !== null) {
            element.scrollLeft = ((anchorRef.current.time - start) / HOUR_IN_MS) * scale - element.clientWidth * anchorRef.current.fraction;
            anchorRef.current = null;
        }
        setViewport((previous) => previous.left === element.scrollLeft && previous.width === element.clientWidth
            ? previous : { left: element.scrollLeft, width: element.clientWidth });
    }, [activeStart, start, viewport.width, scale, automatic, fitVisible]);

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        let frame: number | null = null;
        let settle: ReturnType<typeof setTimeout> | null = null;
        let userScrolling = false;
        const measure = () => {
            frame = null;
            setViewport((previous) => previous.left === element.scrollLeft && previous.width === element.clientWidth
                ? previous : { left: element.scrollLeft, width: element.clientWidth });
        };
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(measure);
            if (!automatic || !userScrolling) return;
            if (settle !== null) clearTimeout(settle);
            settle = setTimeout(() => {
                userScrolling = false;
                fitVisible();
            }, 220);
        };
        const onInput = () => { userScrolling = true; };
        const onWheel = (event: WheelEvent) => {
            if (event.ctrlKey) return;
            onInput();
            if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
            const previous = element.scrollLeft;
            element.scrollBy({ left: event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1) });
            if (element.scrollLeft !== previous) event.preventDefault();
        };
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        element.addEventListener('scroll', onScroll, { passive: true });
        element.addEventListener('wheel', onWheel, { passive: false });
        element.addEventListener('pointerdown', onInput);
        element.addEventListener('keydown', onInput);
        measure();
        return () => {
            observer.disconnect();
            element.removeEventListener('scroll', onScroll);
            element.removeEventListener('wheel', onWheel);
            element.removeEventListener('pointerdown', onInput);
            element.removeEventListener('keydown', onInput);
            if (frame !== null) cancelAnimationFrame(frame);
            if (settle !== null) clearTimeout(settle);
        };
    }, [automatic, fitVisible]);

    const zoom = (factor: number) => {
        setAutomatic(false);
        changeScale(scale * factor);
    };
    const fit = () => {
        setAutomatic(true);
        fitVisible();
    };

    return { viewportRef, viewport, scale, automatic, zoom, fit, canZoomOut: scale > MIN_SCALE, canZoomIn: scale < MAX_SCALE };
};

export default useScheduleViewport;
