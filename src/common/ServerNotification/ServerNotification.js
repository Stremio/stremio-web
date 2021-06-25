// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const ServerNotification = ({ className }) => {
    return (
        <div className={classnames(className, styles['notification-container'])}>
            <div className={styles['notification-statement']}>Streaming server must be available.</div>
            <Button className={styles['notification-button']} title={'later'}>
                <span className={styles['notification-label']}>Later</span>
            </Button>
            <Button className={styles['notification-button']} title={'dismiss'}>
                <span className={styles['notification-label']}>Dismiss</span>
            </Button>
        </div>
    );
};

ServerNotification.propTypes = {
    className: PropTypes.string
};

module.exports = ServerNotification;
