// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useLayoutEffect, useRef } from 'react';
import useLiveRef from 'stremio/common/useLiveRef';

type Source = 'keyboard' | 'pointer';
type Hold = {
    source: Source,
    timer: ReturnType<typeof setTimeout> | null,
    speed: number,
    active: boolean,
};

const usePlaybackSpeedHold = (enabled: boolean, stream: unknown, playbackSpeed: number | null, setPlaybackSpeed: (speed: number) => void) => {
    const speedRef = useLiveRef(playbackSpeed);
    const holdRef = useRef<Hold | null>(null);
    const suppressClickRef = useRef(false);

    const finish = useCallback((source?: Source) => {
        const hold = holdRef.current;
        if (!hold || (source && source !== hold.source)) return null;

        holdRef.current = null;
        if (hold.timer !== null) clearTimeout(hold.timer);
        if (hold.active) {
            if (hold.source === 'pointer') suppressClickRef.current = true;
            setPlaybackSpeed(hold.speed);
        }
        return hold.active ? 'held' : 'pending';
    }, [setPlaybackSpeed]);

    const cancel = useCallback(() => {
        finish();
    }, [finish]);

    const start = useCallback((source: Source) => {
        if (!enabled || holdRef.current) return;

        suppressClickRef.current = false;
        const hold: Hold = { source, timer: null, speed: speedRef.current ?? 1, active: false };
        hold.timer = setTimeout(() => {
            hold.timer = null;
            hold.active = true;
            setPlaybackSpeed(2);
        }, 400);
        holdRef.current = hold;
    }, [enabled, setPlaybackSpeed, speedRef]);

    const isActive = useCallback(() => holdRef.current !== null, []);
    const consumeClick = useCallback(() => {
        const suppressed = suppressClickRef.current;
        suppressClickRef.current = false;
        return suppressed;
    }, []);

    useLayoutEffect(() => {
        if (!enabled) cancel();
        return cancel;
    }, [enabled, stream, cancel]);

    return { start, finish, cancel, isActive, consumeClick };
};

export default usePlaybackSpeedHold;
