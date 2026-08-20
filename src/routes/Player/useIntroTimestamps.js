// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { createIntroDbClient } = require('theintrodb');

const CACHE_PREFIX = 'tidb_intro_';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const client = createIntroDbClient();

const parseVideoId = (videoId) => {
    if (typeof videoId !== 'string' || !videoId.startsWith('tt')) {
        return null;
    }

    const parts = videoId.split(':');
    const imdbId = parts[0];

    if (parts.length >= 3) {
        const season = parseInt(parts[1], 10);
        const episode = parseInt(parts[2], 10);
        if (!isNaN(season) && !isNaN(episode)) {
            return { imdbId, season, episode };
        }
    }

    return { imdbId, season: null, episode: null };
};

const getCached = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (Date.now() - data.fetchedAt > CACHE_TTL_MS) {
            localStorage.removeItem(key);
            return null;
        }
        return data.intro;
    } catch (_e) {
        return null;
    }
};

const setCached = (key, intro) => {
    try {
        localStorage.setItem(key, JSON.stringify({ intro, fetchedAt: Date.now() }));
    } catch (_e) {
        // storage full or unavailable
    }
};

const useIntroTimestamps = (player, duration) => {
    const [intro, setIntro] = React.useState(null);

    const videoId = React.useMemo(() => {
        return player?.selected?.streamRequest?.path?.id ?? null;
    }, [player?.selected?.streamRequest?.path?.id]);

    const parsed = React.useMemo(() => {
        return videoId ? parseVideoId(videoId) : null;
    }, [videoId]);

    React.useEffect(() => {
        if (!parsed) {
            setIntro(null);
            return;
        }

        const cacheKey = CACHE_PREFIX + videoId;
        const cached = getCached(cacheKey);
        if (cached !== null) {
            setIntro(cached);
            return;
        }

        let cancelled = false;

        const fetchIntro = async () => {
            try {
                const params = { imdbId: parsed.imdbId };
                if (parsed.season !== null) params.season = parsed.season;
                if (parsed.episode !== null) params.episode = parsed.episode;
                if (duration !== null && duration !== undefined) {
                    params.durationMs = Math.round(duration);
                }

                const result = await client.getMedia(params);

                if (cancelled) return;

                if (result.intro && result.intro.length > 0) {
                    const best = result.intro[0];
                    const introData = {
                        startMs: best.startMs,
                        endMs: best.endMs,
                    };
                    setCached(cacheKey, introData);
                    setIntro(introData);
                } else {
                    setCached(cacheKey, null);
                    setIntro(null);
                }
            } catch (_err) {
                if (!cancelled) {
                    setIntro(null);
                }
            }
        };

        fetchIntro();

        return () => {
            cancelled = true;
        };
    }, [parsed, duration, videoId]);

    return intro;
};

module.exports = useIntroTimestamps;
