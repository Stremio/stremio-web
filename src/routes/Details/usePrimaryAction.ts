// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PrimaryAction } from './Actions';
import { formatDate, getEpisodeLabel, getMinutesLeft } from './format';

const compareVideos = (a: Video, b: Video) => {
    const seasonA = a.season === 0 ? Number.MAX_SAFE_INTEGER : a.season ?? Number.MAX_SAFE_INTEGER;
    const seasonB = b.season === 0 ? Number.MAX_SAFE_INTEGER : b.season ?? Number.MAX_SAFE_INTEGER;
    return seasonA - seasonB || (a.episode ?? 0) - (b.episode ?? 0);
};

const getNextVideo = (videos: Video[], libraryItem: LibraryItem | null): Video | null => {
    const sorted = videos.slice().sort(compareVideos);
    const current = sorted.find((video) => video.id === libraryItem?.state.video_id) ?? null;
    if (current !== null && (!current.watched || getMinutesLeft(libraryItem, current.id) !== null)) {
        return current;
    }

    const start = current !== null ? sorted.indexOf(current) + 1 : 0;
    return sorted.slice(start).find((video) => !video.watched && !video.upcoming)
        ?? sorted.find((video) => !video.watched && !video.upcoming)
        ?? sorted[0]
        ?? null;
};

const usePrimaryAction = (metaItem: MetaItemMetaDetails | null, video: Video | null, libraryItem: LibraryItem | null, streams: MetaDetails['streams']): PrimaryAction | null => {
    const { t, i18n } = useTranslation();

    return useMemo(() => {
        if (metaItem === null) {
            return null;
        }

        if (video !== null) {
            const lastUsed = streams
                .flatMap((resource) => resource.content.type === 'Ready' ? resource.content.content : [])
                .find((stream) => stream.lastUsed === true) ?? null;
            if (lastUsed !== null && typeof lastUsed.deepLinks?.player === 'string') {
                const minutes = getMinutesLeft(libraryItem, video.id);
                return {
                    label: minutes !== null ? t('LIBRARY_RESUME') : t('CTX_WATCH'),
                    sublabel: minutes !== null ? t('CONTINUE_WATCHING_TIME_LEFT', { minutes }) : lastUsed.name,
                    href: lastUsed.deepLinks.player,
                };
            }

            if (video.upcoming) {
                return {
                    icon: 'calendar',
                    label: t('UPCOMING'),
                    sublabel: formatDate(video.released, i18n.language),
                    disabled: true,
                };
            }

            return null;
        }

        if (metaItem.videos.length > 0) {
            const next = getNextVideo(metaItem.videos, libraryItem);
            if (next === null || typeof next.deepLinks.metaDetailsStreams !== 'string') {
                return null;
            }

            const minutes = getMinutesLeft(libraryItem, next.id);
            const episode = getEpisodeLabel(next);
            const verb = minutes !== null ? t('LIBRARY_RESUME') : t('CTX_WATCH');
            if (next.upcoming) {
                return {
                    icon: 'calendar',
                    label: episode !== null ? `${t('UPCOMING')} ${episode}` : t('UPCOMING'),
                    sublabel: formatDate(next.released, i18n.language),
                    disabled: true,
                };
            }

            return {
                label: episode !== null ? `${verb} ${episode}` : verb,
                sublabel: minutes !== null ?
                    t('CONTINUE_WATCHING_TIME_LEFT', { minutes })
                    :
                    next.id === libraryItem?.state.video_id ? next.title : t('LIVE_TV_UP_NEXT'),
                href: next.deepLinks.metaDetailsStreams,
            };
        }

        const href = metaItem.deepLinks.player ?? metaItem.deepLinks.metaDetailsStreams;
        return typeof href === 'string' ? { label: t('CTX_WATCH'), href } : null;
    }, [metaItem, video, libraryItem, streams, t, i18n.language]);
};

export default usePrimaryAction;
