const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const PlayIconCircleCentered = require('stremio/common/PlayIconCircleCentered');
const styles = require('./styles');

const ICON_FOR_TYPE = Object.assign(Object.create(null), {
    'movie': 'ic_movies',
    'series': 'ic_series',
    'channel': 'ic_channels',
    'tv': 'ic_tv',
    'other': 'ic_movies'
});

const Notification = ({ className, id, type, name, poster, thumbnail, season, episode, released, onClick }) => {
    const daysAgo = React.useMemo(() => {
        if (released instanceof Date) {
            return Math.floor(Math.abs((Date.now() - released) / (24 * 60 * 60 * 1000)));
        }
    }, [released]);
    return (
        <Button className={classnames(className, styles['notification-container'])} title={typeof name === 'string' && name.length > 0 ? name : id} data-id={id} onClick={onClick}>
            <div className={styles['logo-container']}>
                <div className={styles['logo-image-layer']}>
                    <Image
                        className={styles['logo-image']}
                        src={poster}
                        alt={' '}
                        renderFallback={() => (
                            <Icon
                                className={styles['placeholder-icon']}
                                icon={typeof ICON_FOR_TYPE[type] === 'string' ? ICON_FOR_TYPE[type] : ICON_FOR_TYPE['other']}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={styles['info-container']}>
                <div className={styles['episode-container']}>
                    {episode !== null && !isNaN(episode) ? `E${episode} ` : null}
                    {season !== null && !isNaN(season) ? `S${season} ` : null}
                </div>
                <div className={styles['name-container']}>
                    {typeof name === 'string' && name.length > 0 ? name : id}
                </div>
                {
                    daysAgo !== null && !isNaN(daysAgo) ?
                        <div className={styles['released-container']}>
                            {daysAgo === 0 ? 'today' : daysAgo + ' days ago'}
                        </div>
                        :
                        null
                }
            </div>
            {
                typeof thumbnail === 'string' && thumbnail.length > 0 ?
                    <div className={styles['poster-container']}>
                        <div className={styles['poster-image-layer']}>
                            <Image
                                className={styles['poster-image']}
                                src={thumbnail}
                                alt={' '}
                                renderFallback={() => (
                                    <Icon
                                        className={styles['placeholder-icon']}
                                        icon={typeof ICON_FOR_TYPE[type] === 'string' ? ICON_FOR_TYPE[type] : ICON_FOR_TYPE['other']}
                                    />
                                )}
                            />
                        </div>
                        <div className={styles['play-icon-layer']}>
                            <PlayIconCircleCentered className={styles['play-icon']} />
                        </div>
                    </div>
                    :
                    null
            }
        </Button>
    );
}

Notification.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    poster: PropTypes.string,
    thumbnail: PropTypes.string,
    season: PropTypes.number,
    episode: PropTypes.number,
    released: PropTypes.instanceOf(Date),
    onClick: PropTypes.func
};

module.exports = Notification;
