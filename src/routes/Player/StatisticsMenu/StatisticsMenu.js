// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const formatTime = require('../ControlBar/SeekBar/formatTime');
const styles = require('./styles.less');

const QUALITY_DETAILS = {
    'checking': { tone: 'neutral', labelKey: 'PLAYER_QUALITY_CHECKING', verdictKey: 'PLAYER_QUALITY_VERDICT_CHECKING' },
    'no-buffer-data': { tone: 'neutral', labelKey: 'PLAYER_QUALITY_LIMITED', verdictKey: 'PLAYER_QUALITY_VERDICT_LIMITED' },
    'cached': { tone: 'good', labelKey: 'PLAYER_QUALITY_GOOD', verdictKey: 'PLAYER_QUALITY_VERDICT_CACHED' },
    'keeping-up': { tone: 'good', labelKey: 'PLAYER_QUALITY_GOOD', verdictKey: 'PLAYER_QUALITY_VERDICT_KEEPING_UP' },
    'buffer-healthy': { tone: 'good', labelKey: 'PLAYER_QUALITY_GOOD', verdictKey: 'PLAYER_QUALITY_VERDICT_BUFFER_HEALTHY' },
    'draining': { tone: 'fair', labelKey: 'PLAYER_QUALITY_FAIR', verdictKey: 'PLAYER_QUALITY_VERDICT_DRAINING' },
    'buffer-low': { tone: 'poor', labelKey: 'PLAYER_QUALITY_POOR', verdictKey: 'PLAYER_QUALITY_VERDICT_BUFFER_LOW' },
};

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

const StatisticsMenu = React.memo(React.forwardRef(({ className, quality, bufferRunway, keepingUp, peers, speed, completed, infoHash }, ref) => {
    const { t } = useTranslation();
    const { tone, labelKey: qualityLabelKey, verdictKey } = QUALITY_DETAILS[quality];
    const isCached = quality === 'cached';

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
            value: formatBufferValue(t, isCached, bufferRunway),
            meaningKey: !isCached && bufferRunway !== null ? 'PLAYER_SIGNAL_BUFFER_MEANING' : null,
        },
        {
            labelKey: 'PLAYER_SPEED',
            value: `${speed} ${t('MB_S')}`,
            meaningKey: getSpeedMeaningKey(isCached, keepingUp),
        },
    ];

    return (
        <div ref={ref} className={classNames(className, styles['statistics-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['header']}>
                <div className={styles['title']}>
                    {t('PLAYER_STREAM_QUALITY')}
                </div>
                <div className={classNames(styles['status-label'], styles[`tone-${tone}`])}>
                    {t(qualityLabelKey)}
                </div>
            </div>
            <div className={styles['verdict']}>
                {t(verdictKey)}
            </div>
            {quality !== 'checking' && (
                <React.Fragment>
                    <div className={styles['divider']} />
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
            )}
        </div>
    );
}));

StatisticsMenu.propTypes = {
    className: PropTypes.string,
    quality: PropTypes.oneOf(Object.keys(QUALITY_DETAILS)).isRequired,
    bufferRunway: PropTypes.number,
    keepingUp: PropTypes.bool,
    peers: PropTypes.number,
    speed: PropTypes.number,
    completed: PropTypes.number,
    infoHash: PropTypes.string,
};

module.exports = StatisticsMenu;
