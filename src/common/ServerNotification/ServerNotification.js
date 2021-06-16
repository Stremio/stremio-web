// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const ServerNotification = () => {
    return (
        <div className={styles['notification-container']}>
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

module.exports = ServerNotification;
