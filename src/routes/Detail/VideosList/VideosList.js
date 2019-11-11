const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const SeasonsBar = require('./SeasonsBar');
const SeasonsBarPlaceholder = require('./SeasonsBarPlaceholder');
const Video = require('./Video');
const VideoPlaceholder = require('./VideoPlaceholder');
const useSeasons = require('./useSeasons');
const styles = require('./styles');

const VideosList = ({ className, meta }) => {
    const [season, seasons, setSeason] = useSeasons(meta !== null && meta.content.type === 'Ready' ? meta.content.content : null);
    const videos = React.useMemo(() => {
        return meta !== null && meta.content.type === 'Ready' ?
            meta.content.content.videos.filter((video) => {
                return isNaN(season) || video.season === season;
            })
            :
            [];
    }, [meta, season]);
    return (
        <div className={classnames(className, styles['videos-list-container'])}>
            {
                meta === null ?
                    <React.Fragment>
                        <SeasonsBarPlaceholder className={styles['seasons-bar']} />
                        <div className={styles['videos-scroll-container']}>
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                        </div>
                    </React.Fragment>
                    :
                    meta.content.type === 'Ready' ?
                        <React.Fragment>
                            {
                                seasons.length > 1 ?
                                    <SeasonsBar
                                        className={styles['seasons-bar']}
                                        season={season}
                                        seasons={seasons}
                                        onSeasonChange={setSeason}
                                    />
                                    :
                                    null
                            }
                            {
                                videos.length > 0 ?
                                    <div className={styles['videos-scroll-container']}>
                                        {videos.map((video, index) => (
                                            <Video
                                                {...video}
                                                key={index}
                                                className={styles['video']}
                                            />
                                        ))}
                                    </div>
                                    :
                                    <div className={styles['message-label']}>
                                        No videos
                                    </div>
                            }
                        </React.Fragment>
                        :
                        <div className={styles['message-label']}>
                            No videos
                        </div>
            }
        </div>
    );
};

VideosList.propTypes = {
    className: PropTypes.string,
    meta: PropTypes.object
};

module.exports = VideosList;
