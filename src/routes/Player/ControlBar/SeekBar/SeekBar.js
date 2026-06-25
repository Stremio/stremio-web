// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { t } = require('i18next');
const { default: useRouteFocused } = require('stremio/common/useRouteFocused');
const { useBinaryState } = require('stremio/common');
const { Button, Slider } = require('stremio/components');
const formatTime = require('./formatTime');
const styles = require('./styles');

const SeekBar = ({ className, time, duration, buffered, onSeekRequested, playbackSpeed, live, liveProgress }) => {
    const progressTime = typeof liveProgress === 'number' && !isNaN(liveProgress) ? liveProgress : 0;
    const progressDuration = live ? 100 : duration;
    const currentTime = live ? progressTime : time;
    const disabled = live || currentTime === null || isNaN(currentTime) || progressDuration === null || isNaN(progressDuration);
    const routeFocused = useRouteFocused();
    const [seekTime, setSeekTime] = React.useState(null);

    const [remainingTimeMode,,, toggleRemainingTimeMode] = useBinaryState(false);
    const resetTimeDebounced = React.useCallback(debounce(() => {
        setSeekTime(null);
    }, 1500), []);
    const onRemainingTimeModeToggle = React.useCallback(() => {
        if (!live) {
            toggleRemainingTimeMode();
        }
    }, [live, toggleRemainingTimeMode]);
    const onSlide = React.useCallback((time) => {
        resetTimeDebounced.cancel();
        setSeekTime(time);
    }, []);
    const onComplete = React.useCallback((time) => {
        resetTimeDebounced();
        setSeekTime(time);
        if (typeof onSeekRequested === 'function') {
            onSeekRequested(time);
        }
    }, [onSeekRequested]);
    React.useLayoutEffect(() => {
        if (!routeFocused || disabled) {
            resetTimeDebounced.cancel();
            setSeekTime(null);
        }
    }, [routeFocused, disabled]);
    React.useEffect(() => {
        return () => {
            resetTimeDebounced.cancel();
        };
    }, []);
    return (
        <div className={classnames(className, styles['seek-bar-container'], { 'active': seekTime !== null })}>
            <div className={styles['label']}>
                {
                    live ?
                        <div className={styles['live-badge-layer']}>
                            <div className={styles['live-badge-label']}>{t('PLAYER_LIVE')}</div>
                        </div>
                        :
                        formatTime(seekTime !== null ? seekTime : currentTime)
                }
            </div>
            <Slider
                className={classnames(styles['slider'], { 'active': seekTime !== null, [styles['live-slider']]: live })}
                value={
                    !disabled ?
                        seekTime !== null ? seekTime : currentTime
                        :
                        live ?
                            progressTime
                            :
                            0
                }
                buffered={
                    live ?
                        null
                        :
                        buffered
                }
                minimumValue={0}
                maximumValue={progressDuration}
                disabled={disabled}
                onSlide={onSlide}
                onComplete={onComplete}
            />
            <Button onClick={onRemainingTimeModeToggle} tabIndex={-1}>
                <div className={styles['label']}>
                    {remainingTimeMode && duration !== null && !isNaN(duration)
                        ? formatTime((duration - currentTime)/playbackSpeed, '-')
                        : live ? '' : formatTime(duration) }
                </div>
            </Button>
        </div>
    );
};

SeekBar.propTypes = {
    className: PropTypes.string,
    time: PropTypes.number,
    duration: PropTypes.number,
    buffered: PropTypes.number,
    onSeekRequested: PropTypes.func,
    playbackSpeed: PropTypes.number,
    live: PropTypes.bool,
    liveProgress: PropTypes.number
};

module.exports = SeekBar;
