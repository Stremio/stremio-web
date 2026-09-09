// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EPGProgram, EPG_PIXELS_PER_HOUR, HOUR_IN_MS } from 'stremio/common/EPG';

const MIN_SCALE = 30;
const MAX_SCALE = 9600;
const MIN_PROGRAM_WIDTH = 160;
const SETTLE_DELAY = 220;
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
    const animationRef = useRef<{ frame: number; from: number; to: number } | null>(null);
    const focusRef = useRef<{ start: number; activeStart: number; width: number } | null>(null);
    const followingRef = useRef(true);
    const gestureRef = useRef<{ start: number; last: number; min: number; max: number; direction: number; held: boolean } | null>(null);
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
        if (animationRef.current !== null) cancelAnimationFrame(animationRef.current.frame);
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
        const animation = { frame: 0, from: start + fromLeft * HOUR_IN_MS / scale, to: time };
        const animate = (now: number) => {
            const progress = Math.min(1, (now - began) / TRANSITION_DURATION);
            // Interpolate both coordinates together so every programme moves continuously while zooming.
            apply(1 - Math.pow(1 - progress, 3));
            if (progress < 1) animation.frame = requestAnimationFrame(animate);
            else animationRef.current = null;
        };
        animation.frame = requestAnimationFrame(animate);
        animationRef.current = animation;
    }, [scale, start, measure]);

    useEffect(() => () => {
        if (animationRef.current !== null) cancelAnimationFrame(animationRef.current.frame);
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
        if (gestureRef.current || !follow && !resized && !shifted) return;
        const time = follow ? activeStart : previous.start + viewport.left * HOUR_IN_MS / scale;
        const index = programIndexAt(programs, time, follow ? 0 : HOUR_IN_MS / scale);
        if (index >= 0) moveTo(time, automatic ? fitScale(programs, index, viewport.width) : scale);
    }, [activeStart, start, viewport, programs, automatic, scale, moveTo]);

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        let frame: number | null = null;
        let timer: ReturnType<typeof setTimeout> | null = null;
        const settle = () => {
            const gesture = gestureRef.current;
            if (!gesture || gesture.held) return;
            gestureRef.current = null;
            if (Math.abs(element.scrollLeft - gesture.start) < 1) return;
            const time = start + element.scrollLeft * HOUR_IN_MS / scale;
            let index = programIndexAt(programs, time, HOUR_IN_MS / scale);
            if (index < 0) return;
            const program = programs[index];
            const left = (program.startTime.getTime() - start) * scale / HOUR_IN_MS;
            const right = (program.endTime.getTime() - start) * scale / HOUR_IN_MS;
            const insideLongProgram = element.scrollLeft > left && element.scrollLeft + element.clientWidth < right;
            if (!insideLongProgram) {
                if (gesture.direction > 0 && gesture.start >= left - 1 && index + 1 < programs.length) index++;
                else if (gesture.direction < 0 && element.scrollLeft < left - 1 && index > 0) index--;
            }
            const anchor = insideLongProgram ? time : programs[index].startTime.getTime();
            moveTo(anchor, automatic ? fitScale(programs, index, element.clientWidth) : scale, true);
        };
        const scheduleSettle = () => {
            if (timer !== null) clearTimeout(timer);
            timer = setTimeout(settle, SETTLE_DELAY);
        };
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(() => { frame = null; measure(); });
            const gesture = gestureRef.current;
            if (!gesture) return;
            const left = Math.max(gesture.min, Math.min(gesture.max, element.scrollLeft));
            if (element.scrollLeft !== left) element.scrollLeft = left;
            const delta = element.scrollLeft - gesture.last;
            if (delta !== 0) {
                gesture.direction = Math.sign(delta);
                gesture.last = element.scrollLeft;
                followingRef.current = false;
            }
            scheduleSettle();
        };
        const begin = () => {
            const animation = animationRef.current;
            if (animation !== null) cancelAnimationFrame(animation.frame);
            animationRef.current = null;
            if (!automatic || gestureRef.current) return;
            // A gesture can reach either neighbour, including when zoom makes short slots only a few pixels wide.
            const index = programIndexAt(programs, start + (element.scrollLeft + 1) * HOUR_IN_MS / scale);
            if (index < 0) return;
            let before = Math.max(0, index - 1);
            let after = Math.min(programs.length - 1, index + 1);
            if (animation) {
                const from = programIndexAt(programs, animation.from);
                const to = programIndexAt(programs, animation.to);
                // Reversing an unfinished snap returns to its source programme.
                if (from >= 0 && to >= 0 && from !== to) {
                    before = Math.min(from, to);
                    after = Math.max(from, to);
                }
            }
            const position = (index: number) => (programs[index].startTime.getTime() - start) * scale / HOUR_IN_MS;
            gestureRef.current = {
                start: element.scrollLeft,
                last: element.scrollLeft,
                min: Math.min(element.scrollLeft, position(before)),
                max: Math.max(element.scrollLeft, position(after)),
                direction: 0,
                held: false,
            };
        };
        const onWheel = (event: WheelEvent) => {
            if (event.ctrlKey) return;
            begin();
            if (automatic) scheduleSettle();
            if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
            const previous = element.scrollLeft;
            element.scrollLeft += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1);
            if (element.scrollLeft !== previous) event.preventDefault();
        };
        const hold = () => { begin(); if (gestureRef.current) gestureRef.current.held = true; };
        const release = () => {
            if (gestureRef.current) { gestureRef.current.held = false; scheduleSettle(); }
        };
        const onPointerDown = (event: PointerEvent) => { if (event.pointerType !== 'touch') hold(); };
        const onPointerUp = (event: PointerEvent) => { if (event.pointerType !== 'touch') release(); };
        const onKeyDown = (event: KeyboardEvent) => {
            followingRef.current = false;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') begin();
        };
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        element.addEventListener('scroll', onScroll, { passive: true });
        element.addEventListener('wheel', onWheel, { passive: false });
        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('touchstart', hold, { passive: true });
        element.addEventListener('keydown', onKeyDown);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
        window.addEventListener('touchend', release, { passive: true });
        window.addEventListener('touchcancel', release, { passive: true });
        measure();
        return () => {
            observer.disconnect();
            element.removeEventListener('scroll', onScroll);
            element.removeEventListener('wheel', onWheel);
            element.removeEventListener('pointerdown', onPointerDown);
            element.removeEventListener('touchstart', hold);
            element.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            window.removeEventListener('touchend', release);
            window.removeEventListener('touchcancel', release);
            if (frame !== null) cancelAnimationFrame(frame);
            if (timer !== null) clearTimeout(timer);
        };
    }, [programs, start, scale, automatic, moveTo, measure]);

    const zoom = (factor: number) => {
        const element = viewportRef.current;
        if (!element) return;
        gestureRef.current = null;
        followingRef.current = false;
        setAutomatic(false);
        const value = clampScale(scale * factor);
        const center = start + (element.scrollLeft + element.clientWidth / 2) * HOUR_IN_MS / scale;
        moveTo(center - element.clientWidth * HOUR_IN_MS / value / 2, value, true);
    };
    const fit = () => {
        const element = viewportRef.current;
        if (!element) return;
        gestureRef.current = null;
        followingRef.current = false;
        setAutomatic(true);
        const time = start + element.scrollLeft * HOUR_IN_MS / scale;
        const index = programIndexAt(programs, time, HOUR_IN_MS / scale);
        if (index >= 0) moveTo(time, fitScale(programs, index, element.clientWidth), true);
    };

    return { viewportRef, viewport, scale, automatic, zoom, fit, canZoomOut: scale > MIN_SCALE, canZoomIn: scale < MAX_SCALE };
};

export default useScheduleViewport;
