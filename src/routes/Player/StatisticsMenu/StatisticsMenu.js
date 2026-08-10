// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const formatTime = require('../ControlBar/SeekBar/formatTime');
const styles = require('./styles.less');

const formatBufferValue = (t, isCached, bufferRunway) => {
    if (isCached) {
        return t('PLAYER_SIGNAL_BUFFER_VALUE_CACHED');
    }
    if (bufferRunway === null) {
        return t('PLAYER_SIGNAL_BUFFER_VALUE_UNKNOWN');
    }
    return formatTime(bufferRunway * 1000);
};

const getSpeedMeaningKey = (isCached, keepingUp) => {
    if (isCached || keepingUp === null) {
        return null;
    }
    return keepingUp ? 'PLAYER_SIGNAL_SPEED_MEANING_OK' : 'PLAYER_SIGNAL_SPEED_MEANING_SLOW';
};

const StatisticsMenu = React.memo(React.forwardRef(({ className, ready, cached, bufferRunway, keepingUp, peers, speed, completed, infoHash }, ref) => {
    const { t } = useTranslation();

    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.statisticsMenuClosePrevented = true;
    }, []);

    const signals = [
        {
            labelKey: 'PLAYER_SIGNAL_SOURCES',
            value: peers,
            meaningKey: 'PLAYER_SIGNAL_SOURCES_MEANING',
        },
        {
            labelKey: 'PLAYER_SIGNAL_BUFFER',
            value: formatBufferValue(t, cached, bufferRunway),
            meaningKey: !cached && bufferRunway !== null ? 'PLAYER_SIGNAL_BUFFER_MEANING' : null,
        },
        {
            labelKey: 'PLAYER_SPEED',
            value: `${speed} ${t('MB_S')}`,
            meaningKey: getSpeedMeaningKey(cached, keepingUp),
        },
    ];

    return (
        <div ref={ref} className={classNames(className, styles['statistics-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['title']}>
                {t('PLAYER_STREAM_QUALITY')}
            </div>
            {ready ? (
                <React.Fragment>
                    <div className={styles['signals']}>
                        {signals.map(({ labelKey, value, meaningKey }) => (
                            <div key={labelKey} className={styles['signal']}>
                                <div className={styles['signal-head']}>
                                    <div className={styles['label']}>
                                        {t(labelKey)}
                                    </div>
                                    <div className={styles['value']}>
                                        { value }
                                    </div>
                                </div>
                                {meaningKey && (
                                    <div className={styles['meaning']}>
                                        {t(meaningKey)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={styles['divider']} />
                    <details className={styles['technical']}>
                        <summary className={styles['technical-toggle']}>
                            {t('PLAYER_MORE_DETAILS')}
                        </summary>
                        <div className={styles['technical-content']}>
                            <div className={styles['detail-row']}>
                                <div className={styles['label']}>
                                    {t('PLAYER_COMPLETED')}
                                </div>
                                <div className={styles['value']}>
                                    { Math.min(completed, 100) } %
                                </div>
                            </div>
                            <div className={styles['info-hash']}>
                                <div className={styles['label']}>
                                    {t('PLAYER_INFO_HASH')}
                                </div>
                                <div className={styles['info-hash-value']}>
                                    { infoHash }
                                </div>
                            </div>
                        </div>
                    </details>
                </React.Fragment>
            ) : (
                <div className={styles['checking']}>
                    {t('PLAYER_QUALITY_VERDICT_CHECKING')}
                </div>
            )}
        </div>
    );
}));

StatisticsMenu.propTypes = {
    className: PropTypes.string,
    ready: PropTypes.bool,
    cached: PropTypes.bool,
    bufferRunway: PropTypes.number,
    keepingUp: PropTypes.bool,
    peers: PropTypes.number,
    speed: PropTypes.number,
    completed: PropTypes.number,
    infoHash: PropTypes.string,
};

module.exports = StatisticsMenu;
