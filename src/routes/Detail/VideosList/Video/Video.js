const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Image } = require('stremio/common');
const Icon = require('stremio-icons/dom');
const styles = require('./styles');

const Video = ({ className, title, thumbnail, episode, released, upcoming, watched, progress, ...props }) => {
    return (
        <Button {...props} className={classnames(className, styles['video-container'])} title={title}>
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
                {
                    released instanceof Date && !isNaN(released.getTime()) ?
                        <div className={styles['released-container']}>
                            {released.toLocaleString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                        </div>
                        :
                        null
                }
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
            <div className={styles['next-icon-container']}>
                <Icon className={styles['next-icon']} icon={'ic_arrow_thin_right'} />
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
}

Video.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    episode: PropTypes.number,
    released: PropTypes.instanceOf(Date),
    upcoming: PropTypes.bool,
    watched: PropTypes.bool,
    progress: PropTypes.number
};

module.exports = Video;
