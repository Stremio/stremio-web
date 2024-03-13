// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { Slider, Button } = require('stremio/common');
const formatTime = require('./formatTime');
const styles = require('./styles');

const SeekBar = ({ className, time, duration, buffered, onSeekRequested }) => {
    const disabled = time === null || isNaN(time) || duration === null || isNaN(duration);
    const routeFocused = useRouteFocused();
    const [seekTime, setSeekTime] = React.useState(null);

    const DURATION_MODE_OPTIONS = {
        'totalTime': 'totalTime',
        'remainingTime': 'remainingTime'
    };

    const [durationMode, setDurationMode] = React.useState(DURATION_MODE_OPTIONS.totalTime);
    const resetTimeDebounced = React.useCallback(debounce(() => {
        setSeekTime(null);
    }, 1500), []);
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
            <div className={styles['label']}>{formatTime(seekTime !== null ? seekTime : time)}</div>
            <Slider
                className={classnames(styles['slider'], { 'active': seekTime !== null })}
                value={
                    !disabled ?
                        seekTime !== null ? seekTime : time
                        :
                        0
                }
                buffered={buffered}
                minimumValue={0}
                maximumValue={duration}
                disabled={disabled}
                onSlide={onSlide}
                onComplete={onComplete}
            />
            <Button
                onClick={() => {
                    durationMode === DURATION_MODE_OPTIONS.totalTime
                        ? setDurationMode(DURATION_MODE_OPTIONS.remainingTime)
                        : setDurationMode(DURATION_MODE_OPTIONS.totalTime);
                }}
            >
                <div className={styles['label']}>
                    {durationMode === DURATION_MODE_OPTIONS.totalTime
                        ? formatTime(duration)
                        : formatTime(duration - time, '-')}
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
    onSeekRequested: PropTypes.func
};

module.exports = SeekBar;
