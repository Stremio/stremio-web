// Copyright (C) 2017-2026 Smart code 203358507

const SUBTITLES_DELAY_STEP_MS = 100;

const snapSubtitleDelay = (delay: number, direction: number, step = SUBTITLES_DELAY_STEP_MS) => {
    const snap = direction > 0 ? Math.floor : Math.ceil;
    return snap(delay / step) * step;
};

export {
    SUBTITLES_DELAY_STEP_MS,
    snapSubtitleDelay,
};
