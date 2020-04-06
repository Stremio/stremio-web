const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Image, PlayIconCircleCentered } = require('stremio/common');
const StreamPlaceholder = require('./StreamPlaceholder');
const styles = require('./styles');

const Stream = ({ className, addonName, title, thumbnail, progress, deepLinks, ...props }) => {
    const href = React.useMemo(() => {
        return deepLinks ?
            typeof deepLinks.player === 'string' ?
                deepLinks.player
                :
                null
            :
            null;
    }, [deepLinks]);
    const renderThumbnailFallback = React.useMemo(() => () => (
        <Icon className={styles['placeholder-icon']} icon={'ic_broken_link'} />
    ), []);
    return (
        <Button href={href} {...props} className={classnames(className, styles['stream-container'])} title={title}>
            {
                typeof thumbnail === 'string' && thumbnail.length > 0 ?
                    <div className={styles['thumbnail-container']} title={addonName}>
                        <Image
                            className={styles['thumbnail']}
                            src={thumbnail}
                            alt={' '}
                            renderFallback={renderThumbnailFallback}
                        />
                    </div>
                    :
                    <div className={styles['addon-name-container']} title={addonName}>
                        <div className={styles['addon-name']}>{addonName}</div>
                    </div>
            }
            <div className={styles['info-container']}>{title}</div>
            <PlayIconCircleCentered className={styles['play-icon']} />
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

Stream.Placeholder = StreamPlaceholder;

Stream.propTypes = {
    className: PropTypes.string,
    addonName: PropTypes.string,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    progress: PropTypes.number,
    deepLinks: PropTypes.shape({
        player: PropTypes.string
    })
};

module.exports = Stream;
