// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const styles = require('./styles');

const moveDeltaToBeConsideredGesture = 10;
const minMoveDeltaToBeConsideredDirectionGesture = 100;
const maxDelayToBeConsideredTap = 150;
const maxDelayBetweenTapsToBeConsideredDoubleTap = 300;
const middleGapExcludedFromSideGestures = 100;

const MobileControlOverlay = ({ className, paused, visible, setHidden, onPlayPause, onSlideUp, onSkip10Seconds, onGoBack10Seconds }) => {
    const ref = React.useRef();
    const buttonsRef = React.useRef();

    const pausedRef = React.useRef();
    pausedRef.current = paused;

    const setHiddenRef = React.useRef();
    setHiddenRef.current = setHidden;

    const onSlideUpRef = React.useRef();
    onSlideUpRef.current = onSlideUp;

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

        function onDoubleTap(x, y) {
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

        function onTouchStart(event) {
            if (buttonsRef.current !== undefined && buttonsRef.current !== null &&
                Array.from(buttonsRef.current.children).some((button) => button !== undefined && button !== null && button.contains(event.target))
            )
                return;

            // event.preventDefault();

            const touch = event.touches[0];
            touchStartTime = Date.now();
            currentTouchStartX = touch.clientX;
            currentTouchStartY = touch.clientY;
            lastMoveX = currentTouchStartX;
            lastMoveY = currentTouchStartY;
            touchActive = true;
        }

        function onDone() {
            touchActive = false;
        }

        function onTouchMove(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            const touch = event.touches[0];
            lastMoveX = touch.clientX;
            lastMoveY = touch.clientY;
        }

        function touchFinished(x, y) {
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
            } else if (Math.abs(deltaY) > minMoveDeltaToBeConsideredDirectionGesture) {
                if (!triggeredAction && deltaY > 0) {
                    onSlideUpRef.current();
                    triggeredAction = true;
                }
            }

            lastTouchEndTime = touchEndTime;
            lastTouchStartX = currentTouchStartX;
            lastTouchStartY = currentTouchStartY;
        }

        function onTouchCancel() {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            if (lastMoveX !== null && lastMoveY !== null)
                touchFinished(lastMoveX, lastMoveY);

            onDone();
        }

        function onTouchEnd(event) {
            if (isDone || !touchActive) {
                onDone();
                return;
            }

            const touch = event.changedTouches[0];

            touchFinished(touch.clientX, touch.clientY);

            onDone();
        }

        tag.addEventListener('touchstart', onTouchStart, {passive: false, capture: true});
        tag.addEventListener('touchmove', onTouchMove, {passive: true});
        tag.addEventListener('touchend', onTouchEnd, {passive: true});
        tag.addEventListener('touchcancel', onTouchCancel, {passive: true});

        return () => {
            tag.removeEventListener('touchstart', onTouchStart, {passive: false, capture: true});
            tag.removeEventListener('touchmove', onTouchMove, {passive: true});
            tag.removeEventListener('touchend', onTouchEnd, {passive: true});
            tag.removeEventListener('touchcancel', onTouchCancel, {passive: true});
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
    }, [onPlayPause, paused]);

    return (
        <div className={classnames(className, styles['video-mobile-control-overlay'], { [styles['show']]: visible })} ref={ref}>
            <div className={styles['buttons']} ref={buttonsRef}>
                {
                    typeof paused === 'boolean' &&
                    <div className={styles['button']} onTouchEnd={onPlayPauseButtonTouchEnd}>
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
    onSkip10Seconds: PropTypes.func,
    onGoBack10Seconds: PropTypes.func,
};

module.exports = MobileControlOverlay;
