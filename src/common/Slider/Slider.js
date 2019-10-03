const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useFocusable } = require('stremio-router');
const useAnimationFrame = require('stremio/common/useAnimationFrame');
const useLiveRef = require('stremio/common/useLiveRef');
const styles = require('./styles');

const Slider = ({ className, value, minimumValue, maximumValue, onSlide, onComplete }) => {
    minimumValue = minimumValue !== null && !isNaN(minimumValue) && isFinite(minimumValue) ? minimumValue : 0;
    maximumValue = maximumValue !== null && !isNaN(maximumValue) && isFinite(maximumValue) ? maximumValue : 100;
    value = value !== null && !isNaN(value) && value >= minimumValue && value <= maximumValue ? value : 0;
    const onSlideRef = useLiveRef(onSlide, [onSlide]);
    const onCompleteRef = useLiveRef(onComplete, [onComplete]);
    const sliderContainerRef = React.useRef(null);
    const [active, setActive] = React.useState(false);
    const focusable = useFocusable();
    const [requestThumbAnimation, cancelThumbAnimation] = useAnimationFrame();
    const calculateValueForMouseX = React.useCallback((mouseX) => {
        if (sliderContainerRef.current === null) {
            return 0;
        }

        const minimumValue = parseInt(sliderContainerRef.current.getAttribute('aria-valuemin'));
        const maximumValue = parseInt(sliderContainerRef.current.getAttribute('aria-valuemax'));
        const { x: sliderX, width: sliderWidth } = sliderContainerRef.current.getBoundingClientRect();
        const thumbStart = Math.min(Math.max(mouseX - sliderX, 0), sliderWidth);
        const value = (thumbStart / sliderWidth) * (maximumValue - minimumValue) + minimumValue;
        return value;
    }, []);
    const onBlur = React.useCallback(() => {
        const value = parseInt(sliderContainerRef.current.getAttribute('aria-valuenow'));
        if (typeof onSlideRef.current === 'function') {
            onSlideRef.current(value);
        }
        if (typeof onCompleteRef.current === 'function') {
            onCompleteRef.current(value);
        }

        setActive(false);
    }, []);
    const onMouseUp = React.useCallback((event) => {
        const value = calculateValueForMouseX(event.clientX);
        if (typeof onCompleteRef.current === 'function') {
            onCompleteRef.current(value);
        }

        setActive(false);
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

        setActive(true);
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
        }

        document.documentElement.className = classnames(classList);
    }, []);
    React.useEffect(() => {
        if (active) {
            retainThumb();
        } else {
            releaseThumb();
        }
    }, [active]);
    React.useEffect(() => {
        if (!focusable) {
            setActive(false);
        }
    }, [focusable]);
    React.useEffect(() => {
        return () => {
            releaseThumb();
        };
    }, []);
    const thumbPosition = React.useMemo(() => {
        return Math.max(0, Math.min(1, (value - minimumValue) / (maximumValue - minimumValue)));
    }, [value, minimumValue, maximumValue]);
    return (
        <div ref={sliderContainerRef} className={classnames(className, styles['slider-container'], { 'active': active })} aria-valuenow={value} aria-valuemin={minimumValue} aria-valuemax={maximumValue} onMouseDown={onMouseDown}>
            <div className={styles['layer']}>
                <div className={styles['track']} />
            </div>
            <div className={styles['layer']}>
                <div className={styles['track-before']} style={{ width: `calc(100% * ${thumbPosition})` }} />
            </div>
            <div className={styles['layer']}>
                <svg className={styles['thumb']} style={{ marginLeft: `calc(100% * ${thumbPosition})` }} viewBox={'0 0 10 10'}>
                    <circle cx={'5'} cy={'5'} r={'5'} />
                </svg>
            </div>
        </div>
    );
};

Slider.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
    minimumValue: PropTypes.number,
    maximumValue: PropTypes.number,
    onSlide: PropTypes.func,
    onComplete: PropTypes.func
};

module.exports = Slider;
