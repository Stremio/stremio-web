const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { Slider } = require('stremio/common');
const styles = require('./styles');

const VolumeSlider = ({ className, volume, dispatch }) => {
    const [slidingVolume, setSlidingVolume] = React.useState(null);
    const resetVolumeDebounced = React.useCallback(debounce(() => {
        setSlidingVolume(null);
    }, 100), []);
    const onSlide = React.useCallback((volume) => {
        resetVolumeDebounced.cancel();
        setSlidingVolume(volume);
    }, []);
    const onComplete = React.useCallback((volume) => {
        resetVolumeDebounced();
        setSlidingVolume(volume);
        if (typeof dispatch === 'function') {
            dispatch({ propName: 'volume', propValue: volume });
        }
    }, []);
    React.useEffect(() => {
        return () => {
            resetVolumeDebounced.cancel();
        };
    }, []);
    return (
        <Slider
            className={classnames(className, styles['volume-slider'], { 'active': slidingVolume !== null }, { 'disabled': volume === null || isNaN(volume) })}
            value={slidingVolume !== null ? slidingVolume : volume !== null ? volume : 100}
            minimumValue={0}
            maximumValue={100}
            onSlide={onSlide}
            onComplete={onComplete}
        />
    );
};

VolumeSlider.propTypes = {
    className: PropTypes.string,
    volume: PropTypes.number,
    dispatch: PropTypes.func
};

module.exports = VolumeSlider;
