// Copyright (C) 2017-2026 Smart code 203358507

import type { Arm, Outcome, Prime } from '../useBoardTransition';
import type { Stage } from './freeze';
import type { Source } from './lock';
import type { Prepared } from './run';
import createLock from './lock';
import freeze from './freeze';
import { findHero } from './plan';
import quality from './quality';
import run, { prepare, fresh } from './run';

type Reveal = ReturnType<typeof run>;

const ANSWER = 1200;
const DEADLINE = 2000;
const UNMOUNT = 30;
const REST = 700;
const IDLE = 400;
const LATE = 100;
const TRIES = 3;

let primed: { button: HTMLElement, plate: Prepared | null, forget: () => void } | null = null;

const idle = (task: () => void) => {
    if (typeof window.requestIdleCallback === 'function') {
        const handle = window.requestIdleCallback(task, { timeout: IDLE });
        return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(task, 0);
    return () => window.clearTimeout(handle);
};

const prime: Prime = (button) => {
    primed?.forget();
    primed = null;
    if (button === null) {
        return;
    }

    let cancel: (() => void) | null = null;
    let faults = 0;
    const wait = () => {
        cancel?.();
        const timer = window.setTimeout(() => {
            cancel = idle(work);
        }, REST);
        cancel = () => window.clearTimeout(timer);
    };
    const work = () => {
        if (quality() !== 'sand') {
            return;
        }

        state.plate?.discard();
        try {
            state.plate = prepare(button, true);
        } catch (_error) {
            state.plate = null;
            faults++;
        }
        if (state.plate === null && faults < TRIES) {
            wait();
        }
    };
    const state = {
        button,
        plate: null as Prepared | null,
        forget: () => {
            cancel?.();
            window.removeEventListener('resize', wait);
            state.plate?.discard();
            state.plate = null;
        },
    };

    window.addEventListener('resize', wait);
    primed = state;
    wait();
};

const take = (button: HTMLElement) => {
    if (primed === null || primed.button !== button) {
        return null;
    }

    const { plate } = primed;
    const usable = plate !== null && fresh(plate, button);
    if (usable) {
        primed.plate = null;
    }

    primed.forget();
    return usable ? plate : null;
};

const arm: Arm = (button, { keyboard, gamepad, onEnd, proceed }) => {
    const pressed = performance.now();
    const disposers: (() => void)[] = [];
    let stage: Stage | null = null;
    let reveal: Reveal | null = null;
    let outcome: Outcome | null = null;
    let keys = keyboard;
    let started = false;
    let proceeded = false;
    let committed = false;
    let timeout = 0;

    const dispose = (disposer: () => void) => disposers.push(disposer);

    const clear = () => {
        window.clearTimeout(timeout);
        while (disposers.length > 0) {
            try {
                disposers.pop()?.();
            } catch (_error) {
                continue;
            }
        }
    };

    const advance = () => {
        if (!proceeded) {
            proceeded = true;
            proceed();
        }
    };

    const handOver = ({ live, modal }: Stage) => {
        let frames = 0;
        const focus = () => {
            if (modal.isConnected && frames++ < UNMOUNT) {
                requestAnimationFrame(focus);
            } else {
                findHero(live)?.watch?.focus({ preventScroll: true });
            }
        };

        requestAnimationFrame(focus);
    };

    const end = (result: Outcome) => {
        if (outcome !== null) {
            return false;
        }

        outcome = result;
        clear();
        onEnd(result);
        advance();
        if (result === 'revealed' && keys && stage !== null) {
            handOver(stage);
        }

        return true;
    };

    const onInput = (source: Source) => {
        keys = keys || source === 'keys';
    };

    let plate: Prepared | null = null;
    let unlock: (() => void) | null = null;
    try {
        const taken = take(button);
        plate = taken;
        dispose(() => taken?.discard());
        unlock = createLock(gamepad, onInput, dispose);
        const press = button.animate({ transform: 'scale(0.97)', filter: 'brightness(0.88)' }, { duration: 90, easing: 'ease-out', fill: 'forwards' });
        dispose(() => press.cancel());
    } catch (_error) {
        clear();
        return null;
    }

    const release = unlock;

    const start = () => {
        if (started || outcome !== null) {
            return;
        }

        started = true;
        try {
            const tier = quality();
            stage = freeze(button, dispose);
            if (stage === null) {
                end('dropped');
                return;
            }

            reveal = run({
                stage,
                tier,
                pressed,
                prepared: tier === 'sand' ? plate : null,
                dispose,
                release,
                finish: () => end('revealed'),
            });
            timeout = window.setTimeout(() => end('dropped'), ANSWER);
            advance();
        } catch (_error) {
            end('dropped');
        }
    };

    requestAnimationFrame(() => window.setTimeout(start, 0));
    window.setTimeout(start, LATE);

    return {
        cancel: () => end('dropped'),
        commit: () => {
            if (outcome !== null || committed) {
                return;
            }

            committed = true;
            if (reveal === null) {
                end('revealed');
                return;
            }

            window.clearTimeout(timeout);
            timeout = window.setTimeout(() => end('revealed'), Math.max(0, DEADLINE - (performance.now() - pressed)));
            try {
                reveal.commit();
            } catch (_error) {
                end('revealed');
            }
        },
    };
};

export { arm, prime };
