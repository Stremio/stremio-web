// Copyright (C) 2017-2026 Smart code 203358507

import { renderHook, act } from '@testing-library/react';
import useTimeout from '../../src/common/useTimeout';

describe('useTimeout', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it('start() fires the callback once after <duration>ms', () => {
        const { result } = renderHook(() => useTimeout(1000));
        const cb = jest.fn();

        act(() => result.current.start(cb));

        act(() => { jest.advanceTimersByTime(999); });
        expect(cb).not.toHaveBeenCalled();

        act(() => { jest.advanceTimersByTime(1); });
        expect(cb).toHaveBeenCalledTimes(1);

        act(() => { jest.advanceTimersByTime(5000); });
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('cancel() prevents a pending timeout from firing', () => {
        const { result } = renderHook(() => useTimeout(500));
        const cb = jest.fn();

        act(() => result.current.start(cb));
        act(() => result.current.cancel());
        act(() => { jest.advanceTimersByTime(1000); });

        expect(cb).not.toHaveBeenCalled();
    });

    it('start() called twice cancels the first pending timeout', () => {
        const { result } = renderHook(() => useTimeout(500));
        const first = jest.fn();
        const second = jest.fn();

        act(() => result.current.start(first));
        act(() => { jest.advanceTimersByTime(100); });
        act(() => result.current.start(second));
        act(() => { jest.advanceTimersByTime(500); });

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('unmounting cancels any pending timeout', () => {
        const { result, unmount } = renderHook(() => useTimeout(300));
        const cb = jest.fn();
        act(() => result.current.start(cb));

        unmount();
        act(() => { jest.advanceTimersByTime(1000); });
        expect(cb).not.toHaveBeenCalled();
    });
});
