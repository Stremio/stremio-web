// Copyright (C) 2017-2026 Smart code 203358507

import freeze from './freeze';
import quality from './quality';
import run from './run';

const TIMEOUT = 2000;

const arm = (button: HTMLElement, keyboard: boolean) => {
    const frame = freeze(button);
    if (frame === null) {
        return null;
    }

    let stop: (() => void) | null = () => {
        frame.observer.disconnect();
        frame.root.remove();
    };
    let committed = false;

    const cancel = () => {
        window.clearTimeout(timeout);
        stop?.();
        stop = null;
    };

    const commit = () => {
        window.clearTimeout(timeout);
        if (committed || stop === null) {
            return;
        }

        committed = true;
        try {
            stop = run(frame, quality(), keyboard, () => {
                stop = null;
            });
        } catch (_error) {
            frame.observer.disconnect();
            frame.root.remove();
            stop = null;
        }
    };

    const timeout = window.setTimeout(cancel, TIMEOUT);

    return { commit, cancel };
};

export default arm;
