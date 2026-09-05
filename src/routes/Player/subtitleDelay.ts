// Copyright (C) 2017-2026 Smart code 203358507

const SUBTITLES_DELAY_STEP_MS = 100;

const snapSubtitleDelay = (delay: number, direction: number) => {
    const snap = direction > 0 ? Math.floor : Math.ceil;
    return snap(delay / SUBTITLES_DELAY_STEP_MS) * SUBTITLES_DELAY_STEP_MS;
};

export {
    SUBTITLES_DELAY_STEP_MS,
    snapSubtitleDelay,
};
