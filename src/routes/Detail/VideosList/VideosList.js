const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const SeasonsBar = require('./SeasonsBar');
const SeasonsBarPlaceholder = require('./SeasonsBarPlaceholder');
const Video = require('./Video');
const VideoPlaceholder = require('./VideoPlaceholder');
const useSelectableSeasons = require('./useSelectableSeasons');
const styles = require('./styles');

const VideosList = ({ className, metaGroup }) => {
    const [seasons, selectedSeason, selectSeason] = useSelectableSeasons(metaGroup && metaGroup.content.type === 'Ready' ? metaGroup.content.content.videos : []);
    const videosForSeason = React.useMemo(() => {
        return metaGroup && metaGroup.content.type === 'Ready' ?
            metaGroup.content.content.videos.filter((video) => {
                return selectedSeason === null || video.season === selectedSeason;
            })
            :
            [];
    }, [metaGroup, selectedSeason]);
    return (
        <div className={classnames(className, styles['videos-list-container'])}>
            {
                !metaGroup || metaGroup.content.type === 'Loading' ?
                    <React.Fragment>
                        <SeasonsBarPlaceholder className={styles['seasons-bar']} />
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
                                        onSeasonChange={setSeason}
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
