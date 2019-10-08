const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const PlayIconCircleCentered = require('stremio/common/PlayIconCircleCentered');
const styles = require('./styles');

const ICON_FOR_TYPE = Object.assign(Object.create(null), {
    'movie': 'ic_movies',
    'series': 'ic_series',
    'channel': 'ic_channels',
    'tv': 'ic_tv',
    'other': 'ic_movies'
});

const Notification = ({ className, id, type, name, logo, poster, season, episode, released, posterThumbnail, onClick }) => {
    const [aLogo, setALogo] = React.useState(logo);

    return (
        <Button className={classnames(className, styles['notification-container'])} title={typeof name === 'string' && name.length > 0 ? name : id} data-id={id} onClick={onClick}>
            <div className={styles['logo-image-container']}>
                {
                    typeof aLogo === 'string' && aLogo.length > 0 ?
                        <div className={styles['logo-image-layer']}>
                            <img className={styles['logo-image']} src={logo} alt={' '} onError={() => { setALogo('') }} />
                        </div>
                        :
                        <div className={styles['placeholder-icon-layer']}>
                            <Icon
                                className={styles['placeholder-icon']}
                                icon={typeof ICON_FOR_TYPE[type] === 'string' ? ICON_FOR_TYPE[type] : ICON_FOR_TYPE['other']}
                            />
                        </div>
                }
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
                    released instanceof Date && !isNaN(released.getTime()) ?
                        <div className={styles['released-container']}>
                            {Math.floor(Math.abs((Date.now() - released) / (24 * 60 * 60 * 1000))) + ' days ago'}
                        </div>
                        :
                        null
                }
            </div>
            {
                posterThumbnail ?
                    <div className={styles['poster-image-container']}>
                        <div className={styles['placeholder-icon-layer']}>
                            <Icon
                                className={styles['placeholder-icon']}
                                icon={typeof ICON_FOR_TYPE[type] === 'string' ? ICON_FOR_TYPE[type] : ICON_FOR_TYPE['other']}
                            />
                        </div>
                        {
                            typeof poster === 'string' && poster.length > 0 ?
                                <div className={styles['poster-image-layer']}>
                                    <img className={styles['poster-image']} src={poster} alt={' '} />
                                </div>
                                :
                                null
                        }
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
    logo: PropTypes.string,
    poster: PropTypes.string,
    season: PropTypes.number,
    episode: PropTypes.number,
    released: PropTypes.instanceOf(Date),
    posterThumbnail: PropTypes.bool,
    onClick: PropTypes.func
};

module.exports = Notification;
