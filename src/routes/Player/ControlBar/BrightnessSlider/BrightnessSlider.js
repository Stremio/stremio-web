// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { Slider } = require('stremio/components');
const styles = require('./styles');

const DEFAULT_BRIGHTNESS = 100;

const BrightnessSlider = ({ className, brightness, onBrightnessChangeRequested }) => {
    const disabled = brightness === null || isNaN(brightness);
    const routeFocused = useRouteFocused();
    const [slidingBrightness, setSlidingBrightness] = React.useState(null);
    const resetBrightnessDebounced = React.useCallback(debounce(() => {
        setSlidingBrightness(null);
    }, 100), []);
    const onSlide = React.useCallback((nextBrightness) => {
        resetBrightnessDebounced.cancel();
        setSlidingBrightness(nextBrightness);
        if (typeof onBrightnessChangeRequested === 'function') {
            onBrightnessChangeRequested(nextBrightness);
        }
    }, [onBrightnessChangeRequested]);
    const onComplete = React.useCallback((nextBrightness) => {
        resetBrightnessDebounced();
        setSlidingBrightness(nextBrightness);
        if (typeof onBrightnessChangeRequested === 'function') {
            onBrightnessChangeRequested(nextBrightness);
        }
    }, [onBrightnessChangeRequested]);
    React.useLayoutEffect(() => {
        if (!routeFocused || disabled) {
            resetBrightnessDebounced.cancel();
            setSlidingBrightness(null);
        }
    }, [routeFocused, disabled]);
    React.useEffect(() => {
        return () => {
            resetBrightnessDebounced.cancel();
        };
    }, []);
    return (
        <Slider
            className={classnames(className, styles['brightness-slider'], { 'active': slidingBrightness !== null })}
            value={!disabled ? (slidingBrightness !== null ? slidingBrightness : brightness) : DEFAULT_BRIGHTNESS}
            minimumValue={0}
            maximumValue={200}
            disabled={disabled}
            onSlide={onSlide}
            onComplete={onComplete}
        />
    );
};

BrightnessSlider.propTypes = {
    brightness: PropTypes.number,
    className: PropTypes.string,
    onBrightnessChangeRequested: PropTypes.func,
};

module.exports = BrightnessSlider;
