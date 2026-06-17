// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useCore } = require('stremio/core');
const { Video } = require('stremio/components');
const styles = require('./styles');

const VideosMenu = ({ className, metaItem, seriesInfo }) => {
    const core = useCore();

    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.videosMenuClosePrevented = true;
    }, []);

    const videos = React.useMemo(() => {
        return seriesInfo && typeof seriesInfo.season === 'number' && Array.isArray(metaItem.videos) ?
            metaItem.videos.filter(({ season }) => season === seriesInfo.season)
            :
            metaItem.videos;
    }, [metaItem, seriesInfo]);

    const onMarkVideoAsWatched = (video, watched) => {
        core.transport.dispatch({
            action: 'Player',
            args: {
                action: 'MarkVideoAsWatched',
                args: [video, !watched]
            }
        });
    };

    return (
        <div className={classnames(className, styles['videos-menu-container'])} onMouseDown={onMouseDown}>
            {
                videos.map((video, index) => (
                    <Video
                        key={index}
                        id={video.id}
                        title={video.title}
                        thumbnail={video.thumbnail}
                        episode={video.episode}
                        released={video.released}
                        upcoming={video.upcoming}
                        watched={video.watched}
                        progress={video.progress}
                        deepLinks={video.deepLinks}
                        scheduled={video.scheduled}
                        onMarkVideoAsWatched={onMarkVideoAsWatched}
                    />
                ))
            }
        </div>
    );
};

VideosMenu.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object,
    seriesInfo: PropTypes.shape({
        season: PropTypes.number,
        episode: PropTypes.number,
    }),
};

module.exports = VideosMenu;
