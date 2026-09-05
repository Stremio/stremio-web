// Copyright (C) 2017-2026 Smart code 203358507

const SUBTITLES_DELAY_STEP_MS = 100;
const SUBTITLES_DELAY_REPEAT_DELAY_MS = 250;
const SUBTITLES_DELAY_REPEAT_INTERVAL_MS = 100;
const INITIAL_STEP_MULTIPLIER = 3;
const MAX_STEP_MULTIPLIER = 6;

const snapSubtitleDelay = (delay: number, direction: number) => {
    const snap = direction > 0 ? Math.floor : Math.ceil;
    return snap(delay / SUBTITLES_DELAY_STEP_MS) * SUBTITLES_DELAY_STEP_MS;
};

const getSubtitleDelayStepMultiplier = (heldForMs: number) => {
    return Math.min(Math.floor(heldForMs / 1000) + INITIAL_STEP_MULTIPLIER, MAX_STEP_MULTIPLIER);
};

export {
    getSubtitleDelayStepMultiplier,
    SUBTITLES_DELAY_STEP_MS,
    SUBTITLES_DELAY_REPEAT_DELAY_MS,
    SUBTITLES_DELAY_REPEAT_INTERVAL_MS,
    snapSubtitleDelay,
};
