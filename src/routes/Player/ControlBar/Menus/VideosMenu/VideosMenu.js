// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Menu } = require('stremio/common');
const Video = require('../../../../MetaDetails/VideosList/Video');
const styles = require('./styles');

const VideosMenu = ({ className, metaItem, seriesInfo }) => {
    const videos = React.useMemo(() => {
        return seriesInfo && typeof seriesInfo.season === 'number' && Array.isArray(metaItem.videos) ?
            metaItem.videos.filter(({ season }) => season === seriesInfo.season)
            :
            metaItem.videos;
    }, [metaItem, seriesInfo]);
    return (
        <Menu className={classnames(className, styles['videos-menu-container'])} shortcut={'KeyV'}>
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
                    />
                ))
            }
        </Menu>
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
