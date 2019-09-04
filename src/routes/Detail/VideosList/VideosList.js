const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { placeholderStyles } = require('stremio/common');
const SeasonsBar = require('./SeasonsBar');
const SeasonsBarPlaceholder = require('./SeasonsBarPlaceholder');
const Video = require('./Video');
const VideoPlaceholder = require('./VideoPlaceholder');
const useSeasons = require('./useSeasons');
require('./styles');

const VideosList = ({ className, metaItem }) => {
    const [season, seasons, setSeason] = useSeasons(metaItem);
    return (
        <div className={classnames(className, 'videos-list-container', { [placeholderStyles['placeholder-container']]: metaItem === null })}>
            {
                metaItem !== null ?
                    <React.Fragment>
                        {
                            seasons.length > 1 ?
                                <SeasonsBar
                                    className={'seasons-bar'}
                                    season={season}
                                    seasons={seasons}
                                    onSeasonChange={setSeason}
                                />
                                :
                                null
                        }
                        <div className={'videos-container'}>
                            {
                                metaItem.videos
                                    .filter((video) => isNaN(season) || video.season === season)
                                    .map((video) => (
                                        <Video
                                            {...video}
                                            key={video.id}
                                            className={'video'}
                                        />
                                    ))
                            }
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <SeasonsBarPlaceholder className={'seasons-bar'} />
                        <div className={'videos-container'}>
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                        </div>
                    </React.Fragment>
            }
        </div>
    );
};

VideosList.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object
};

module.exports = VideosList;
