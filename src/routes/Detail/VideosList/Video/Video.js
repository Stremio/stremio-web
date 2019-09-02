const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button } = require('stremio/common');
const Icon = require('stremio-icons/dom');
require('./styles');

const Video = ({ className, id, name, poster, episode, released, watched = false, upcoming = false, progress = 0, onClick }) => {
    const releasedText = React.useMemo(() => {
        const releasedDate = new Date(released);
        return !isNaN(releasedDate.getFullYear()) ?
            releasedDate.toLocaleString(undefined, {
                year: '2-digit',
                month: 'short',
                day: 'numeric'
            })
            :
            null;
    }, [released]);
    return (
        <Button className={classnames(className, 'video-container')} title={name} data-id={id} onClick={onClick}>
            {
                typeof poster === 'string' && poster.length > 0 ?
                    <div className={'poster-container'}>
                        <img className={'poster'} src={poster} alt={' '} />
                    </div>
                    :
                    null
            }
            <div className={'info-container'}>
                {
                    typeof name === 'string' && name.length > 0 ?
                        <div className={'name-container'}>
                            {episode !== null && !isNaN(episode) ? `${episode}. ` : null}
                            {name}
                        </div>
                        :
                        null
                }
                {
                    typeof releasedText === 'string' && releasedText.length > 0 ?
                        <div className={'released-container'}>{releasedText}</div>
                        :
                        null
                }
                {
                    upcoming || watched ?
                        <div className={'flags-container'}>
                            {
                                upcoming ?
                                    <div className={'upcoming-container'}>Upcoming</div>
                                    :
                                    null
                            }
                            {
                                watched ?
                                    <div className={'watched-container'}>Watched</div>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
            </div>
            <div className={'next-icon-container'}>
                <Icon className={'next-icon'} icon={'ic_arrow_thin_right'} />
            </div>
            {
                progress !== null && !isNaN(progress) && progress > 0 ?
                    <div className={'progress-bar-container'}>
                        <div className={'progress-bar'} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
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
    released: PropTypes.string,
    watched: PropTypes.bool,
    upcoming: PropTypes.bool,
    progress: PropTypes.number,
    onClick: PropTypes.func
};

module.exports = Video;
