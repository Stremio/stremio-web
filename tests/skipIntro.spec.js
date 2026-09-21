// Copyright (C) 2017-2023 Smart code 203358507

const getSkipIntroTarget = require('../src/routes/Player/getSkipIntroTarget');

const valid = {
    intro: { from: 227500, to: 244500 },
    time: 233000,
    duration: 2889000,
    livePlayback: false,
    canSeek: true,
    streamReady: true,
    currentVideoMatches: true,
};

describe('getSkipIntroTarget', () => {
    test('returns the intro end while playback is inside a valid intro', () => {
        expect(getSkipIntroTarget(valid)).toBe(244500);
    });

    test('becomes available exactly at the intro start', () => {
        expect(getSkipIntroTarget({ ...valid, time: 227500 })).toBe(244500);
    });

    test('is unavailable before the intro starts', () => {
        expect(getSkipIntroTarget({ ...valid, time: 227499 })).toBeNull();
    });

    test('is unavailable at and after the intro end', () => {
        expect(getSkipIntroTarget({ ...valid, time: 244500 })).toBeNull();
        expect(getSkipIntroTarget({ ...valid, time: 244501 })).toBeNull();
    });

    test.each([
        ['live playback', { livePlayback: true }],
        ['unseekable playback', { canSeek: false }],
        ['stream not loaded', { streamReady: false }],
        ['stale or different video', { currentVideoMatches: false }],
        ['missing intro', { intro: null }],
    ])('fails closed for %s', (_name, override) => {
        expect(getSkipIntroTarget({ ...valid, ...override })).toBeNull();
    });

    test.each([
        ['time', { time: NaN }],
        ['duration', { duration: NaN }],
        ['intro start', { intro: { from: NaN, to: 244500 } }],
        ['intro end', { intro: { from: 227500, to: NaN } }],
    ])('fails closed for invalid %s', (_name, override) => {
        expect(getSkipIntroTarget({ ...valid, ...override })).toBeNull();
    });

    test.each([
        ['zero duration', { duration: 0 }],
        ['negative intro start', { intro: { from: -1, to: 244500 } }],
        ['zero length intro', { intro: { from: 227500, to: 227500 } }],
        ['reversed intro', { intro: { from: 244500, to: 227500 } }],
        ['intro beyond stream duration', { intro: { from: 227500, to: 2890000 } }],
    ])('rejects invalid segment geometry for %s', (_name, override) => {
        expect(getSkipIntroTarget({ ...valid, ...override })).toBeNull();
    });

    test('does not surface stale intro data during a new episode load', () => {
        const staleIntro = getSkipIntroTarget({
            ...valid,
            currentVideoMatches: false,
            streamReady: false,
        });
        expect(staleIntro).toBeNull();

        const currentIntro = getSkipIntroTarget(valid);
        expect(currentIntro).toBe(244500);
    });
});
