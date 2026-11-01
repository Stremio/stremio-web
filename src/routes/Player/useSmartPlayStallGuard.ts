import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
    enabled: boolean;
    time: number | null;
    buffering: boolean | null;
    paused: boolean | null;
    currentHeight: number;
    lowerHeight: number;
};

const REBUFFER_MIN_MS = 1000;
const REBUFFER_WINDOW_MS = 60_000;
const REBUFFER_TRIGGER_COUNT = 3;
const SUGGESTION_COOLDOWN_MS = 120_000;
const PLAYBACK_GRACE_MS = 5000;

const useSmartPlayStallGuard = ({
    enabled,
    time,
    buffering,
    paused,
    currentHeight,
    lowerHeight,
}: Options) => {
    const [suggestion, setSuggestion] = useState<number | null>(null);
    const bufferingStartedAt = useRef<number | null>(null);
    const rebuffers = useRef<number[]>([]);
    const lastSuggestionAt = useRef(0);
    const lastTime = useRef<number | null>(time);

    useEffect(() => {
        if (time !== null && time !== lastTime.current) {
            lastTime.current = time;
        }
    }, [time]);

    useEffect(() => {
        setSuggestion(null);
        rebuffers.current = [];
        bufferingStartedAt.current = null;
    }, [currentHeight]);

    useEffect(() => {
        if (!enabled || paused === true || suggestion !== null) {
            bufferingStartedAt.current = null;
            return;
        }
        const now = Date.now();
        const withinPlayback = typeof time === 'number' && time > PLAYBACK_GRACE_MS;
        if (buffering === true && withinPlayback) {
            if (bufferingStartedAt.current === null) {
                bufferingStartedAt.current = now;
            }
            return;
        }
        if (bufferingStartedAt.current === null) {
            return;
        }
        const duration = now - bufferingStartedAt.current;
        bufferingStartedAt.current = null;
        if (duration < REBUFFER_MIN_MS) {
            return;
        }
        rebuffers.current = [
            ...rebuffers.current.filter((at) => now - at < REBUFFER_WINDOW_MS),
            now,
        ];
        if (rebuffers.current.length < REBUFFER_TRIGGER_COUNT) {
            return;
        }
        rebuffers.current = [];
        if (
            lowerHeight > 0 &&
            lowerHeight < currentHeight &&
            now - lastSuggestionAt.current >= SUGGESTION_COOLDOWN_MS
        ) {
            lastSuggestionAt.current = now;
            setSuggestion(lowerHeight);
        }
    }, [enabled, paused, buffering, time, currentHeight, lowerHeight, suggestion]);

    const dismiss = useCallback(() => {
        setSuggestion(null);
    }, []);

    return { suggestion, dismiss };
};

export default useSmartPlayStallGuard;
