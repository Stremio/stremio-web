const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button } = require('stremio/common');
const Icon = require('stremio-icons/dom');
const styles = require('./styles');

const Video = ({ className, id, name, poster, episode, released, watched, upcoming, progress, onClick }) => {
    return (
        <Button className={classnames(className, styles['video-container'])} title={typeof name === 'string' && name.length > 0 ? name : id} data-id={id} onClick={onClick}>
            {
                typeof poster === 'string' && poster.length > 0 ?
                    <div className={styles['poster-container']}>
                        <img className={styles['poster']} src={poster} alt={' '} />
                    </div>
                    :
                    null
            }
            <div className={styles['info-container']}>
                <div className={styles['name-container']}>
                    {episode !== null && !isNaN(episode) ? `${episode}. ` : null}
                    {typeof name === 'string' && name.length > 0 ? name : id}
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
    id: PropTypes.string,
    name: PropTypes.string,
    poster: PropTypes.string,
    episode: PropTypes.number,
    released: PropTypes.instanceOf(Date),
    watched: PropTypes.bool,
    upcoming: PropTypes.bool,
    progress: PropTypes.number,
    onClick: PropTypes.func
};

module.exports = Video;
