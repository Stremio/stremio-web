// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const styles = require('./styles');

const SeasonsBarPlaceholder = ({ className }) => {
    const { t } = useTranslation();
    return (
        <div className={classnames(className, styles['seasons-bar-placeholder-container'])}>
            <div className={styles['prev-season-button']}>
                <Icon className={styles['icon']} name={'chevron-back'} />
                <div className={styles['label']}>{t('SEASON_PREV')}</div>
            </div>
            <div className={styles['seasons-popup-label-container']}>
                <div className={styles['seasons-popup-label']}>{t('SEASON_NUMBER', { season: 1 })}</div>
                <Icon className={styles['seasons-popup-icon']} name={'caret-down'} />
            </div>
            <div className={styles['next-season-button']}>
                <div className={styles['label']}>{t('SEASON_NEXT')}</div>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </div>
        </div>
    );
};

SeasonsBarPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = SeasonsBarPlaceholder;
