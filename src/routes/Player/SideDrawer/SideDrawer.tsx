// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo, useCallback, useState, useRef, forwardRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useCore } from 'stremio/core';
import { CONSTANTS } from 'stremio/common';
import { filterVisibleEpgPrograms, getEpgDescription, getEpgProgress, getEpgTitle, getEpgValue, getEpgTimeRange, getNonEmptyString, useEpgNow } from 'stremio/common/EPG';
import useSeasons from 'stremio/common/useSeasons';
import { MetaPreview, Video } from 'stremio/components';
import SegmentedControl from 'stremio/components/SegmentedControl';
import styles from './SideDrawer.less';

type Props = {
    className?: string;
    seriesInfo: SeriesInfo;
    metaItem: MetaItem;
    closeSideDrawer: () => void;
    selected: string;
    isEpg: boolean;
};

const SideDrawer = memo(forwardRef<HTMLDivElement, Props>(({ seriesInfo, className, closeSideDrawer, selected, isEpg, ...props }: Props, ref) => {
    const { t } = useTranslation();
    const core = useCore();
    const [season, setSeason] = useState<number | null>(seriesInfo?.season ?? null);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const videosRef = useRef<HTMLDivElement>(null);

    const metaItem = useMemo(() => {
        return seriesInfo ?
            {
                ...props.metaItem,
                links: props.metaItem.links.filter(({ category }) => category === CONSTANTS.SHARE_LINK_CATEGORY)
            }
            :
            props.metaItem;
    }, [props.metaItem, seriesInfo]);

    const allVideos = useMemo(() => {
        return Array.isArray(metaItem.videos) ? metaItem.videos : [];
    }, [metaItem.videos]);

    const now = useEpgNow(isEpg);
    const { selectedSeason, videos: seasonVideos, options } = useSeasons(allVideos, season, null);

    const videos = useMemo(() => {
        return isEpg ? filterVisibleEpgPrograms(allVideos, now) : seasonVideos;
    }, [allVideos, isEpg, now, seasonVideos]);

    const previewVideo = useMemo(() => {
        if (!isEpg) {
            return null;
        }

        const selectedId = selectedVideoId ?? selected;

        const selectedVideo = videos.find((video) => video.id === selectedId) ?? null;
        const currentVideo = videos.find((video) => getEpgProgress(video, now) !== null) ?? null;

        return selectedVideo ?? currentVideo ?? videos[0] ?? null;
    }, [isEpg, videos, selectedVideoId, selected, now]);

    const isEpgVideo = previewVideo !== null;
    const released = getEpgValue(isEpgVideo, previewVideo, metaItem, 'released');

    const seasonOnSelect = useCallback((value: string) => {
        setSeason(parseInt(value, 10));
        videosRef.current?.scrollTo({ top: 0, left: 0 });
    }, []);

    const seasonWatched = React.useMemo(() => {
        return !isEpg && videos.every((video) => video.watched);
    }, [isEpg, videos]);

    const shouldRenderVideos = seriesInfo || isEpg;

    const selectedId = isEpg ?
        previewVideo?.id
        :
        selectedVideoId ?? selected;

    const onMarkVideoAsWatched = useCallback((video: Video, watched: boolean) => {
        core.transport.dispatch({
            action: 'Player',
            args: {
                action: 'MarkVideoAsWatched',
                args: [video, !watched]
            }
        });
    }, []);

    const onMarkSeasonAsWatched = (season: number, watched: boolean) => {
        core.transport.dispatch({
            action: 'Player',
            args: {
                action: 'MarkSeasonAsWatched',
                args: [season, !watched]
            }
        });
    };

    const onMouseDown = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div ref={ref} className={classNames(styles['side-drawer'], className)} onMouseDown={onMouseDown}>
            <div className={styles['close-button']} onClick={closeSideDrawer}>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </div>
            <MetaPreview
                className={styles['info']}
                name={getNonEmptyString(getEpgTitle(isEpgVideo, previewVideo, metaItem)) ?? metaItem.name}
                logo={metaItem.logo}
                runtime={getNonEmptyString(getEpgValue(isEpgVideo, previewVideo, metaItem, 'runtime'))}
                releaseInfo={getNonEmptyString(getEpgValue(isEpgVideo, previewVideo, metaItem, 'releaseInfo'))}
                released={released instanceof Date || typeof released === 'string' ? released : null}
                description={getNonEmptyString(getEpgDescription(isEpgVideo, previewVideo, metaItem))}
                links={metaItem.links}
            />
            {
                seriesInfo && !isEpg && options.length > 1 ?
                    <SegmentedControl
                        className={styles['seasons']}
                        options={options}
                        value={selectedSeason !== null ? String(selectedSeason) : null}
                        ariaLabel={t('SEASON')}
                        onSelect={seasonOnSelect}
                    />
                    :
                    null
            }
            {
                shouldRenderVideos ?
                    <div ref={videosRef} className={styles['videos']}>
                        {videos.map((video, index) => {
                            const range = isEpg ? getEpgTimeRange(video) : null;
                            const progress = isEpg ? getEpgProgress(video, now) : video.progress;
                            const isNow = isEpg && progress !== null;
                            const upcoming = isEpg ?
                                range !== null && range.startTime > now
                                :
                                video.upcoming;

                            return (
                                <Video
                                    key={index}
                                    className={styles['video']}
                                    id={video.id}
                                    title={video.title}
                                    thumbnail={video.thumbnail}
                                    season={video.season}
                                    episode={video.episode}
                                    released={video.released}
                                    upcoming={upcoming}
                                    watched={video.watched}
                                    seasonWatched={seasonWatched}
                                    progress={progress}
                                    deepLinks={isEpg ? undefined : video.deepLinks}
                                    scheduled={video.scheduled}
                                    selected={video.id === selectedId}
                                    isEpg={isEpg}
                                    isNow={isNow}
                                    startTime={video.startTime}
                                    endTime={video.endTime}
                                    onSelect={isEpg ? () => setSelectedVideoId(video.id) : undefined}
                                    onMarkVideoAsWatched={onMarkVideoAsWatched}
                                    onMarkSeasonAsWatched={onMarkSeasonAsWatched}
                                />
                            );
                        })}
                    </div>
                    :
                    null
            }
        </div>
    );
}));

export default SideDrawer;
