const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { Slider } = require('stremio/common');
const formatTime = require('./formatTime');
const styles = require('./styles');

const SeekBar = ({ className, time, duration, dispatch }) => {
    const [seekTime, setSeekTime] = React.useState(null);
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
        if (typeof dispatch === 'function') {
            dispatch({ propName: 'time', propValue: time });
        }
    }, []);
    const onCancel = React.useCallback(() => {
        resetTimeDebounced.cancel();
        setSeekTime(null);
    }, []);
    React.useEffect(() => {
        return () => {
            resetTimeDebounced.cancel();
        };
    }, []);
    return (
        <div className={classnames(className, styles['seek-bar-container'], { 'active': seekTime !== null })}>
            <div className={styles['label']}>{formatTime(seekTime !== null ? seekTime : time)}</div>
            <Slider
                className={styles['slider']}
                value={seekTime !== null ? seekTime : time}
                minimumValue={0}
                maximumValue={duration}
                orientation={'horizontal'}
                onSlide={onSlide}
                onComplete={onComplete}
                onCancel={onCancel}
            />
            <div className={styles['label']}>{formatTime(duration)}</div>
        </div>
    );
};

SeekBar.propTypes = {
    className: PropTypes.string,
    time: PropTypes.number,
    duration: PropTypes.number,
    dispatch: PropTypes.func
};

module.exports = SeekBar;
