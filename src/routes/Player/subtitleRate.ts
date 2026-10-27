// Copyright (C) 2017-2026 Smart code 203358507

// Subtitle time scale: video time = cue time * rate + delay.
// rate = subtitle fps / video fps, e.g. subtitles made for 23.976 fps played on a 25 fps video.
type SubtitlesRatePreset = {
    id: string,
    label: string,
    rate: number,
};

const FPS_23_976 = 24000 / 1001;
const FPS_29_97 = 30000 / 1001;
const RATE_EPSILON = 1e-6;

const SUBTITLES_RATE_PRESETS: SubtitlesRatePreset[] = [
    { id: 'off', label: 'Same fps (off)', rate: 1 },
    { id: '23976-25', label: '23.976 → 25 fps', rate: FPS_23_976 / 25 },
    { id: '25-23976', label: '25 → 23.976 fps', rate: 25 / FPS_23_976 },
    { id: '24-25', label: '24 → 25 fps', rate: 24 / 25 },
    { id: '25-24', label: '25 → 24 fps', rate: 25 / 24 },
    { id: '23976-24', label: '23.976 → 24 fps', rate: FPS_23_976 / 24 },
    { id: '24-23976', label: '24 → 23.976 fps', rate: 24 / FPS_23_976 },
    { id: '2997-25', label: '29.97 → 25 fps', rate: FPS_29_97 / 25 },
    { id: '25-2997', label: '25 → 29.97 fps', rate: 25 / FPS_29_97 },
    { id: '30-2997', label: '30 → 29.97 fps', rate: 30 / FPS_29_97 },
    { id: '2997-30', label: '29.97 → 30 fps', rate: FPS_29_97 / 30 },
];

const findSubtitlesRatePreset = (rate: number | null): SubtitlesRatePreset | null => {
    if (typeof rate !== 'number' || !isFinite(rate)) return null;
    return SUBTITLES_RATE_PRESETS.find((item) => Math.abs(item.rate - rate) < RATE_EPSILON) ?? null;
};

export {
    SUBTITLES_RATE_PRESETS,
    findSubtitlesRatePreset,
};
