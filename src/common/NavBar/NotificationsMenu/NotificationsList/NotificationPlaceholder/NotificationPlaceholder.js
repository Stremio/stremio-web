const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const styles = require('./styles');

const NotificationPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['notification-placeholder-container'])}>
            <div className={styles['logo-image-container']}>
                <div className={styles['logo-image']} />
            </div>
            <div className={styles['info-container']}>
                <div className={styles['name-container']} />
                <div className={styles['released-container']} />
            </div>
        </div>
    );
};

NotificationPlaceholder.propTypes = {
    className: PropTypes.string
}

module.exports = NotificationPlaceholder;
