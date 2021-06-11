// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { ShimmerEffect } = require('stremio/common');
const styles = require('./styles');

const VideoPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['video-placeholder-container'])}>
            <div className={styles['info-container']}>
                <ShimmerEffect className={styles['name-container']} />
                <ShimmerEffect className={styles['released-container']} />
            </div>
        </div>
    );
};

VideoPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = VideoPlaceholder;
