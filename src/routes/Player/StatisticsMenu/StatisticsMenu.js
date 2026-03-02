// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const styles = require('./styles.less');

const StatisticsMenu = ({ className, peers, speed, completed, infoHash }) => {
    const { t } = useTranslation();
    return (
        <div className={classNames(className, styles['statistics-menu-container'])}>
            <div className={styles['title']}>
                {t('PLAYER_STATISTICS')}
            </div>
            <div className={styles['stats']}>
                <div className={styles['stat']}>
                    <div className={styles['label']}>
                        {t('PLAYER_PEERS')}
                    </div>
                    <div className={styles['value']}>
                        { peers }
                    </div>
                </div>
                <div className={styles['stat']}>
                    <div className={styles['label']}>
                        {t('PLAYER_SPEED')}
                    </div>
                    <div className={styles['value']}>
                        {`${speed} ${t('MB_S')}`}
                    </div>
                </div>
                <div className={styles['stat']}>
                    <div className={styles['label']}>
                        {t('PLAYER_COMPLETED')}
                    </div>
                    <div className={styles['value']}>
                        { Math.min(completed, 100) } %
                    </div>
                </div>
            </div>
            <div className={styles['info-hash']}>
                <div className={styles['label']}>
                    {t('PLAYER_INFO_HASH')}
                </div>
                <div className={styles['value']}>
                    { infoHash }
                </div>
            </div>
        </div>
    );
};

StatisticsMenu.propTypes = {
    className: PropTypes.string,
    peers: PropTypes.number,
    speed: PropTypes.number,
    completed: PropTypes.number,
    infoHash: PropTypes.string,
};

module.exports = StatisticsMenu;
