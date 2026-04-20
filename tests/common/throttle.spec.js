// Copyright (C) 2017-2026 Smart code 203358507

/**
 * Pins the throttle semantics that useModelState.js depends on:
 * - leading call fires immediately
 * - subsequent calls within the window coalesce to one trailing call
 * - trailing call fires once at the end of the window
 * - .cancel() prevents the trailing call
 *
 * This test should remain green whether the implementation is
 * lodash.throttle or es-toolkit's throttle (see Phase 2 swap).
 */

const { throttle } = require('es-toolkit');

describe('throttle semantics (pinned by useModelState.js)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it('fires leading call immediately', () => {
        const fn = vi.fn();
        const t = throttle(fn, 100);
        t('a');
        expect(fn).toHaveBeenCalledWith('a');
    });

    it('coalesces multiple within-window calls into one trailing call', () => {
        const fn = vi.fn();
        const t = throttle(fn, 100);
        t('a');
        t('b');
        t('c');
        expect(fn).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith('c');
    });

    it('.cancel() suppresses the pending trailing call', () => {
        const fn = vi.fn();
        const t = throttle(fn, 100);
        t('a');
        t('b');
        t.cancel();
        vi.advanceTimersByTime(500);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
