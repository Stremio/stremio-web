// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PrimaryAction } from './Actions';
import { getEpisodeLabel, getMinutesLeft } from './format';

const usePrimaryAction = (metaItem: MetaItemMetaDetails | null, video: Video | null, libraryItem: LibraryItem | null, streams: MetaDetails['streams']): PrimaryAction | null => {
    const { t } = useTranslation();

    return useMemo(() => {
        if (metaItem === null) {
            return null;
        }

        if (video !== null) {
            const lastUsed = streams
                .flatMap((resource) => resource.content.type === 'Ready' ? resource.content.content : [])
                .find((stream) => stream.lastUsed === true) ?? null;
            const minutes = getMinutesLeft(libraryItem, video.id);
            if (lastUsed === null || minutes === null || typeof lastUsed.deepLinks?.player !== 'string') {
                return null;
            }

            return {
                label: t('LIBRARY_RESUME'),
                sublabel: t('CONTINUE_WATCHING_TIME_LEFT', { minutes }),
                href: lastUsed.deepLinks.player,
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
    }, [metaItem, video, libraryItem, streams, t]);
};

export default usePrimaryAction;
