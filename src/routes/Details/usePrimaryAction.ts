// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PrimaryAction } from './Actions';
import useStreamPlay from './Streams/useStreamPlay';
import { getEpisodeLabel, getMinutesLeft } from './format';

const usePrimaryAction = (metaItem: MetaItemMetaDetails | null, video: Video | null, libraryItem: LibraryItem | null, streams: MetaDetails['streams'], canMarkWatched: boolean): PrimaryAction | null => {
    const { t } = useTranslation();
    const lastUsed = useMemo(() => {
        return video !== null ?
            streams
                .flatMap((resource) => resource.content.type === 'Ready' ? resource.content.content : [])
                .find((stream) => stream.lastUsed === true) ?? null
            :
            null;
    }, [video, streams]);
    const { href, target, download, play } = useStreamPlay(lastUsed, { videoId: video?.id, videoReleased: video?.released, canMarkWatched });

    return useMemo(() => {
        if (metaItem === null) {
            return null;
        }

        if (video !== null) {
            const minutes = getMinutesLeft(libraryItem, video.id);
            if (minutes === null || href === null) {
                return null;
            }

            return {
                label: t('LIBRARY_RESUME'),
                sublabel: t('CONTINUE_WATCHING_TIME_LEFT', { minutes }),
                href,
                target,
                download,
                onClick: play,
            };
        }

        const current = metaItem.videos.find((video) => video.id === libraryItem?.state.video_id) ?? null;
        const minutes = current !== null ? getMinutesLeft(libraryItem, current.id) : null;
        if (current === null || minutes === null || typeof current.deepLinks.metaDetailsStreams !== 'string') {
            return null;
        }

        const episode = getEpisodeLabel(current);
        return {
            label: episode !== null ? `${t('LIBRARY_RESUME')} ${episode}` : t('LIBRARY_RESUME'),
            sublabel: t('CONTINUE_WATCHING_TIME_LEFT', { minutes }),
            href: current.deepLinks.metaDetailsStreams,
        };
    }, [metaItem, video, libraryItem, href, target, download, play, t]);
};

export default usePrimaryAction;
