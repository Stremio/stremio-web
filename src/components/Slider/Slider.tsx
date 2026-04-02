// Copyright (C) 2017-2023 Smart code 203358507

import React, { useCallback, useLayoutEffect, useRef } from 'react';
import classnames from 'classnames';
import { useRouteFocused } from 'stremio-router';
import useAnimationFrame from 'stremio/common/useAnimationFrame';
import useLiveRef from 'stremio/common/useLiveRef';
import styles from './styles.less';

export type PreviewTimeChangeHandler = (
    timeMs: number | null,
    clientX: number | null,
    clientY: number | null | undefined
) => void;

type Props = {
    className?: string,
    value?: number | null,
    buffered?: number | null,
    minimumValue?: number | null,
    maximumValue?: number | null,
    disabled?: boolean,
    onSlide?: (value: number) => void,
    onComplete?: (value: number) => void,
    onPreviewTimeChange?: PreviewTimeChangeHandler,
    audioBoost?: boolean,
};

const Slider = ({
    className,
    value,
    buffered,
    minimumValue,
    maximumValue,
    disabled,
    onSlide,
    onComplete,
    onPreviewTimeChange,
    audioBoost,
}: Props) => {
    const minimumValueRef = useLiveRef(
        minimumValue !== null && minimumValue !== undefined && !isNaN(minimumValue) ? minimumValue : 0
    );
    const maximumValueRef = useLiveRef(
        maximumValue !== null && maximumValue !== undefined && !isNaN(maximumValue) ? maximumValue : 100
    );
    const valueRef = useLiveRef(
        value !== null && value !== undefined && !isNaN(value) ?
            Math.min(maximumValueRef.current, Math.max(minimumValueRef.current, value))
            :
            0
    );
    const bufferedRef = useLiveRef(
        buffered !== null && buffered !== undefined && !isNaN(buffered) ?
            Math.min(maximumValueRef.current, Math.max(minimumValueRef.current, buffered))
            :
            0
    );
    const onSlideRef = useLiveRef(onSlide);
    const onCompleteRef = useLiveRef(onComplete);
    const onPreviewTimeChangeRef = useLiveRef(onPreviewTimeChange);
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const routeFocused = useRouteFocused();
    const [requestThumbAnimation, cancelThumbAnimation] = useAnimationFrame();
    const calculateValueForMouseX = useCallback((mouseX: number) => {
        if (sliderContainerRef.current === null) {
            return 0;
        }

        const { x: sliderX, width: sliderWidth } = sliderContainerRef.current.getBoundingClientRect();
        const thumbStart = Math.min(Math.max(mouseX - sliderX, 0), sliderWidth);
        const calculated = (thumbStart / sliderWidth) * (maximumValueRef.current - minimumValueRef.current) + minimumValueRef.current;
        return calculated;
    }, []);
    const retainThumb = useCallback(() => {
        isDraggingRef.current = true;
        window.addEventListener('blur', onBlur);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove);
        document.documentElement.className = classnames(document.documentElement.className, styles['active-slider-within']);
    }, []);
    const releaseThumb = useCallback(() => {
        cancelThumbAnimation();
        window.removeEventListener('blur', onBlur);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        isDraggingRef.current = false;
        const classList = document.documentElement.className.split(' ');
        const classIndex = classList.indexOf(styles['active-slider-within']);
        if (classIndex !== -1) {
            classList.splice(classIndex, 1);
            document.documentElement.className = classnames(classList);
        }
    }, []);
    const onBlur = useCallback(() => {
        if (typeof onSlideRef.current === 'function') {
            onSlideRef.current(valueRef.current);
        }

        if (typeof onCompleteRef.current === 'function') {
            onCompleteRef.current(valueRef.current);
        }

        releaseThumb();
        if (typeof onPreviewTimeChangeRef.current === 'function') {
            onPreviewTimeChangeRef.current(null, null, null);
        }
    }, []);
    const onMouseUp = useCallback((event: MouseEvent) => {
        const newValue = calculateValueForMouseX(event.clientX);
        if (typeof onCompleteRef.current === 'function') {
            onCompleteRef.current(newValue);
        }

        releaseThumb();
        if (typeof onPreviewTimeChangeRef.current === 'function') {
            const rect = sliderContainerRef.current?.getBoundingClientRect();
            const { clientX, clientY } = event;
            if (rect && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                onPreviewTimeChangeRef.current(calculateValueForMouseX(clientX), clientX, clientY);
            } else {
                onPreviewTimeChangeRef.current(null, null, null);
            }
        }
    }, []);
    const onMouseMove = useCallback((event: MouseEvent) => {
        requestThumbAnimation(() => {
            const newValue = calculateValueForMouseX(event.clientX);
            if (typeof onSlideRef.current === 'function') {
                onSlideRef.current(newValue);
            }
            if (typeof onPreviewTimeChangeRef.current === 'function') {
                onPreviewTimeChangeRef.current(newValue, event.clientX, event.clientY);
            }
        });
    }, []);
    const onMouseDown = useCallback((event: React.MouseEvent) => {
        if (event.button !== 0) {
            return;
        }

        const newValue = calculateValueForMouseX(event.clientX);
        if (typeof onSlideRef.current === 'function') {
            onSlideRef.current(newValue);
        }

        retainThumb();
    }, []);
    const onTouchStart = useCallback((event: React.TouchEvent) => {
        const touch = event.touches[0];
        const newValue = calculateValueForMouseX(touch.clientX);
        if (typeof onSlideRef.current === 'function') {
            onSlideRef.current(newValue);
        }

        retainThumb();
        event.preventDefault();
    }, []);
    const onTouchMove = useCallback((event: TouchEvent) => {
        requestThumbAnimation(() => {
            const touch = event.touches[0];
            const newValue = calculateValueForMouseX(touch.clientX);
            if (typeof onSlideRef.current === 'function') {
                onSlideRef.current(newValue);
            }
            if (typeof onPreviewTimeChangeRef.current === 'function') {
                onPreviewTimeChangeRef.current(newValue, touch.clientX, touch.clientY);
            }
        });

        event.preventDefault();
    }, []);
    const onTouchEnd = useCallback((event: TouchEvent) => {
        const touch = event.changedTouches[0];
        const newValue = calculateValueForMouseX(touch.clientX);
        if (typeof onCompleteRef.current === 'function') {
            onCompleteRef.current(newValue);
        }

        releaseThumb();
        if (typeof onPreviewTimeChangeRef.current === 'function') {
            const rect = sliderContainerRef.current?.getBoundingClientRect();
            const clientX = touch.clientX;
            const clientY = touch.clientY;
            if (rect && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                onPreviewTimeChangeRef.current(calculateValueForMouseX(clientX), clientX, clientY);
            } else {
                onPreviewTimeChangeRef.current(null, null, null);
            }
        }
    }, []);
    const onContainerHoverMove = useCallback((clientX: number, clientY: number) => {
        if (disabled || isDraggingRef.current) {
            return;
        }

        const newValue = calculateValueForMouseX(clientX);
        if (typeof onPreviewTimeChangeRef.current === 'function') {
            onPreviewTimeChangeRef.current(newValue, clientX, clientY);
        }
    }, [disabled, calculateValueForMouseX]);
    const onContainerMouseMove = useCallback((event: React.MouseEvent) => {
        onContainerHoverMove(event.clientX, event.clientY);
    }, [onContainerHoverMove]);
    const onContainerPointerMove = useCallback((event: React.PointerEvent) => {
        if (event.pointerType === 'touch') {
            return;
        }

        onContainerHoverMove(event.clientX, event.clientY);
    }, [onContainerHoverMove]);
    const pointerHoverForPreview = typeof window !== 'undefined' && typeof window.PointerEvent === 'function';
    const onContainerMouseLeave = useCallback(() => {
        if (isDraggingRef.current) {
            return;
        }

        if (typeof onPreviewTimeChangeRef.current === 'function') {
            onPreviewTimeChangeRef.current(null, null, null);
        }
    }, []);
    useLayoutEffect(() => {
        if (!routeFocused || disabled) {
            if (typeof onPreviewTimeChangeRef.current === 'function') {
                onPreviewTimeChangeRef.current(null, null, null);
            }
            releaseThumb();
        }
    }, [routeFocused, disabled]);
    useLayoutEffect(() => {
        return () => {
            releaseThumb();
        };
    }, []);
    const thumbPosition = Math.max(0, Math.min(1, (valueRef.current - minimumValueRef.current) / (maximumValueRef.current - minimumValueRef.current)));
    const bufferedPosition = Math.max(0, Math.min(1, (bufferedRef.current - minimumValueRef.current) / (maximumValueRef.current - minimumValueRef.current)));
    return (
        <div
            ref={sliderContainerRef}
            className={classnames(className, styles['slider-container'], { 'disabled': disabled })}
            onMouseDown={onMouseDown}
            onMouseMove={pointerHoverForPreview ? undefined : onContainerMouseMove}
            onPointerMove={pointerHoverForPreview ? onContainerPointerMove : undefined}
            onMouseLeave={onContainerMouseLeave}
            onTouchStart={onTouchStart}
        >
            <div className={styles['layer']}>
                <div className={classnames(styles['track'], { [styles['audio-boost']]: audioBoost })} />
            </div>
            <div className={styles['layer']}>
                <div className={styles['track-before']} style={{ width: `calc(100% * ${bufferedPosition})` }} />
            </div>
            <div className={styles['layer']}>
                <div
                    className={classnames(styles['track-after'], { [styles['audio-boost']]: audioBoost })}
                    style={{ '--mask-width': `calc(${thumbPosition.toFixed(3)} * 100%)` } as React.CSSProperties}
                />
            </div>
            <div className={styles['layer']}>
                <div className={styles['thumb']} style={{ marginLeft: `calc(100% * ${thumbPosition.toFixed(3)})` }} />
            </div>
        </div>
    );
};

export default Slider;
