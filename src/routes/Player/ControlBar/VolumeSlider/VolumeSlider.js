// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { Slider } = require('stremio/components');
const styles = require('./styles');

const VolumeSlider = ({ className, volume, onVolumeChangeRequested, muted }) => {
    const { shell } = useServices();
    const routeFocused = useRouteFocused();
    const [slidingVolume, setSlidingVolume] = React.useState(null);
    const maxVolume = shell.active ? 200 : 100;
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
        if (!routeFocused) {
            resetVolumeDebounced.cancel();
            setSlidingVolume(null);
        }
    }, [routeFocused]);
    React.useEffect(() => {
        return () => {
            resetVolumeDebounced.cancel();
        };
    }, []);
    return (
        <Slider
            className={classnames(className, styles['volume-slider'], { 'active': slidingVolume !== null })}
            value={
                !muted ?
                    slidingVolume !== null ? slidingVolume : volume
                    : 0
            }
            minimumValue={0}
            maximumValue={maxVolume}
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
