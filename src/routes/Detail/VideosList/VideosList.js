const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const SeasonsBar = require('./SeasonsBar');
const Video = require('./Video');
const VideoPlaceholder = require('./VideoPlaceholder');
const useSelectableSeasons = require('./useSelectableSeasons');
const styles = require('./styles');

const VideosList = ({ className, metaGroup }) => {
    const videos = React.useMemo(() => {
        return metaGroup && metaGroup.content.type === 'Ready' ?
            metaGroup.content.content.videos
            :
            [];
    }, [metaGroup]);
    const [seasons, selectedSeason, selectSeason] = useSelectableSeasons(videos);
    const videosForSeason = React.useMemo(() => {
        return videos.filter((video) => {
            return selectedSeason === null || video.season === selectedSeason;
        });
    }, [videos, selectedSeason]);
    return (
        <div className={classnames(className, styles['videos-list-container'])}>
            {
                !metaGroup || metaGroup.content.type === 'Loading' ?
                    <React.Fragment>
                        <SeasonsBar.Placeholder className={styles['seasons-bar']} />
                        <div className={styles['videos-scroll-container']}>
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                            <VideoPlaceholder className={styles['video']} />
                        </div>
                    </React.Fragment>
                    :
                    metaGroup.content.type === 'Err' || videosForSeason.length === 0 ?
                        <div className={styles['message-label']}>
                            No videos found for this meta
                        </div>
                        :
                        <React.Fragment>
                            {
                                seasons.length > 1 ?
                                    <SeasonsBar
                                        className={styles['seasons-bar']}
                                        season={selectedSeason}
                                        seasons={seasons}
                                        onSeasonChange={selectSeason}
                                    />
                                    :
                                    null
                            }
                            <div className={styles['videos-scroll-container']}>
                                {videosForSeason.map((video, index) => (
                                    <Video
                                        {...video}
                                        key={index}
                                        className={styles['video']}
                                    />
                                ))}
                            </div>
                        </React.Fragment>
            }
        </div>
    );
};

VideosList.propTypes = {
    className: PropTypes.string,
    metaGroup: PropTypes.object
};

module.exports = VideosList;
