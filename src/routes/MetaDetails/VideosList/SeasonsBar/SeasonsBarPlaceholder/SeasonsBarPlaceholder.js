// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const styles = require('./styles');

const SeasonsBarPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['seasons-bar-placeholder-container'])}>
            <div className={styles['prev-season-button']}>
                <Icon className={styles['icon']} icon={'ic_arrow_thin_left'} />
                <div className={styles['label']}>Prev</div>
            </div>
            <div className={styles['seasons-popup-label-container']}>
                <div className={styles['seasons-popup-label']}>Season 1</div>
                <Icon className={styles['seasons-popup-icon']} icon={'ic_arrow_thin_down'} />
            </div>
            <div className={styles['next-season-button']}>
                <div className={styles['label']}>Next</div>
                <Icon className={styles['icon']} icon={'ic_arrow_thin_right'} />
            </div>
        </div>
    );
};

SeasonsBarPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = SeasonsBarPlaceholder;
