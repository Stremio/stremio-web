// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useSyncExternalStore } from 'react';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { EPG_NOW_REFRESH_INTERVAL } from './utils';

const createClock = (intervalMs: number) => {
    let now = Date.now();
    let timer: number | null = null;
    const listeners = new Set<() => void>();
    const update = () => {
        now = Date.now();
        listeners.forEach((listener) => listener());
    };
    const onVisibilityChange = () => {
        if (timer !== null) window.clearInterval(timer);
        timer = null;
        if (!document.hidden) {
            update();
            timer = window.setInterval(update, intervalMs);
        }
    };
    return {
        getSnapshot: () => now,
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            if (listeners.size === 1) {
                document.addEventListener('visibilitychange', onVisibilityChange);
                onVisibilityChange();
            }
            return () => {
                listeners.delete(listener);
                if (listeners.size === 0) {
                    if (timer !== null) window.clearInterval(timer);
                    timer = null;
                    document.removeEventListener('visibilitychange', onVisibilityChange);
                }
            };
        },
    };
};

const clocks = new Map<number, ReturnType<typeof createClock>>();
const unsubscribe = () => undefined;

export const useEpgNow = (enabled: boolean, intervalMs = EPG_NOW_REFRESH_INTERVAL): number => {
    const active = useRouteActive();
    const clock = clocks.get(intervalMs) ?? createClock(intervalMs);
    if (!clocks.has(intervalMs)) clocks.set(intervalMs, clock);
    const subscribe = useCallback((listener: () => void) => enabled && active ? clock.subscribe(listener) : unsubscribe, [enabled, active, clock]);
    return useSyncExternalStore(subscribe, clock.getSnapshot);
};
