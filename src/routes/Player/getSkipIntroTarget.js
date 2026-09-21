// Copyright (C) 2017-2023 Smart code 203358507

const getSkipIntroTarget = ({
    intro,
    time,
    duration,
    livePlayback,
    canSeek,
    streamReady,
    currentVideoMatches,
}) => {
    if (livePlayback || !canSeek || !streamReady || !currentVideoMatches || intro === null) {
        return null;
    }

    if (!Number.isFinite(time) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(intro.from) ||
        !Number.isFinite(intro.to)) {
        return null;
    }

    if (duration <= 0 ||
        intro.from < 0 ||
        intro.to <= intro.from ||
        intro.to > duration) {
        return null;
    }

    return time >= intro.from && time < intro.to ? intro.to : null;
};

module.exports = getSkipIntroTarget;
