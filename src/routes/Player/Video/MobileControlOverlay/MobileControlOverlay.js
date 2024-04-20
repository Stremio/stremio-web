// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const styles = require('./styles');

const moveDeltaToBeConsideredGesture = 50;
const minMoveDeltaToBeConsideredDirectionGesture = () => window.innerHeight / 2;
const maxDelayToBeConsideredTap = 250;
const maxDelayBetweenTapsToBeConsideredDoubleTap = 650;
const middleGapExcludedFromSideGestures = 150;

const MobileControlOverlay = ({ className, paused, visible, setHidden, onPlayPause, onSlideUp, onSlideDown, onSkip10Seconds, onGoBack10Seconds }) => {
    const ref = React.useRef();
    const buttonsRef = React.useRef();

    const visibleRef = React.useRef();
    visibleRef.current = visible;

    const pausedRef = React.useRef();
    pausedRef.current = paused;

    const setHiddenRef = React.useRef();
    setHiddenRef.current = setHidden;

    const onSlideUpRef = React.useRef();
    onSlideUpRef.current = onSlideUp;

    const onSlideDownRef = React.useRef();
    onSlideDownRef.current = onSlideDown;

    const onSkip10SecondsRef = React.useRef();
    onSkip10SecondsRef.current = onSkip10Seconds;

    const onGoBack10SecondsRef = React.useRef();
    onGoBack10SecondsRef.current = onGoBack10Seconds;

    React.useLayoutEffect(() => {
        if (ref.current === undefined || ref.current === null)
            return;

        const tag = ref.current;

        let lastTouchEndTime = 0;
        let lastTouchStartX = null;
        let lastTouchStartY = null;

        let touchStartTime = 0;
        let currentTouchStartX = null;
        let currentTouchStartY = null;
        let lastMoveX = null;
        let lastMoveY = null;
        let touchActive = false;
        let isDone = false;

        function onDoubleTap(x) {
            const screenMiddleX = window.innerWidth / 2;

            if (x < screenMiddleX - (middleGapExcludedFromSideGestures / 2)) {
                if (onGoBack10Seconds instanceof Function)
                    onGoBack10SecondsRef.current();

                setHiddenRef.current(!pausedRef.current);
            } else if (x > screenMiddleX + (middleGapExcludedFromSideGestures / 2)) {
                if (onSkip10Seconds instanceof Function)
                    onSkip10SecondsRef.current();

                setHiddenRef.current(!pausedRef.current);
            }
        }

        function onSingleTap() {
            setHiddenRef.current((visible) => !visible);
        }

        function onDone() {
            touchActive = false;
        }

        function onFingerDown(x, y) {
            touchStartTime = Date.now();
            currentTouchStartX = x;
            currentTouchStartY = y;
            lastMoveX = currentTouchStartX;
            lastMoveY = currentTouchStartY;
            touchActive = true;
        }

        function onFingerMove(x, y) {
            lastMoveX = x;
            lastMoveY = y;
        }

        function onFingerUp(x, y) {
            const touchEndTime = Date.now();

            const deltaX = x - currentTouchStartX;
            const deltaY = y - currentTouchStartY;
            const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            let triggeredAction = false;

            if (delta < moveDeltaToBeConsideredGesture) {
                if (lastTouchStartX !== null && lastTouchStartY !== null) {
                    const deltaX = currentTouchStartX - lastTouchStartX;
                    const deltaY = currentTouchStartY - lastTouchStartY;
                    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                    if (!triggeredAction && delta < moveDeltaToBeConsideredGesture &&
                        touchEndTime - lastTouchEndTime <= maxDelayBetweenTapsToBeConsideredDoubleTap
                    ) {
                        onDoubleTap(currentTouchStartX, currentTouchStartY);
                        triggeredAction = true;
                    }
                }

                if (!triggeredAction && touchEndTime - touchStartTime <= maxDelayToBeConsideredTap) {
                    onSingleTap();
                    triggeredAction = true;
                }
            } else if (Math.abs(deltaY) > minMoveDeltaToBeConsideredDirectionGesture()) {
                if (!triggeredAction && deltaY < 0) {
                    onSlideUpRef.current();
                    triggeredAction = true;
                } else if (!triggeredAction && deltaY > 0) {
                    onSlideDownRef.current();
                    triggeredAction = true;
                }
            }

            lastTouchEndTime = touchEndTime;
            lastTouchStartX = currentTouchStartX;
            lastTouchStartY = currentTouchStartY;
        }

        function onTouchStart(event) {
            if (buttonsRef.current !== undefined && buttonsRef.current !== null &&
                Array.from(buttonsRef.current.children).some((button) => button !== undefined && button !== null && button.contains(event.target))
            )
                return;

            event.preventDefault();

            const touch = event.touches[0];
            onFingerDown(touch.clientX, touch.clientY);
        }

        function onTouchMove(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            const touch = event.touches[0];
            onFingerMove(touch.clientX, touch.clientY);
        }

        function onTouchCancel() {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            if (lastMoveX !== null && lastMoveY !== null)
                onFingerUp(lastMoveX, lastMoveY);

            onDone();
        }

        function onTouchEnd(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            const touch = event.changedTouches[0];

            onFingerUp(touch.clientX, touch.clientY);

            onDone();
        }

        function onMouseDown(event) {
            if (buttonsRef.current !== undefined && buttonsRef.current !== null &&
                Array.from(buttonsRef.current.children).some((button) => button !== undefined && button !== null && button.contains(event.target))
            )
                return;

            event.preventDefault();
            onFingerDown(event.clientX, event.clientY);
        }

        function onMouseMove(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            onFingerMove(event.clientX, event.clientY);
        }

        function onMouseUp(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            onFingerUp(event.clientX, event.clientY);

            onDone();
        }

        tag.addEventListener('touchstart', onTouchStart, {passive: false, capture: true});
        tag.addEventListener('touchmove', onTouchMove, {passive: true});
        tag.addEventListener('touchend', onTouchEnd, {passive: true});
        tag.addEventListener('touchcancel', onTouchCancel, {passive: true});
        tag.addEventListener('mousedown', onMouseDown, {passive: false, capture: true});
        tag.addEventListener('mousemove', onMouseMove, {passive: true});
        tag.addEventListener('mouseup', onMouseUp, {passive: true});

        return () => {
            tag.removeEventListener('touchstart', onTouchStart, {passive: false, capture: true});
            tag.removeEventListener('touchmove', onTouchMove, {passive: true});
            tag.removeEventListener('touchend', onTouchEnd, {passive: true});
            tag.removeEventListener('touchcancel', onTouchCancel, {passive: true});
            tag.removeEventListener('mousedown', onMouseDown, {passive: false, capture: true});
            tag.removeEventListener('mousemove', onMouseMove, {passive: true});
            tag.removeEventListener('mouseup', onMouseUp, {passive: true});
            isDone = true;
            touchActive = false;
        };
    }, []);

    const onPlayPauseButtonTouchEnd = React.useCallback((event) => {
        // only call `onPlayPause` if the finger was lift on this button
        // we use a touch event to make the button press be instant and have no delay

        const touch = event.changedTouches[0];
        const rect = event.currentTarget.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            onPlayPause();
            setHiddenRef.current(paused);
        }

        if (!visibleRef.current)
            event.preventDefault();
    }, [onPlayPause, paused]);

    const onPlayPauseButtonMouseUp = React.useCallback((event) => {
        // only call `onPlayPause` if the mouse was released on this button
        // we use a mouse event to make the button press be instant and have no delay

        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
            onPlayPause();
            setHiddenRef.current(paused);
        }

        if (!visibleRef.current)
            event.preventDefault();
    }, [onPlayPause, paused]);

    return (
        <div className={classnames(className, styles['video-mobile-control-overlay'], { [styles['show']]: visible })} ref={ref}>
            <div className={styles['buttons']} ref={buttonsRef}>
                {
                    typeof paused === 'boolean' &&
                    <div className={styles['button']} onTouchEnd={onPlayPauseButtonTouchEnd} onMouseUp={onPlayPauseButtonMouseUp}>
                        <Icon className={styles['icon']} name={paused ? 'play' : 'pause'} />
                    </div>
                }
            </div>
        </div>
    );
};

MobileControlOverlay.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    visible: PropTypes.bool,
    setHidden: PropTypes.func,
    onPlayPause: PropTypes.func,
    onSlideUp: PropTypes.func,
    onSlideDown: PropTypes.func,
    onSkip10Seconds: PropTypes.func,
    onGoBack10Seconds: PropTypes.func,
};

module.exports = MobileControlOverlay;
