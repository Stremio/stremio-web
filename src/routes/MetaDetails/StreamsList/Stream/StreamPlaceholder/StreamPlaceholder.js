// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const PlayIconCircleCentered = require('stremio/common/PlayIconCircleCentered');
const { ShimmerEffect } = require('stremio/common');
const styles = require('./styles');

const StreamPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['stream-placeholder-container'])}>
            <div className={styles['addon-container']}>
                <ShimmerEffect className={styles['addon-name']} />
            </div>
            <div className={styles['info-container']}>
                <ShimmerEffect className={styles['description-container']} />
                <ShimmerEffect className={styles['description-container']} />
            </div>
            <PlayIconCircleCentered className={styles['play-icon']} />
        </div>
    );
};

StreamPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = StreamPlaceholder;
