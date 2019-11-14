const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');
const styles = require('./styles');

const Stream = ({ className, id, addon, description, progress, onClick }) => {
    return (
        <Button className={classnames(className, styles['stream-container'])} title={typeof description === 'string' && description.length > 0 ? description : id} data-id={id} onClick={onClick}>
            {
                typeof addon === 'string' && addon.length > 0 ?
                    <div className={styles['addon-container']}>
                        <div className={styles['addon-name']}>{addon}</div>
                    </div>
                    :
                    null
            }
            <div className={styles['info-container']}>
                <div className={styles['description-label']}>
                    {typeof description === 'string' && description.length > 0 ? description : id}
                </div>
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
}

Stream.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    addon: PropTypes.string,
    description: PropTypes.string,
    progress: PropTypes.number,
    onClick: PropTypes.func
};

module.exports = Stream;
