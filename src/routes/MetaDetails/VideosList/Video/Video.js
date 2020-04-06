const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Image } = require('stremio/common');
const VideoPlaceholder = require('./VideoPlaceholder');
const styles = require('./styles');

const Video = ({ className, id, title, thumbnail, episode, released, upcoming, watched, progress, deepLinks, ...props }) => {
    const href = React.useMemo(() => {
        return deepLinks ?
            typeof deepLinks.player === 'string' ?
                deepLinks.player
                :
                typeof deepLinks.meta_details_streams === 'string' ?
                    deepLinks.meta_details_streams
                    :
                    null
            :
            null;
    }, [deepLinks]);
    return (
        <Button href={href} {...props} className={classnames(className, styles['video-container'])} title={title}>
            {
                typeof thumbnail === 'string' && thumbnail.length > 0 ?
                    <div className={styles['thumbnail-container']}>
                        <Image
                            className={styles['thumbnail']}
                            src={thumbnail}
                            alt={' '}
                            renderFallback={() => (
                                <Icon
                                    className={styles['placeholder-icon']}
                                    icon={'ic_broken_link'}
                                />
                            )}
                        />
                    </div>
                    :
                    null
            }
            <div className={styles['info-container']}>
                <div className={styles['title-container']}>
                    {episode !== null && !isNaN(episode) ? `${episode}. ` : null}
                    {typeof title === 'string' && title.length > 0 ? title : id}
                </div>
                <div className={styles['flex-row-container']}>
                    {
                        released instanceof Date && !isNaN(released.getTime()) ?
                            <div className={styles['released-container']}>
                                {released.toLocaleString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                            </div>
                            :
                            null
                    }
                    <div className={styles['upcoming-watched-container']}>
                        {
                            upcoming ?
                                <div className={styles['upcoming-container']}>
                                    <div className={styles['flag-label']}>Upcoming</div>
                                </div>
                                :
                                null
                        }
                        {
                            watched ?
                                <div className={styles['watched-container']}>
                                    <div className={styles['flag-label']}>Watched</div>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
            {
                progress !== null && !isNaN(progress) && progress > 0 ?
                    <div className={styles['progress-bar-container']}>
                        <div className={styles['progress-bar']} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
                    </div>
                    :
                    null
            }
        </Button>
    );
};

Video.Placeholder = VideoPlaceholder;

Video.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    episode: PropTypes.number,
    released: PropTypes.instanceOf(Date),
    upcoming: PropTypes.bool,
    watched: PropTypes.bool,
    progress: PropTypes.number,
    deepLinks: PropTypes.shape({
        meta_details_streams: PropTypes.string,
        player: PropTypes.string
    })
};

module.exports = Video;
