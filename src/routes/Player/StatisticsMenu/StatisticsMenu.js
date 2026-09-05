// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const { Button } = require('stremio/components');
const { useToast } = require('stremio/common');
const styles = require('./styles.less');

const StatisticsMenu = React.memo(React.forwardRef(({ className, peers, speed, completed, infoHash }, ref) => {
    const { t } = useTranslation();
    const toast = useToast();

    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.statisticsMenuClosePrevented = true;
    }, []);

    const onInfoHashClick = React.useCallback(() => {
        navigator.clipboard.writeText(infoHash)
            .then(() => toast.show({
                type: 'success',
                title: t('PLAYER_COPY_INFO_HASH_SUCCESS'),
                timeout: 4000,
            }))
            .catch(() => toast.show({
                type: 'error',
                title: t('PLAYER_COPY_INFO_HASH_ERROR'),
                timeout: 4000,
            }));
    }, [infoHash, t, toast]);

    return (
        <div ref={ref} className={classNames(className, styles['statistics-menu-container'])} onMouseDown={onMouseDown}>
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
            <div className={styles['detail']}>
                <div className={styles['label']}>
                    {t('PLAYER_INFO_HASH')}
                </div>
                <Button className={styles['copyable-value']} title={t('COPY')} onClick={onInfoHashClick}>
                    <div className={styles['hash']}>
                        { infoHash }
                    </div>
                    <div className={styles['copy-label']}>
                        {t('COPY')}
                    </div>
                </Button>
            </div>
        </div>
    );
}));

StatisticsMenu.propTypes = {
    className: PropTypes.string,
    peers: PropTypes.number,
    speed: PropTypes.number,
    completed: PropTypes.number,
    infoHash: PropTypes.string,
};

module.exports = StatisticsMenu;
