// Copyright (C) 2017-2026 Smart code 203358507

import { renderHook, act } from '@testing-library/react';
import useTimeout from '../../src/common/useTimeout';

describe('useTimeout', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it('start() fires the callback once after <duration>ms', () => {
        const { result } = renderHook(() => useTimeout(1000));
        const cb = vi.fn();

        act(() => result.current.start(cb));

        act(() => { vi.advanceTimersByTime(999); });
        expect(cb).not.toHaveBeenCalled();

        act(() => { vi.advanceTimersByTime(1); });
        expect(cb).toHaveBeenCalledTimes(1);

        act(() => { vi.advanceTimersByTime(5000); });
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('cancel() prevents a pending timeout from firing', () => {
        const { result } = renderHook(() => useTimeout(500));
        const cb = vi.fn();

        act(() => result.current.start(cb));
        act(() => result.current.cancel());
        act(() => { vi.advanceTimersByTime(1000); });

        expect(cb).not.toHaveBeenCalled();
    });

    it('start() called twice cancels the first pending timeout', () => {
        const { result } = renderHook(() => useTimeout(500));
        const first = vi.fn();
        const second = vi.fn();

        act(() => result.current.start(first));
        act(() => { vi.advanceTimersByTime(100); });
        act(() => result.current.start(second));
        act(() => { vi.advanceTimersByTime(500); });

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('unmounting cancels any pending timeout', () => {
        const { result, unmount } = renderHook(() => useTimeout(300));
        const cb = vi.fn();
        act(() => result.current.start(cb));

        unmount();
        act(() => { vi.advanceTimersByTime(1000); });
        expect(cb).not.toHaveBeenCalled();
    });
});
