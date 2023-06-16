// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const PlayIconCircleCentered = require('stremio/common/PlayIconCircleCentered');
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
            <PlayIconCircleCentered className={styles['play-icon']} />
        </div>
    );
};

StreamPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = StreamPlaceholder;
