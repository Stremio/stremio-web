// Copyright (C) 2017-2026 Smart code 203358507

type Pad = {
    lock: (prefix: string) => void,
    unlock: () => void,
};

type Source = 'pointer' | 'keys';

const SWALLOWED = ['keydown', 'keyup', 'keypress', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'auxclick', 'contextmenu', 'touchstart', 'touchmove', 'touchend', 'wheel'];
const INTENT = ['keydown', 'pointerdown', 'mousedown', 'touchstart', 'wheel'];
const PREFIX = 'board-transition';
const TILT = 0.5;
const LINGER = 2000;

const read = () => {
    const pads = Array.from(navigator.getGamepads?.() ?? []);
    return {
        pressed: pads.some((pad) => pad?.buttons.some((button) => button.pressed)),
        tilted: pads.some((pad) => pad?.axes.some((axis) => Math.abs(axis) > TILT)),
    };
};

const createLock = (gamepad: Pad | null, onInput: (source: Source) => void, dispose: (disposer: () => void) => void) => {
    const polled = typeof navigator.getGamepads === 'function';
    let timeout = 0;
    let until = Infinity;
    let held = read();

    const stop = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const swallow = (event: Event) => {
        stop(event);
        if (INTENT.includes(event.type) && !(event instanceof KeyboardEvent && event.repeat)) {
            onInput(event instanceof KeyboardEvent ? 'keys' : 'pointer');
        }
    };

    const settle = () => {
        window.clearTimeout(timeout);
        window.removeEventListener('keydown', repeat, true);
        window.removeEventListener('keyup', settle, true);
    };

    const repeat = (event: KeyboardEvent) => {
        if (event.repeat) {
            stop(event);
        } else {
            settle();
        }
    };

    const poll = () => {
        const now = read();
        if (until < Infinity) {
            if ((now.pressed || now.tilted) && performance.now() < until) {
                requestAnimationFrame(poll);
            } else {
                gamepad?.unlock();
            }

            return;
        }
        if ((now.pressed && !held.pressed) || (now.tilted && !held.tilted)) {
            onInput('keys');
        }

        held = now;
        requestAnimationFrame(poll);
    };

    const release = () => {
        if (until < Infinity) {
            return;
        }

        until = performance.now() + LINGER;
        SWALLOWED.forEach((type) => window.removeEventListener(type, swallow, true));
        window.addEventListener('keydown', repeat, true);
        window.addEventListener('keyup', settle, true);
        timeout = window.setTimeout(settle, LINGER);
        if (!polled) {
            gamepad?.unlock();
        }
    };

    dispose(release);
    SWALLOWED.forEach((type) => window.addEventListener(type, swallow, { capture: true, passive: false }));
    gamepad?.lock(PREFIX);
    if (polled) {
        requestAnimationFrame(poll);
    }

    return release;
};

export type { Pad, Source };

export default createLock;
