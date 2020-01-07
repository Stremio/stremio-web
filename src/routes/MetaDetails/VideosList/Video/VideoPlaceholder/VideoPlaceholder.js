const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const styles = require('./styles');

const VideoPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['video-placeholder-container'])}>
            <div className={styles['info-container']}>
                <div className={styles['name-container']} />
                <div className={styles['released-container']} />
            </div>
            <div className={styles['next-icon-container']}>
                <Icon className={styles['next-icon']} icon={'ic_arrow_thin_right'} />
            </div>
        </div>
    );
};

VideoPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = VideoPlaceholder;
