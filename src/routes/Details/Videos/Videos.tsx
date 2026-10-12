// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SegmentedControl from 'stremio/components/SegmentedControl';
import Toggle from 'stremio/components/Toggle';
import useMediaQuery from 'stremio/common/useMediaQuery';
import screenSizes from 'stremio/common/screen-sizes.less';
import EpisodePicker from '../EpisodePicker';
import Message from '../Message';
import Panel from '../Panel';
import Placeholder from '../Placeholder';
import { formatDate, getMinutesLeft } from '../format';
import Search from './Search';
import VideoRow from './Video';
import useScrollMemory from './useScrollMemory';
import useSeasons from './useSeasons';
import type { ScrollMemory } from './useScrollMemory';
import styles from './Videos.less';

export type { ScrollMemory };

type Props = {
    metaItem: MetaItemMetaDetails | null,
    error: boolean,
    libraryItem: LibraryItem | null,
    season: number | null,
    onSeasonSelect: (season: number) => void,
    onToggleNotifications: () => void,
    onMarkVideoWatched: (video: Pick<Video, 'id' | 'released'>, watched: boolean) => void,
    onMarkSeasonWatched: (season: number, watched: boolean) => void,
    onEpisodeSearch: (season: number, episode: number) => void,
    scrollMemoryRef: React.MutableRefObject<ScrollMemory | null>,
};

const NO_VIDEOS: Video[] = [];

const Videos = ({
    metaItem,
    error,
    libraryItem,
    season,
    onSeasonSelect,
    onToggleNotifications,
    onMarkVideoWatched,
    onMarkSeasonWatched,
    onEpisodeSearch,
    scrollMemoryRef,
}: Props) => {
    const { t, i18n } = useTranslation();
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xxsmall})`);
    const [search, setSearch] = useState('');
    const listRef = useRef<HTMLDivElement>(null);

    const { seasons, selectedSeason, videos, options } = useSeasons(metaItem?.videos ?? NO_VIDEOS, season, libraryItem);

    const filteredVideos = useMemo(() => {
        const query = search.toLowerCase();
        return query.length === 0 ?
            videos
            :
            videos.filter((video) => {
                return video.title?.toLowerCase().includes(query) ||
                    formatDate(video.released, i18n.language)?.toLowerCase().includes(query);
            });
    }, [videos, search, i18n.language]);

    const seasonWatched = useMemo(() => videos.every((video) => video.watched), [videos]);

    const ready = metaItem !== null && !error && videos.length > 0;
    const onSelectVideo = useScrollMemory(listRef, scrollMemoryRef, `${metaItem?.id}:${selectedSeason}`, ready);

    const handleSeasonSelect = useCallback((value: string) => {
        onSeasonSelect(Number(value));
    }, [onSeasonSelect]);

    const showNotifications = metaItem !== null && metaItem.inLibrary && libraryItem !== null && metaItem.videos.length > 0;

    if (metaItem === null && !error) {
        return (
            <Panel ariaLabel={t('VIDEOS')} header={<Placeholder variant={'control'} />}>
                <Placeholder variant={'list'} />
            </Panel>
        );
    }

    if (!ready) {
        return (
            <Panel ariaLabel={t('VIDEOS')}>
                <EpisodePicker seriesId={metaItem?.id ?? ''} onSubmit={onEpisodeSearch} />
                <Message label={t('ERR_NO_VIDEOS_FOR_META')} />
            </Panel>
        );
    }

    return (
        <Panel
            ariaLabel={t('VIDEOS')}
            header={
                seasons.length > 1 ?
                    <SegmentedControl
                        options={options}
                        value={selectedSeason !== null ? String(selectedSeason) : null}
                        ariaLabel={t('SEASON')}
                        size={isMobile ? 'large' : 'medium'}
                        onSelect={handleSeasonSelect}
                    />
                    :
                    options.length === 1 ?
                        <div className={styles['season']}>{options[0].label}</div>
                        :
                        null
            }
            resetKey={`${metaItem.id}:${selectedSeason}`}
        >
            <Search className={styles['search']} value={search} placeholder={t('SEARCH_VIDEOS')} onChange={setSearch} />
            {
                showNotifications ?
                    <Toggle className={styles['notifications']} checked={!libraryItem.state.noNotif} onClick={onToggleNotifications}>
                        {t('DETAIL_RECEIVE_NOTIF_SERIES')}
                    </Toggle>
                    :
                    null
            }
            <div ref={listRef} className={styles['list']}>
                {
                    filteredVideos.map((video) => (
                        <VideoRow
                            key={video.id}
                            video={video}
                            selected={video.id === libraryItem?.state.video_id}
                            seasonWatched={seasonWatched}
                            minutesLeft={getMinutesLeft(libraryItem, video.id)}
                            onSelect={onSelectVideo}
                            onMarkVideoWatched={onMarkVideoWatched}
                            onMarkSeasonWatched={onMarkSeasonWatched}
                        />
                    ))
                }
            </div>
            {
                filteredVideos.length === 0 ?
                    <Message label={t('SEARCH_NO_RESULTS')} />
                    :
                    null
            }
        </Panel>
    );
};

export default Videos;
