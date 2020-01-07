const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const styles = require('./styles');

const StreamPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['stream-placeholder-container'])}>
            <div className={styles['addon-container']}>
                <div className={styles['addon-name']} />
            </div>
            <div className={styles['info-container']}>
                <div className={styles['description-container']} />
                <div className={styles['description-container']} />
            </div>
            <div className={styles['play-icon-container']}>
                <Icon className={styles['play-icon']} icon={'ic_play'} />
            </div>
        </div>
    );
};

StreamPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = StreamPlaceholder;
