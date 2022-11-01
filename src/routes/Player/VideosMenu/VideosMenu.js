// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Video = require('../../MetaDetails/VideosList/Video');
const styles = require('./styles');

const VideosMenu = ({ className, metaItem }) => {
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.videosMenuClosePrevented = true;
    }, []);
    return (
        <div className={classnames(className, styles['videos-menu-container'])} onMouseDown={onMouseDown}>
            {
                metaItem.videos.map((video, index) => (
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
                    />
                ))
            }
        </div>
    );
};

VideosMenu.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object,
};

module.exports = VideosMenu;
