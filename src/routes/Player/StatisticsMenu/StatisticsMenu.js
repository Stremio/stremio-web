// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/components');
const formatTime = require('../ControlBar/SeekBar/formatTime');
const styles = require('./styles.less');

const QUALITY = {
    'checking': { tone: 'neutral', label: 'PLAYER_QUALITY_CHECKING', verdict: 'PLAYER_QUALITY_VERDICT_CHECKING' },
    'no-buffer-data': { tone: 'neutral', label: 'PLAYER_QUALITY_LIMITED', verdict: 'PLAYER_QUALITY_VERDICT_LIMITED' },
    'cached': { tone: 'good', label: 'PLAYER_QUALITY_GOOD', verdict: 'PLAYER_QUALITY_VERDICT_CACHED' },
    'keeping-up': { tone: 'good', label: 'PLAYER_QUALITY_GOOD', verdict: 'PLAYER_QUALITY_VERDICT_KEEPING_UP' },
    'buffer-healthy': { tone: 'good', label: 'PLAYER_QUALITY_GOOD', verdict: 'PLAYER_QUALITY_VERDICT_BUFFER_HEALTHY' },
    'draining': { tone: 'fair', label: 'PLAYER_QUALITY_FAIR', verdict: 'PLAYER_QUALITY_VERDICT_DRAINING' },
    'buffer-low': { tone: 'poor', label: 'PLAYER_QUALITY_POOR', verdict: 'PLAYER_QUALITY_VERDICT_BUFFER_LOW' },
};

const formatBufferValue = (t, cached, bufferKnown, bufferRunway) => {
    if (cached) {
        return t('PLAYER_SIGNAL_BUFFER_VALUE_CACHED');
    }
    if (!bufferKnown) {
        return t('PLAYER_SIGNAL_BUFFER_VALUE_UNKNOWN');
    }
    return formatTime(bufferRunway * 1000);
};

const formatSpeedMeaning = (t, cached, keepingUp) => {
    if (cached || typeof keepingUp !== 'boolean') {
        return null;
    }
    return t(keepingUp ? 'PLAYER_SIGNAL_SPEED_MEANING_OK' : 'PLAYER_SIGNAL_SPEED_MEANING_SLOW');
};

const StatisticsMenu = React.memo(React.forwardRef(({ className, quality, bufferRunway, keepingUp, peers, speed, completed, infoHash }, ref) => {
    const { t } = useTranslation();
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const status = QUALITY[quality] ? quality : 'checking';
    const { tone, label, verdict } = QUALITY[status];
    const cached = status === 'cached';
    const bufferKnown = Number.isFinite(bufferRunway);

    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.statisticsMenuClosePrevented = true;
    }, []);
    const toggleDetails = React.useCallback(() => {
        setDetailsOpen((open) => !open);
    }, []);

    const bufferValue = formatBufferValue(t, cached, bufferKnown, bufferRunway);
    const speedMeaning = formatSpeedMeaning(t, cached, keepingUp);

    return (
        <div ref={ref} className={classNames(className, styles['statistics-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['header']}>
                <div className={styles['title']}>
                    {t('PLAYER_STREAM_QUALITY')}
                </div>
                <div className={classNames(styles['status-label'], styles[`tone-${tone}`])}>
                    {t(label)}
                </div>
            </div>
            <div className={styles['verdict']}>
                {t(verdict)}
            </div>
            {
                status !== 'checking' ?
                    <React.Fragment>
                        <div className={styles['divider']} />
                        <div className={styles['signals']}>
                            <div className={styles['signal']}>
                                <div className={styles['signal-head']}>
                                    <div className={styles['label']}>
                                        {t('PLAYER_SIGNAL_SOURCES')}
                                    </div>
                                    <div className={styles['value']}>
                                        { peers }
                                    </div>
                                </div>
                                <div className={styles['meaning']}>
                                    {t('PLAYER_SIGNAL_SOURCES_MEANING')}
                                </div>
                            </div>
                            <div className={styles['signal']}>
                                <div className={styles['signal-head']}>
                                    <div className={styles['label']}>
                                        {t('PLAYER_SIGNAL_BUFFER')}
                                    </div>
                                    <div className={styles['value']}>
                                        { bufferValue }
                                    </div>
                                </div>
                                {
                                    !cached && bufferKnown ?
                                        <div className={styles['meaning']}>
                                            {t('PLAYER_SIGNAL_BUFFER_MEANING')}
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <div className={styles['signal']}>
                                <div className={styles['signal-head']}>
                                    <div className={styles['label']}>
                                        {t('PLAYER_SPEED')}
                                    </div>
                                    <div className={styles['value']}>
                                        {`${speed} ${t('MB_S')}`}
                                    </div>
                                </div>
                                {
                                    speedMeaning ?
                                        <div className={styles['meaning']}>
                                            { speedMeaning }
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <div className={styles['divider']} />
                        <div className={styles['technical']}>
                            <Button className={styles['technical-toggle']} onClick={toggleDetails} aria-expanded={detailsOpen} aria-controls={'statistics-technical-details'}>
                                <Icon className={classNames(styles['chevron'], { [styles['open']]: detailsOpen })} name={'caret-down'} aria-hidden={true} />
                                <div className={styles['technical-label']}>
                                    {t('PLAYER_MORE_DETAILS')}
                                </div>
                            </Button>
                            <div className={classNames(styles['collapsible'], { [styles['open']]: detailsOpen })}>
                                <div className={styles['collapsible-inner']}>
                                    <div className={styles['technical-content']} id={'statistics-technical-details'} aria-hidden={!detailsOpen}>
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
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                    :
                    null
            }
        </div>
    );
}));

StatisticsMenu.propTypes = {
    className: PropTypes.string,
    quality: PropTypes.string,
    bufferRunway: PropTypes.number,
    keepingUp: PropTypes.bool,
    peers: PropTypes.number,
    speed: PropTypes.number,
    completed: PropTypes.number,
    infoHash: PropTypes.string,
};

module.exports = StatisticsMenu;
