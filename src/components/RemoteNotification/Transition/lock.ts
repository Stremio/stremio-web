// Copyright (C) 2017-2026 Smart code 203358507

type Pad = {
    lock: (prefix: string) => () => void,
};

type Source = 'pointer' | 'keys';

const SWALLOWED = ['keydown', 'keyup', 'keypress', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'auxclick', 'contextmenu', 'touchstart', 'touchmove', 'touchend', 'wheel'];
const INTENT = ['keydown', 'pointerdown', 'mousedown', 'touchstart', 'wheel'];
const HOVER = ['pointerover', 'pointerout', 'mouseover', 'mouseout'];
const WAKE = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'touchstart'];
const PREFIX = 'board-transition';
const TILT = 0.5;
const CONFIRM = 0;

const read = () => {
    const pads = Array.from(navigator.getGamepads?.() ?? []);
    return {
        pressed: pads.some((pad) => pad?.buttons.some((button) => button.pressed)),
        tilted: pads.some((pad) => pad?.axes.some((axis) => Math.abs(axis) > TILT)),
        confirm: pads.some((pad) => pad?.buttons[CONFIRM]?.pressed === true),
    };
};

const stop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
};

const muteRepeats = () => {
    const settle = () => {
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

    window.addEventListener('keydown', repeat, true);
    window.addEventListener('keyup', settle, true);
};

const muteConfirm = () => {
    if (!read().confirm) {
        return;
    }

    const block = (event: MouseEvent) => {
        if (!event.isTrusted) {
            stop(event);
        }
    };
    const watch = () => {
        if (read().confirm) {
            requestAnimationFrame(watch);
        } else {
            window.removeEventListener('click', block, true);
        }
    };

    window.addEventListener('click', block, true);
    requestAnimationFrame(watch);
};

const muteHover = () => {
    let rest: { x: number, y: number } | null = null;
    const hush = (event: Event) => {
        event.stopPropagation();
        if (event instanceof MouseEvent) {
            rest = rest ?? { x: event.clientX, y: event.clientY };
        }
    };
    const wake = (event: Event) => {
        const moved = event.type === 'pointermove' && event instanceof PointerEvent ? event : null;
        if (moved !== null) {
            rest = rest ?? { x: moved.clientX, y: moved.clientY };
            if (moved.clientX === rest.x && moved.clientY === rest.y) {
                return;
            }
        }

        HOVER.forEach((type) => window.removeEventListener(type, hush, true));
        WAKE.forEach((type) => window.removeEventListener(type, wake, true));
        if (moved !== null && moved.pointerType === 'mouse' && moved.target instanceof Element) {
            moved.target.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse', clientX: moved.clientX, clientY: moved.clientY }));
        }
    };

    HOVER.forEach((type) => window.addEventListener(type, hush, true));
    WAKE.forEach((type) => window.addEventListener(type, wake, { capture: true, passive: true }));
};

const createLock = (gamepad: Pad | null, onInput: (source: Source) => void, dispose: (disposer: () => void) => void) => {
    const restore = gamepad?.lock(PREFIX);
    let locked = true;
    let held = read();

    const swallow = (event: Event) => {
        stop(event);
        if (INTENT.includes(event.type) && !(event instanceof KeyboardEvent && event.repeat)) {
            onInput(event instanceof KeyboardEvent ? 'keys' : 'pointer');
        }
    };

    const poll = () => {
        if (!locked) {
            return;
        }

        const now = read();
        if ((now.pressed && !held.pressed) || (now.tilted && !held.tilted)) {
            onInput('keys');
        }

        held = now;
        requestAnimationFrame(poll);
    };

    const release = () => {
        if (!locked) {
            return;
        }

        locked = false;
        SWALLOWED.forEach((type) => window.removeEventListener(type, swallow, true));
        restore?.();
        muteRepeats();
        muteConfirm();
        muteHover();
    };

    dispose(release);
    SWALLOWED.forEach((type) => window.addEventListener(type, swallow, { capture: true, passive: false }));
    if (typeof navigator.getGamepads === 'function') {
        requestAnimationFrame(poll);
    }

    return release;
};

export type { Pad, Source };

export default createLock;
