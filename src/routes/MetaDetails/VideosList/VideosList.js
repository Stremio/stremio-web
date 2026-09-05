// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { t } = require('i18next');
const { useCore } = require('stremio/core');
const { useProfile } = require('stremio/common');
const { Image, SearchBar, Toggle, Video } = require('stremio/components');
const { getEpgProgress, getEpgTimeRange, hasEpgProgramTimes } = require('stremio/common/EPG');
const SeasonsBar = require('./SeasonsBar');
const { default: EpisodePicker } = require('../EpisodePicker');
const styles = require('./styles');

let savedScrollTop = 0;

const VideosList = ({ className, metaItem, libraryItem, season, seasonOnSelect, selectedVideoId, toggleNotifications }) => {
    const core = useCore();
    const profile = useProfile();
    const showNotificationsToggle = React.useMemo(() => {
        return metaItem?.content?.content?.inLibrary && metaItem?.content?.content?.videos?.length;
    }, [metaItem]);
    const videos = React.useMemo(() => {
        return metaItem && metaItem.content.type === 'Ready' ?
            metaItem.content.content.videos
            :
            [];
    }, [metaItem]);
    const seasons = React.useMemo(() => {
        return videos
            .map(({ season }) => season)
            .filter((season, index, seasons) => {
                return season !== null &&
                    !isNaN(season) &&
                    typeof season === 'number' &&
                    seasons.indexOf(season) === index;
            })
            .sort((a, b) => (a || Number.MAX_SAFE_INTEGER) - (b || Number.MAX_SAFE_INTEGER));
    }, [videos]);
    const selectedSeason = React.useMemo(() => {
        if (seasons.includes(season)) {
            return season;
        }

        const video = videos?.find((video) => video.id === libraryItem?.state.video_id);

        if (video && video.season && seasons.includes(video.season)) {
            return video.season;
        }

        const nonSpecialSeasons = seasons.filter((season) => season !== 0);
        if (nonSpecialSeasons.length > 0) {
            return nonSpecialSeasons[0];
        }

        if (seasons.length > 0) {
            return seasons[0];
        }

        return null;
    }, [seasons, season, videos, libraryItem]);
    const isEpg = React.useMemo(() => {
        return videos.some(hasEpgProgramTimes);
    }, [videos]);
    const videosForSeason = React.useMemo(() => {
        const filtered = videos.filter((video) => {
            return selectedSeason === null || video.season === selectedSeason;
        });

        // program shows are listed in schedule order - core sorts videos
        // by released DESC, which would open the list at the end of the day
        return isEpg ?
            filtered.sort((a, b) => {
                return (getEpgTimeRange(a)?.startTime ?? 0) - (getEpgTimeRange(b)?.startTime ?? 0);
            })
            :
            filtered.sort((a, b) => {
                return a.episode - b.episode;
            });
    }, [videos, selectedSeason, isEpg]);

    const seasonWatched = React.useMemo(() => {
        return videosForSeason.every((video) => video.watched);
    }, [videosForSeason]);

    const videosContainerRef = React.useRef(null);
    const isMountedRef = React.useRef(false);

    const saveScrollPosition = React.useCallback(() => {
        savedScrollTop = videosContainerRef.current?.scrollTop ?? 0;
    }, []);

    // Restore scroll on mount (before paint), consume immediately
    const hadSavedScrollRef = React.useRef(savedScrollTop > 0);
    React.useLayoutEffect(() => {
        if (savedScrollTop > 0 && videosContainerRef.current) {
            videosContainerRef.current.scrollTop = savedScrollTop;
            savedScrollTop = 0;
        }
    }, []);

    // Bring the program on air (or the selected one) into view once
    // the schedule renders
    const scrolledToCurrentRef = React.useRef(false);
    React.useLayoutEffect(() => {
        if (
            !isEpg ||
            scrolledToCurrentRef.current ||
            hadSavedScrollRef.current ||
            videosForSeason.length === 0 ||
            videosContainerRef.current === null
        ) {
            return;
        }

        scrolledToCurrentRef.current = true;
        const now = Date.now();
        const currentIndex = videosForSeason.findIndex((video) => getEpgProgress(video, now) !== null);
        const targetIndex = currentIndex !== -1 ?
            currentIndex
            :
            videosForSeason.findIndex((video) => video.id === selectedVideoId);
        if (targetIndex > 0) {
            const target = videosContainerRef.current.children[targetIndex];
            if (target) {
                target.scrollIntoView({ block: 'center' });
            }
        }
    }, [isEpg, videosForSeason]);

    // Scroll to top when the season changes (skip on initial mount to respect restored scroll position)
    React.useEffect(() => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            return;
        }
        const hasSelectedVideo = videosForSeason.some((v) => v.id === selectedVideoId);
        if (!hasSelectedVideo && videosContainerRef.current) {
            videosContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedSeason]);

    const [search, setSearch] = React.useState('');
    const searchInputOnChange = React.useCallback((event) => {
        setSearch(event.currentTarget.value);
    }, []);

    const onMarkVideoAsWatched = (video, watched) => {
        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'MarkVideoAsWatched',
                args: [video, !watched]
            }
        });
    };

    const onMarkSeasonAsWatched = (season, watched) => {
        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'MarkSeasonAsWatched',
                args: [season, !watched]
            }
        });
    };

    const onSeasonSearch = (value) => {
        if (value) {
            seasonOnSelect({
                type: 'select',
                value,
            });
        }
    };

    return (
        <div className={classnames(className, styles['videos-list-container'])}>
            {
                !metaItem || metaItem.content.type === 'Loading' ?
                    <React.Fragment>
                        <SeasonsBar.Placeholder className={styles['seasons-bar']} />
                        <SearchBar.Placeholder className={styles['search-bar']} title={t('SEARCH_VIDEOS')} />
                        <div className={styles['videos-scroll-container']}>
                            <Video.Placeholder />
                            <Video.Placeholder />
                            <Video.Placeholder />
                            <Video.Placeholder />
                            <Video.Placeholder />
                        </div>
                    </React.Fragment>
                    :
                    metaItem.content.type === 'Err' || videosForSeason.length === 0 ?
                        <div className={styles['message-container']}>
                            <EpisodePicker className={styles['episode-picker']} onSubmit={onSeasonSearch} />
                            <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={' '} />
                            <div className={styles['label']}>{t('ERR_NO_VIDEOS_FOR_META')}</div>
                        </div>
                        :
                        <React.Fragment>
                            {
                                showNotificationsToggle && libraryItem ?
                                    <Toggle className={styles['notifications-toggle']} checked={!libraryItem.state.noNotif} onClick={toggleNotifications}>
                                        {t('DETAIL_RECEIVE_NOTIF_SERIES')}
                                    </Toggle>
                                    :
                                    null
                            }
                            {
                                seasons.length > 0 ?
                                    <SeasonsBar
                                        className={styles['seasons-bar']}
                                        season={selectedSeason}
                                        seasons={seasons}
                                        onSelect={seasonOnSelect}
                                    />
                                    :
                                    null
                            }
                            <SearchBar
                                className={styles['search-bar']}
                                title={t('SEARCH_VIDEOS')}
                                value={search}
                                onChange={searchInputOnChange}
                            />
                            <div ref={videosContainerRef} className={styles['videos-container']}>
                                {
                                    videosForSeason
                                        .filter((video) => {
                                            return search.length === 0 ||
                                                (
                                                    (typeof video.title === 'string' && video.title.toLowerCase().includes(search.toLowerCase())) ||
                                                    (!isNaN(video.released.getTime()) && video.released.toLocaleString(profile.settings.interfaceLanguage, { year: '2-digit', month: 'short', day: 'numeric' }).toLowerCase().includes(search.toLowerCase()))
                                                );
                                        })
                                        .map((video, index) => (
                                            <Video
                                                key={index}
                                                id={video.id}
                                                title={video.title}
                                                thumbnail={video.thumbnail}
                                                season={video.season}
                                                episode={video.episode}
                                                released={video.released}
                                                upcoming={video.upcoming}
                                                watched={video.watched}
                                                progress={video.progress}
                                                deepLinks={video.deepLinks}
                                                scheduled={video.scheduled}
                                                seasonWatched={seasonWatched}
                                                selected={video.id === selectedVideoId}
                                                onSelect={saveScrollPosition}
                                                onMarkVideoAsWatched={onMarkVideoAsWatched}
                                                onMarkSeasonAsWatched={onMarkSeasonAsWatched}
                                            />
                                        ))
                                }
                            </div>
                        </React.Fragment>
            }
        </div>
    );
};

VideosList.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object,
    libraryItem: PropTypes.object,
    season: PropTypes.number,
    selectedVideoId: PropTypes.string,
    seasonOnSelect: PropTypes.func,
    toggleNotifications: PropTypes.func,
};

module.exports = VideosList;
