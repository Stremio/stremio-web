// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const styles = require('./styles');

const SeasonsBarPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['seasons-bar-placeholder-container'])}>
            <div className={styles['prev-season-button']}>
                <Icon className={styles['icon']} name={'chevron-back'} />
                <div className={styles['label']}>Prev</div>
            </div>
            <div className={styles['seasons-popup-label-container']}>
                <div className={styles['seasons-popup-label']}>Season 1</div>
                <Icon className={styles['seasons-popup-icon']} name={'caret-down'} />
            </div>
            <div className={styles['next-season-button']}>
                <div className={styles['label']}>Next</div>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </div>
        </div>
    );
};

SeasonsBarPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = SeasonsBarPlaceholder;
