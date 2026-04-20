// Copyright (C) 2017-2026 Smart code 203358507

import { renderHook, act } from '@testing-library/react';
import useInterval from '../../src/common/useInterval';

describe('useInterval', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it('start() fires the callback every <duration>ms until cancel()', () => {
        const { result } = renderHook(() => useInterval(1000));
        const cb = jest.fn();

        act(() => result.current.start(cb));

        act(() => { jest.advanceTimersByTime(3000); });
        expect(cb).toHaveBeenCalledTimes(3);

        act(() => result.current.cancel());
        act(() => { jest.advanceTimersByTime(5000); });
        expect(cb).toHaveBeenCalledTimes(3);
    });

    it('start() replaces any previous interval with the new callback', () => {
        const { result } = renderHook(() => useInterval(500));
        const first = jest.fn();
        const second = jest.fn();

        act(() => result.current.start(first));
        act(() => { jest.advanceTimersByTime(500); });
        expect(first).toHaveBeenCalledTimes(1);

        act(() => result.current.start(second));
        act(() => { jest.advanceTimersByTime(1500); });
        expect(first).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(3);
    });

    it('unmounting cancels any running interval', () => {
        const { result, unmount } = renderHook(() => useInterval(200));
        const cb = jest.fn();
        act(() => result.current.start(cb));

        unmount();
        act(() => { jest.advanceTimersByTime(1000); });
        expect(cb).not.toHaveBeenCalled();
    });
});
