const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Image } = require('stremio/common');
const StreamPlaceholder = require('./StreamPlaceholder');
const styles = require('./styles');

const Stream = ({ className, addonName, title, thumbnail, progress, ...props }) => {
    return (
        <Button {...props} className={classnames(className, styles['stream-container'])} title={title}>
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
                    <div className={styles['addon-name-container']}>
                        <div className={styles['addon-name']}>{addonName}</div>
                    </div>
            }
            <div className={styles['info-container']}>
                {
                    typeof thumbnail === 'string' && thumbnail.length > 0 ?
                        <div className={styles['addon-name-label']}>{addonName}</div>
                        :
                        null
                }
                <div className={styles['title-label']}>{title}</div>
            </div>
            <div className={styles['play-icon-container']}>
                <Icon className={styles['play-icon']} icon={'ic_play'} />
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

Stream.Placeholder = StreamPlaceholder;

Stream.propTypes = {
    className: PropTypes.string,
    addonName: PropTypes.string,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    progress: PropTypes.number,
};

module.exports = Stream;
