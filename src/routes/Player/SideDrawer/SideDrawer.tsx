// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo, useCallback, useState, useRef, useEffect, forwardRef, memo } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useCore } from 'stremio/core';
import { CONSTANTS } from 'stremio/common';
import { filterVisibleEpgPrograms, getEpgDescription, getEpgProgress, getEpgTitle, getEpgValue, getEpgTimeRange, hasEpgProgramTimes } from 'stremio/common/EPG';
import { MetaPreview, Video } from 'stremio/components';
import SeasonsBar from 'stremio/routes/MetaDetails/VideosList/SeasonsBar';
import styles from './SideDrawer.less';

type Props = {
    className?: string;
    seriesInfo: SeriesInfo;
    metaItem: MetaItem;
    closeSideDrawer: () => void;
    selected: string;
    transitionEnded: boolean;
};

const SideDrawer = memo(forwardRef<HTMLDivElement, Props>(({ seriesInfo, className, closeSideDrawer, selected, ...props }: Props, ref) => {
    const core = useCore();
    const [season, setSeason] = useState<number>(seriesInfo?.season);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());
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

    const isEpg = useMemo(() => {
        return allVideos.some(hasEpgProgramTimes);
    }, [allVideos]);

    useEffect(() => {
        if (!isEpg) {
            return;
        }

        setNow(Date.now());

        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 60 * 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [isEpg]);

    const videos = useMemo(() => {
        if (isEpg) {
            return filterVisibleEpgPrograms(allVideos, now);
        }
        return allVideos.filter((video) => video.season === season);
    }, [allVideos, season, isEpg, now]);

    const previewVideo = useMemo(() => {
        if (!isEpg) {
            return null;
        }

        const selectedId = selectedVideoId ?? selected;

        const selectedVideo = videos.find((video) => video.id === selectedId) ?? null;
        const currentVideo = videos.find((video) => getEpgProgress(video, now) !== null) ?? null;

        return selectedVideo ?? currentVideo ?? videos[0] ?? null;
    }, [isEpg, videos, selectedVideoId, selected, now]);

    const isEpgVideo = useMemo(() => {
        return previewVideo !== null && hasEpgProgramTimes(previewVideo);
    }, [previewVideo]);

    const seasons = useMemo(() => {
        return allVideos
            .map(({ season }) => season)
            .filter((season, index, seasons) => {
                return seasons.indexOf(season) === index;
            })
            .sort((a, b) => (a || Number.MAX_SAFE_INTEGER) - (b || Number.MAX_SAFE_INTEGER));
    }, [allVideos]);

    const seasonOnSelect = useCallback((event: { value: string | number }) => {
        setSeason(parseInt(String(event.value), 10));
        videosRef.current?.scrollTo({ top: 0, left: 0 });
    }, []);

    const seasonWatched = React.useMemo(() => {
        return !isEpg && videos.every((video) => video.watched);
    }, [isEpg, videos]);

    const shouldRenderVideos = seriesInfo || isEpg;

    const selectedId = isEpg ?
        previewVideo?.id
        :
        selectedVideoId;

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

    const onTransitionEnd = useCallback(() => {
        setSelectedVideoId(selected);
    }, [selected]);

    return (
        <div ref={ref} className={classNames(styles['side-drawer'], className)} onMouseDown={onMouseDown} onTransitionEnd={onTransitionEnd}>
            <div className={styles['close-button']} onClick={closeSideDrawer}>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </div>
            <div className={styles['info']}>
                <MetaPreview
                    className={styles['side-drawer-meta-preview']}
                    compact={true}
                    name={getEpgTitle(isEpgVideo, previewVideo, metaItem)}
                    logo={metaItem.logo}
                    runtime={getEpgValue(isEpgVideo, previewVideo, metaItem, 'runtime')}
                    releaseInfo={getEpgValue(isEpgVideo, previewVideo, metaItem, 'releaseInfo')}
                    released={getEpgValue(isEpgVideo, previewVideo, metaItem, 'released')}
                    description={getEpgDescription(isEpgVideo, previewVideo, metaItem)}
                    links={metaItem.links}
                />
            </div>
            {
                shouldRenderVideos ?
                    <div className={styles['series-content']}>
                        {
                            seriesInfo && !isEpg ?
                                <SeasonsBar
                                    season={season}
                                    seasons={seasons}
                                    onSelect={seasonOnSelect}
                                />
                                :
                                null
                        }

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
                                        deepLinks={video.deepLinks}
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
                    </div>
                    :
                    null
            }
        </div>
    );
}));

export default SideDrawer;
