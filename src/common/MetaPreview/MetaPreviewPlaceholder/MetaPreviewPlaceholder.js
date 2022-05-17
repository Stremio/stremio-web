// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const ShimmerEffect = require('stremio/common/ShimmerEffect');
const styles = require('./styles');

const MetaPreviewPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['meta-preview-placeholder-container'])}>
            <div className={styles['meta-info-container']}>
                <ShimmerEffect className={styles['logo-container']} />
                <div className={styles['duration-release-info-container']}>
                    <ShimmerEffect className={styles['duration-container']} />
                    <ShimmerEffect className={styles['release-info-container']} />
                </div>
                <div className={styles['description-container']}>
                    <ShimmerEffect className={styles['description-label-container']} />
                    <ShimmerEffect className={styles['description-label-container']} />
                </div>
                <div className={styles['genres-container']}>
                    <ShimmerEffect className={styles['genres-header-container']} />
                    <ShimmerEffect className={styles['genre-label-container']} />
                </div>
                <div className={styles['genres-container']}>
                    <ShimmerEffect className={styles['genres-header-container']} />
                    <ShimmerEffect className={styles['genre-label-container']} />
                </div>
            </div>
            <div className={styles['action-buttons-container']}>
                <ShimmerEffect className={styles['action-button-container']}>
                    <div className={styles['action-button-icon']} />
                    <div className={styles['action-button-label']} />
                </ShimmerEffect>
                <ShimmerEffect className={styles['action-button-container']}>
                    <div className={styles['action-button-icon']} />
                    <div className={styles['action-button-label']} />
                </ShimmerEffect>
                <ShimmerEffect className={styles['action-button-container']}>
                    <div className={styles['action-button-icon']} />
                    <div className={styles['action-button-label']} />
                </ShimmerEffect>
            </div>
        </div>
    );
};

MetaPreviewPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = MetaPreviewPlaceholder;
