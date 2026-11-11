// Copyright (C) 2017-2026 Smart code 203358507

import type { Arm, Outcome } from '../useBoardTransition';
import type { Stage } from './freeze';
import type { Source } from './lock';
import createLock from './lock';
import freeze from './freeze';
import { findHero } from './plan';
import quality from './quality';
import run from './run';

const ANSWER = 1200;
const DEADLINE = 2000;
const UNMOUNT = 30;

const arm: Arm = (button, { keyboard, gamepad, onEnd }) => {
    const pressed = performance.now();
    const disposers: (() => void)[] = [];
    let stage: Stage | null = null;
    let outcome: Outcome | null = null;
    let hurry: ((source: Source) => void) | null = null;
    let keys = keyboard;
    let timeout = 0;

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
        if (result === 'revealed' && keys && stage !== null) {
            handOver(stage);
        }

        return true;
    };

    const onInput = (source: Source) => {
        keys = keys || source === 'keys';
        hurry?.(source);
    };

    try {
        stage = freeze(button, (disposer) => disposers.push(disposer));
        if (stage === null) {
            clear();
            return null;
        }

        const unlock = createLock(gamepad, onInput, (disposer) => disposers.push(disposer));
        const press = button.animate({ transform: 'scale(0.97)', filter: 'brightness(0.88)' }, { duration: 90, easing: 'ease-out', fill: 'forwards' });
        disposers.push(() => press.cancel());
        const reveal = run({
            stage,
            tier: quality(),
            pressed,
            dispose: (disposer) => disposers.push(disposer),
            release: unlock,
            finish: () => end('revealed'),
        });
        timeout = window.setTimeout(() => end('dropped'), ANSWER);

        return {
            cancel: () => end('dropped'),
            commit: () => {
                if (outcome !== null || hurry !== null) {
                    return;
                }

                window.clearTimeout(timeout);
                timeout = window.setTimeout(() => end('revealed'), Math.max(0, DEADLINE - (performance.now() - pressed)));
                hurry = reveal.hurry;
                try {
                    reveal.commit();
                } catch (_error) {
                    end('revealed');
                }
            },
        };
    } catch (_error) {
        clear();
        return null;
    }
};

export default arm;
