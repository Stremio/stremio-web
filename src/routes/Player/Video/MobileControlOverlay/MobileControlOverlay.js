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

const MobileControlOverlay = ({ className, paused, visible, setVisibility, onPlayPause, onSlideUp, onSkip10Seconds, onGoBack10Seconds }) => {
    const ref = React.useRef();
    const buttonsRef = React.useRef();
    let isDone = false;

    React.useLayoutEffect(() => {
        if (ref.current === undefined || ref.current === null)
            return;

        const tag = ref.current;

        let lastTouchEndTime = 0;
        let lastTouchStartX = null;
        let lastTouchStartY = null;

        function onDoubleTap(x, y) {
            const screenMiddleX = window.innerWidth / 2;

            if (x < screenMiddleX - (middleGapExcludedFromSideGestures / 2)) {
                if (onGoBack10Seconds instanceof Function)
                    onGoBack10Seconds();

                setVisibility(false);
            } else if (x > screenMiddleX + (middleGapExcludedFromSideGestures / 2)) {
                if (onSkip10Seconds instanceof Function)
                    onSkip10Seconds();

                setVisibility(false);
            }
        }

        function onSingleTap() {
            setVisibility((visible) => !visible);
        }

        function onTouchStart(event) {
            if (buttonsRef.current !== undefined && buttonsRef.current !== null &&
                Array.from(buttonsRef.current.children).some((button) => button !== undefined && button !== null && button.contains(event.target))
            )
                return;

            // event.preventDefault();

            const touch = event.touches[0];
            const touchStartTime = Date.now();
            const currentTouchStartX = touch.clientX;
            const currentTouchStartY = touch.clientY;

            function onTouchEnd(event) {
                if (isDone) {
                    tag.removeEventListener('touchend', onTouchEnd, {passive: false, capture: true});
                    return;
                }

                const touch = event.changedTouches[0];

                const touchEndTime = Date.now();

                const deltaX = touch.clientX - currentTouchStartX;
                const deltaY = touch.clientY - currentTouchStartY;
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
                        onSlideUp();
                        triggeredAction = true;
                    }
                }

                lastTouchEndTime = touchEndTime;
                lastTouchStartX = currentTouchStartX;
                lastTouchStartY = currentTouchStartY;

                tag.removeEventListener('touchend', onTouchEnd, {passive: false, capture: true});
            }

            tag.addEventListener('touchend', onTouchEnd, {passive: false, capture: true});
        }

        tag.addEventListener('touchstart', onTouchStart, {passive: false, capture: true});

        return () => {
            tag.removeEventListener('touchstart', onTouchStart, {passive: false, capture: true});
            isDone = true;
        };
    }, []);

    const onPlayPauseButtonTouchEnd = React.useCallback((event) => {
        // only call `onPlayPause` if the finger was lift on this button
        // we use a touch event to make the button press be instant and have no delay

        const touch = event.changedTouches[0];
        const rect = event.currentTarget.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            onPlayPause();
        }
    }, [onPlayPause]);

    return (
        <div className={classnames(className, styles['video-mobile-control-overlay'], { [styles['show']]: visible })} ref={ref}>
            <div className={styles['buttons']} ref={buttonsRef}>
                <div className={styles['button']} onTouchEnd={onPlayPauseButtonTouchEnd}>
                    <Icon className={styles['icon']} name={paused ? 'play' : 'pause'} />
                </div>
            </div>
        </div>
    );
};

MobileControlOverlay.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    visible: PropTypes.bool,
    setVisibility: PropTypes.func,
    onPlayPause: PropTypes.func,
    onSlideUp: PropTypes.func,
    onSkip10Seconds: PropTypes.func,
    onGoBack10Seconds: PropTypes.func,
};

module.exports = MobileControlOverlay;
