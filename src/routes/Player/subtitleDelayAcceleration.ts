// Copyright (C) 2017-2026 Smart code 203358507

const SUBTITLES_DELAY_REPEAT_STEP_MS = 250;
const SUBTITLES_DELAY_REPEAT_INTERVAL_MS = 100;
const ACCELERATED_INTERVAL_FACTORS = [1, 1.25, 1.5, 1.75];

const getAccelerationTier = (heldForMs: number) => {
    return Math.min(Math.floor(heldForMs / 1000), ACCELERATED_INTERVAL_FACTORS.length - 1);
};

const getAcceleratedStep = (step: number, heldForMs: number) => {
    return step * (getAccelerationTier(heldForMs) + 1);
};

const getAcceleratedInterval = (interval: number, heldForMs: number) => {
    return interval * ACCELERATED_INTERVAL_FACTORS[getAccelerationTier(heldForMs)];
};

export {
    SUBTITLES_DELAY_REPEAT_INTERVAL_MS,
    SUBTITLES_DELAY_REPEAT_STEP_MS,
    getAcceleratedInterval,
    getAcceleratedStep,
};
