// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const compareSeasons = (a: number, b: number) => (a || Number.MAX_SAFE_INTEGER) - (b || Number.MAX_SAFE_INTEGER);

const useSeasons = (videos: Video[], season: number | null, libraryItem: LibraryItem | null) => {
    const { t } = useTranslation();

    const seasons = useMemo(() => {
        return videos
            .map((video) => video.season)
            .filter((value, index, values): value is number => {
                return typeof value === 'number' && !Number.isNaN(value) && values.indexOf(value) === index;
            })
            .sort(compareSeasons);
    }, [videos]);

    const selectedSeason = useMemo(() => {
        if (season !== null && seasons.includes(season)) {
            return season;
        }

        const libraryVideo = videos.find((video) => video.id === libraryItem?.state.video_id);
        if (libraryVideo?.season && seasons.includes(libraryVideo.season)) {
            return libraryVideo.season;
        }

        return seasons.find((value) => value !== 0) ?? seasons[0] ?? null;
    }, [seasons, season, videos, libraryItem]);

    const seasonVideos = useMemo(() => {
        return videos
            .filter((video) => selectedSeason === null || video.season === selectedSeason)
            .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0));
    }, [videos, selectedSeason]);

    const options = useMemo(() => {
        return seasons.map((value) => ({
            value: String(value),
            label: value === 0 ? t('SPECIAL') : t('SEASON_NUMBER', { season: value }),
        }));
    }, [seasons, t]);

    return { seasons, selectedSeason, videos: seasonVideos, options };
};

export default useSeasons;
