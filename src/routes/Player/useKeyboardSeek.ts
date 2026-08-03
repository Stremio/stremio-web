// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLiveRef } from 'stremio/common';

type DebouncedCallback = (() => void) & {
    cancel: () => void,
    flush: () => void,
};

type Props = {
    time: number | null,
    duration: number | null,
    onSeek: (time: number) => void,
    setSeeking: (seeking: boolean) => void,
};

const debounce = require('lodash.debounce') as (callback: () => void, wait: number) => DebouncedCallback;
const DEBOUNCE_TIME = 300;
const PREVIEW_TIME = 1500;
const HOLD_ACCELERATION = 1.05;
const MAX_HOLD_STEP = 0.1;

const useKeyboardSeek = ({ time, duration, onSeek, setSeeking }: Props) => {
    const [target, setTarget] = useState<number | null>(null);
    const targetRef = useRef<number | null>(null);
    const pendingRef = useRef(false);
    const holdStepRef = useRef<number | null>(null);
    const timeRef = useLiveRef(time);
    const durationRef = useLiveRef(duration);
    const onSeekRef = useLiveRef(onSeek);
    const setSeekingRef = useLiveRef(setSeeking);

    const stopHold = useCallback(() => {
        holdStepRef.current = null;
    }, []);
    const move = useCallback((offset: number) => {
        if (timeRef.current === null) return;

        const currentTime = targetRef.current ?? timeRef.current;
        const target = Math.max(currentTime + offset, 0);
        const clampedTarget = durationRef.current !== null && !isNaN(durationRef.current) ?
            Math.min(target, durationRef.current)
            :
            target;
        targetRef.current = clampedTarget;
        pendingRef.current = true;
        setTarget(clampedTarget);
        setSeekingRef.current(true);
    }, []);

    const reset = useCallback(debounce(() => {
        targetRef.current = null;
        pendingRef.current = false;
        setTarget(null);
    }, PREVIEW_TIME), []);
    const commit = useCallback(debounce(() => {
        if (pendingRef.current && targetRef.current !== null) {
            pendingRef.current = false;
            onSeekRef.current(targetRef.current);
            setSeekingRef.current(false);
            reset();
        }
    }, DEBOUNCE_TIME), []);
    const cancel = useCallback(() => {
        const active = pendingRef.current;
        stopHold();
        commit.cancel();
        reset.cancel();
        targetRef.current = null;
        pendingRef.current = false;
        setTarget(null);
        if (active) {
            setSeekingRef.current(false);
        }
    }, []);
    const flush = useCallback(() => {
        stopHold();
        if (pendingRef.current) {
            commit();
        }
        commit.flush();
        setSeekingRef.current(false);
    }, []);
    const release = useCallback(() => {
        stopHold();
        if (pendingRef.current) {
            commit();
            requestAnimationFrame(commit.flush);
        }
    }, []);
    const seekTo = useCallback((time: number) => {
        cancel();
        onSeekRef.current(time);
    }, []);
    const seekBy = useCallback((offset: number) => {
        if (timeRef.current === null) return;

        reset.cancel();
        commit.cancel();

        if (holdStepRef.current === null) {
            holdStepRef.current = offset;
        } else if (Math.sign(holdStepRef.current) === Math.sign(offset)) {
            const duration = durationRef.current;
            if (duration !== null && !isNaN(duration) && duration > 0) {
                holdStepRef.current = Math.sign(holdStepRef.current) * Math.min(Math.abs(holdStepRef.current) * HOLD_ACCELERATION, duration * MAX_HOLD_STEP);
            }
        } else {
            return;
        }

        move(holdStepRef.current);
    }, []);

    useLayoutEffect(() => {
        return () => {
            stopHold();
            commit.cancel();
            reset.cancel();
        };
    }, []);

    return {
        time: target,
        seekBy,
        seekTo,
        cancel,
        flush,
        release,
    };
};

export default useKeyboardSeek;
