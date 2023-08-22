// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { Slider } = require('stremio/common');
const styles = require('./styles');

const VolumeSlider = ({ className, volume, onVolumeChangeRequested }) => {
    const disabled = volume === null || isNaN(volume);
    const routeFocused = useRouteFocused();
    const [slidingVolume, setSlidingVolume] = React.useState(null);
    const resetVolumeDebounced = React.useCallback(debounce(() => {
        setSlidingVolume(null);
    }, 100), []);
    const onSlide = React.useCallback((volume) => {
        resetVolumeDebounced.cancel();
        setSlidingVolume(volume);
        if (typeof onVolumeChangeRequested === 'function') {
            onVolumeChangeRequested(volume);
        }
    }, [onVolumeChangeRequested]);
    const onComplete = React.useCallback((volume) => {
        resetVolumeDebounced();
        setSlidingVolume(volume);
        if (typeof onVolumeChangeRequested === 'function') {
            onVolumeChangeRequested(volume);
        }
    }, [onVolumeChangeRequested]);
    React.useLayoutEffect(() => {
        if (!routeFocused || disabled) {
            resetVolumeDebounced.cancel();
            setSlidingVolume(null);
        }
    }, [routeFocused, disabled]);
    React.useEffect(() => {
        return () => {
            resetVolumeDebounced.cancel();
        };
    }, []);
    return (
        <Slider
            className={classnames(className, styles['volume-slider'], { 'active': slidingVolume !== null })}
            value={
                !disabled ?
                    slidingVolume !== null ? slidingVolume : volume
                    :
                    100
            }
            minimumValue={0}
            maximumValue={100}
            disabled={disabled}
            onSlide={onSlide}
            onComplete={onComplete}
        />
    );
};

VolumeSlider.propTypes = {
    className: PropTypes.string,
    volume: PropTypes.number,
    onVolumeChangeRequested: PropTypes.func
};

module.exports = VolumeSlider;
