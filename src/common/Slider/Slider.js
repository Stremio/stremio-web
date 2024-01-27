// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useRouteFocused } = require('stremio-router');
const useAnimationFrame = require('stremio/common/useAnimationFrame');
const useLiveRef = require('stremio/common/useLiveRef');
const styles = require('./styles');

const Slider = ({ className, value, buffered, minimumValue, maximumValue, disabled, onSlide, onComplete }) => {
    const minimumValueRef = useLiveRef(minimumValue !== null && !isNaN(minimumValue) ? minimumValue : 0);
    const maximumValueRef = useLiveRef(maximumValue !== null && !isNaN(maximumValue) ? maximumValue : 100);
    const valueRef = useLiveRef(value !== null && !isNaN(value) ? Math.min(maximumValueRef.current, Math.max(minimumValueRef.current, value)) : 0);
    const bufferedRef = useLiveRef(buffered !== null && !isNaN(buffered) ? Math.min(maximumValueRef.current, Math.max(minimumValueRef.current, buffered)) : 0);
    const onSlideRef = useLiveRef(onSlide);
    const onCompleteRef = useLiveRef(onComplete);
    const sliderContainerRef = React.useRef(null);
    const routeFocused = useRouteFocused();
    const [requestThumbAnimation, cancelThumbAnimation] = useAnimationFrame();
    const calculateValueForMouseX = React.useCallback((mouseX) => {
        if (sliderContainerRef.current === null) {
            return 0;
        }

        const { x: sliderX, width: sliderWidth } = sliderContainerRef.current.getBoundingClientRect();
        const thumbStart = Math.min(Math.max(mouseX - sliderX, 0), sliderWidth);
        const value = (thumbStart / sliderWidth) * (maximumValueRef.current - minimumValueRef.current) + minimumValueRef.current;
        return value;
    }, []);
    const retainThumb = React.useCallback(() => {
        window.addEventListener('blur', onBlur);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        document.documentElement.className = classnames(document.documentElement.className, styles['active-slider-within']);
    }, []);
    const releaseThumb = React.useCallback(() => {
        cancelThumbAnimation();
        window.removeEventListener('blur', onBlur);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
        const classList = document.documentElement.className.split(' ');
        const classIndex = classList.indexOf(styles['active-slider-within']);
        if (classIndex !== -1) {
            classList.splice(classIndex, 1);
            document.documentElement.className = classnames(classList);
        }
    }, []);
    const onBlur = React.useCallback(() => {
        if (typeof onSlideRef.current === 'function') {
            onSlideRef.current(valueRef.current);
        }

        if (typeof onCompleteRef.current === 'function') {
            onCompleteRef.current(valueRef.current);
        }

        releaseThumb();
    }, []);
    const onMouseUp = React.useCallback((event) => {
        const value = calculateValueForMouseX(event.clientX);
        if (typeof onCompleteRef.current === 'function') {
            onCompleteRef.current(value);
        }

        releaseThumb();
    }, []);
    const onMouseMove = React.useCallback((event) => {
        requestThumbAnimation(() => {
            const value = calculateValueForMouseX(event.clientX);
            if (typeof onSlideRef.current === 'function') {
                onSlideRef.current(value);
            }
        });
    }, []);
    const onMouseDown = React.useCallback((event) => {
        if (event.button !== 0) {
            return;
        }

        const value = calculateValueForMouseX(event.clientX);
        if (typeof onSlideRef.current === 'function') {
            onSlideRef.current(value);
        }

        retainThumb();
    }, []);
    React.useLayoutEffect(() => {
        if (!routeFocused || disabled) {
            releaseThumb();
        }
    }, [routeFocused, disabled]);
    React.useLayoutEffect(() => {
        return () => {
            releaseThumb();
        };
    }, []);
    const thumbPosition = Math.max(0, Math.min(1, (valueRef.current - minimumValueRef.current) / (maximumValueRef.current - minimumValueRef.current)));
    const bufferedPosition = Math.max(0, Math.min(1, (bufferedRef.current - minimumValueRef.current) / (maximumValueRef.current - minimumValueRef.current)));
    return (
        <div ref={sliderContainerRef} className={classnames(className, styles['slider-container'], { 'disabled': disabled })} onMouseDown={onMouseDown}>
            <div className={styles['layer']}>
                <div className={styles['track']} />
            </div>
            <div className={styles['layer']}>
                <div className={styles['track-before']} style={{ width: `calc(100% * ${bufferedPosition})` }} />
            </div>
            <div className={styles['layer']}>
                <div className={styles['track-after']} style={{ width: `calc(100% * ${thumbPosition})` }} />
            </div>
            <div className={styles['layer']}>
                <div className={styles['thumb']} style={{ marginLeft: `calc(100% * ${thumbPosition})` }} />
            </div>
        </div>
    );
};

Slider.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
    buffered: PropTypes.number,
    minimumValue: PropTypes.number,
    maximumValue: PropTypes.number,
    disabled: PropTypes.bool,
    onSlide: PropTypes.func,
    onComplete: PropTypes.func
};

module.exports = Slider;
