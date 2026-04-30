// Copyright (C) 2017-2023 Smart code 203358507

/**
 * Segment start/end in metadata are in seconds (see Stremio stream behaviorHints.segments).
 * Player time state is in milliseconds.
 */
const SEC_TO_MS = 1000;

const normalizePlaybackSegments = (stream) => {
    const raw =
        stream &&
    stream.behaviorHints &&
    Array.isArray(stream.behaviorHints.segments)
            ? stream.behaviorHints.segments
            : [];
    return raw
        .map((s) => ({
            type: s.type,
            start:
        typeof s.start === 'number' ? Math.round(s.start * SEC_TO_MS) : NaN,
            end: typeof s.end === 'number' ? Math.round(s.end * SEC_TO_MS) : NaN,
        }))
        .filter(
            (s) =>
                (s.type === 'intro' || s.type === 'credits') &&
        !Number.isNaN(s.start) &&
        !Number.isNaN(s.end) &&
        s.start <= s.end,
        );
};

/**
 * Returns the active segment for the current time. Credits take priority over intro when both match.
 */
const findActivePlaybackSegment = (timeMs, normalizedSegments) => {
    if (
        typeof timeMs !== 'number' ||
    !Number.isFinite(timeMs) ||
    !normalizedSegments.length
    ) {
        return null;
    }
    const inCredits = normalizedSegments.find(
        (s) => s.type === 'credits' && timeMs >= s.start && timeMs <= s.end,
    );
    if (inCredits) {
        return inCredits;
    }
    const inIntro = normalizedSegments.find(
        (s) => s.type === 'intro' && timeMs >= s.start && timeMs <= s.end,
    );
    return inIntro || null;
};

module.exports = {
    normalizePlaybackSegments,
    findActivePlaybackSegment,
};
