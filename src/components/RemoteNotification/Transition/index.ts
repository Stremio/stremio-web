// Copyright (C) 2017-2026 Smart code 203358507

import type { Arm, Outcome } from '../useBoardTransition';
import type { Source } from './lock';
import createLock from './lock';
import freeze from './freeze';
import { warm, forget } from './paint';
import quality from './quality';
import run from './run';

const ANSWER = 2000;
const DEADLINE = 2400;

const arm: Arm = (button, { keyboard, gamepad, onEnd }) => {
    const pressed = performance.now();
    const disposers: (() => void)[] = [];
    let outcome: Outcome | null = null;
    let hurry: ((source: Source) => void) | null = null;
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

    const end = (result: Outcome) => {
        if (outcome !== null) {
            return false;
        }

        outcome = result;
        clear();
        onEnd(result);
        return true;
    };

    try {
        const stage = freeze(button, (disposer) => disposers.push(disposer));
        if (stage === null) {
            clear();
            return null;
        }

        const unlock = createLock(gamepad, (source) => hurry?.(source), (disposer) => disposers.push(disposer));
        const press = button.animate({ transform: 'scale(0.97)', filter: 'brightness(0.88)' }, { duration: 90, easing: 'ease-out', fill: 'forwards' });
        disposers.push(forget, () => press.cancel());
        warm(stage.card);
        timeout = window.setTimeout(() => end('dropped'), ANSWER);

        return {
            cancel: () => end('dropped'),
            commit: () => {
                if (outcome !== null || hurry !== null) {
                    return;
                }

                window.clearTimeout(timeout);
                timeout = window.setTimeout(() => end('revealed'), Math.max(0, DEADLINE - (performance.now() - pressed)));
                try {
                    hurry = run({
                        stage,
                        tier: quality(),
                        keyboard,
                        pressed,
                        dispose: (disposer) => disposers.push(disposer),
                        release: unlock,
                        finish: () => end('revealed'),
                    });
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
