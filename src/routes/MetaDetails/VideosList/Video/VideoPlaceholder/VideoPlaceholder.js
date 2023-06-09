// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const VideoPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['video-placeholder-container'])}>
            <div className={styles['info-container']}>
                <div className={styles['name-container']} />
                <div className={styles['released-container']} />
            </div>
        </div>
    );
};

VideoPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = VideoPlaceholder;
