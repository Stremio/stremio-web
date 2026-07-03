// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { useCore } = require('stremio/core');
const { getEpgProgress, hasEpgProgramTimes, useEpgNow } = require('stremio/common/EPG');
const LibItem = require('stremio/components/LibItem');

const getEpgChannelId = (videoId) => {
    const index = typeof videoId === 'string' ? videoId.lastIndexOf(':') : -1;
    return index > 0 ? videoId.slice(0, index) : null;
};

const replaceDetailVideo = (link, videoId) => {
    const channelId = getEpgChannelId(videoId);
    if (typeof link !== 'string' || channelId === null) return link;

    const prefix = link.startsWith('#') ? '#' : '';
    const parts = (prefix ? link.slice(1) : link).split('/');
    const index = parts.indexOf('detail');

    if (index === -1 || parts.length <= index + 3) return link;

    parts[index + 2] = encodeURIComponent(channelId);
    parts[index + 3] = encodeURIComponent(videoId);

    return `${prefix}${parts.join('/')}`;
};

const getEpgDeepLinks = (deepLinks, epgVideo) => {
    const videoDeepLinks = epgVideo?.deepLinks ?? {};
    const videoId = epgVideo?.id;

    return {
        ...deepLinks,
        ...videoDeepLinks,
        metaDetailsVideos: videoDeepLinks.metaDetailsVideos ?? replaceDetailVideo(deepLinks?.metaDetailsVideos, videoId),
        metaDetailsStreams: videoDeepLinks.metaDetailsStreams ?? replaceDetailVideo(deepLinks?.metaDetailsStreams, videoId),
    };
};

const getEpgVideo = (props, now) => {
    const videos = [
        props.currentVideo,
        props.video,
        ...(Array.isArray(props.videos) ? props.videos : []),
        ...(Array.isArray(props.epgVideos) ? props.epgVideos : []),
    ].filter(hasEpgProgramTimes);

    return videos.find((video) => getEpgProgress(video, now) !== null) ??
        videos.find((video) => video.id === props.state?.video_id) ??
        videos[0] ??
        null;
};

const ContinueWatchingItem = ({ _id, notifications, ...props }) => {
    const core = useCore();
    const hasEpgVideos = Array.isArray(props.epgVideos) && props.epgVideos.length > 0;
    const now = useEpgNow(hasEpgVideos || props.behaviorHints?.epgProvider === true);
    const epgVideo = getEpgVideo(props, now);
    const isEpg = epgVideo !== null || props.behaviorHints?.epgProvider === true;
    const epgProgress = epgVideo !== null ? getEpgProgress(epgVideo, now) : null;
    const itemProps = isEpg ? {
        ...props,
        poster: typeof epgVideo?.thumbnail === 'string' && epgVideo.thumbnail.length > 0 ? epgVideo.thumbnail : props.poster,
        posterShape: 'landscape',
        progress: epgProgress ?? props.progress,
        live: true,
        deepLinks: getEpgDeepLinks(props.deepLinks, epgVideo),
    } : props;

    const onDismissClick = React.useCallback((event) => {
        event.preventDefault();
        if (typeof _id === 'string') {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'RewindLibraryItem',
                    args: _id
                }
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'DismissNotificationItem',
                    args: _id
                }
            });
        }
    }, [_id]);

    return (
        <LibItem
            {...itemProps}
            _id={_id}
            posterChangeCursor={true}
            notifications={notifications}
            onDismissClick={onDismissClick}
        />
    );
};

ContinueWatchingItem.propTypes = {
    _id: PropTypes.string,
    notifications: PropTypes.object,
    poster: PropTypes.string,
    progress: PropTypes.number,
    currentVideo: PropTypes.object,
    video: PropTypes.object,
    videos: PropTypes.arrayOf(PropTypes.object),
    epgVideos: PropTypes.arrayOf(PropTypes.object),
    state: PropTypes.shape({
        video_id: PropTypes.string,
    }),
    behaviorHints: PropTypes.shape({
        epgProvider: PropTypes.bool,
    }),
    deepLinks: PropTypes.shape({
        metaDetailsVideos: PropTypes.string,
        metaDetailsStreams: PropTypes.string,
        player: PropTypes.string
    }),
};

module.exports = ContinueWatchingItem;
