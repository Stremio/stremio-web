// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { default: useRouteFocused } = require('stremio/common/useRouteFocused');
const { usePlatform } = require('stremio/common');
const { Slider } = require('stremio/components');
const styles = require('./styles');

const VolumeSlider = ({ className, volume, onVolumeChangeRequested, muted }) => {
    const { shell } = usePlatform();
    const disabled = volume === null || isNaN(volume);
    const routeFocused = useRouteFocused();
    const [slidingVolume, setSlidingVolume] = React.useState(null);
    const maxVolume = shell.active ? 200: 100;
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
                    !muted ?
                        slidingVolume !== null ? slidingVolume : volume
                        : 0
                    :
                    100
            }
            minimumValue={0}
            maximumValue={maxVolume}
            disabled={disabled}
            onSlide={onSlide}
            onComplete={onComplete}
            audioBoost={!!shell.active}
        />
    );
};

VolumeSlider.propTypes = {
    className: PropTypes.string,
    volume: PropTypes.number,
    onVolumeChangeRequested: PropTypes.func,
    muted: PropTypes.bool,
};

module.exports = VolumeSlider;
