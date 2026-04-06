// Copyright (C) 2017-2023 Smart code 203358507

import React, { useEffect, useRef } from "react";

const HOLD_DELAY_MOUSE = 200;
const HOLD_DELAY_TOUCH = 450;
const MOVE_THRESHOLD = 10;

export default function usePlayerInteraction({
    onPlaybackSpeedChanged,
    onVideoClick,
    menusOpen,
    nextVideoPopupOpen,
    controlBarRef,
}) {
    const pressTimer = useRef(null);
    const longPress = useRef(false);
    const touchHandled = useRef(false);

    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const startHold = (delay) => {
        longPress.current = false;

        pressTimer.current = setTimeout(() => {
            longPress.current = true;
            onPlaybackSpeedChanged(2, true);
        }, delay);
    };

    const endHold = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }

        if (longPress.current) {
            onPlaybackSpeedChanged(1, true);
        }
    };

    const onMouseDown = (e) => {
        if (menusOpen || nextVideoPopupOpen) return;
        if (controlBarRef.current?.contains(e.target)) return;

        startHold(HOLD_DELAY_MOUSE);
    };

    const onMouseUp = () => {
        endHold();
    };

    const onMouseLeave = () => {
        endHold();
    };

    const onTouchStart = (e) => {
        if (menusOpen || nextVideoPopupOpen) return;
        if (controlBarRef.current?.contains(e.target)) return;

        touchHandled.current = true;

        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;

        startHold(HOLD_DELAY_TOUCH);
    };

    const onTouchMove = (e) => {
        const touch = e.touches[0];

        const dx = Math.abs(touch.clientX - touchStartX.current);
        const dy = Math.abs(touch.clientY - touchStartY.current);

        if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
            if (pressTimer.current) {
                clearTimeout(pressTimer.current);
                pressTimer.current = null;
            }
        }
    };

    const onTouchEnd = () => {
        endHold();
    };

    const onTouchCancel = () => {
        endHold();
    };

    const handleClick = (e) => {
        if (touchHandled.current) {
            touchHandled.current = false;
            return;
        }

        if (!longPress.current) {
            onVideoClick(e);
        }
    };

    useEffect(() => {
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mouseleave", onMouseLeave);

        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchcancel", onTouchCancel);

        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mouseleave", onMouseLeave);

            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchCancel);

            window.removeEventListener("click", handleClick);
        };
    }, [
        menusOpen,
        nextVideoPopupOpen,
        onPlaybackSpeedChanged,
        onVideoClick,
    ]);
}
