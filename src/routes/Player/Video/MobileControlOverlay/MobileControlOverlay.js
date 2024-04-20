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

        function onPointerDown(event) {
            if (buttonsRef.current !== undefined && buttonsRef.current !== null &&
                Array.from(buttonsRef.current.children).some((button) => button !== undefined && button !== null && button.contains(event.target))
            )
                return;

            event.preventDefault();
            onFingerDown(event.clientX, event.clientY);
        }

        function onPointerMove(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            onFingerMove(event.clientX, event.clientY);
        }

        function onPointerUp(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            onFingerUp(event.clientX, event.clientY);

            onDone();
        }

        function onPointerCancel() {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            if (lastMoveX !== null && lastMoveY !== null)
                onFingerUp(lastMoveX, lastMoveY);

            onDone();
        }

        tag.addEventListener('pointerdown', onPointerDown, {passive: false, capture: true});
        tag.addEventListener('pointermove', onPointerMove, {passive: true});
        tag.addEventListener('pointerup', onPointerUp, {passive: true});
        tag.addEventListener('pointercancel', onPointerCancel, {passive: true});

        return () => {
            tag.removeEventListener('pointerdown', onPointerDown, {passive: false, capture: true});
            tag.removeEventListener('pointermove', onPointerMove, {passive: true});
            tag.removeEventListener('pointerup', onPointerUp, {passive: true});
            tag.removeEventListener('pointercancel', onPointerCancel, {passive: true});
            isDone = true;
            touchActive = false;
        };
    }, []);

    const onPlayPauseButtonPointerUp = React.useCallback((event) => {
        // only call `onPlayPause` if the finger was lift on this button
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
                    <div className={styles['button']} onPointerUp={onPlayPauseButtonPointerUp}>
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
