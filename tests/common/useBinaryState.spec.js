// Copyright (C) 2017-2026 Smart code 203358507

const { renderHook, act } = require('@testing-library/react');
const useBinaryState = require('../../src/common/useBinaryState');

describe('useBinaryState', () => {
    it('initialises to false when no argument', () => {
        const { result } = renderHook(() => useBinaryState());
        const [value] = result.current;
        expect(value).toBe(false);
    });

    it('initialises to truthy boolean', () => {
        const { result } = renderHook(() => useBinaryState(1));
        const [value] = result.current;
        expect(value).toBe(true);
    });

    it('on() sets to true, off() sets to false, toggle() flips', () => {
        const { result } = renderHook(() => useBinaryState(false));

        act(() => {
            const [, on] = result.current;
            on();
        });
        expect(result.current[0]).toBe(true);

        act(() => {
            const [, , off] = result.current;
            off();
        });
        expect(result.current[0]).toBe(false);

        act(() => {
            const [, , , toggle] = result.current;
            toggle();
        });
        expect(result.current[0]).toBe(true);

        act(() => {
            const [, , , toggle] = result.current;
            toggle();
        });
        expect(result.current[0]).toBe(false);
    });

    it('callbacks are stable across renders until value changes', () => {
        const { result, rerender } = renderHook(() => useBinaryState(false));
        const [, on1, off1, toggle1] = result.current;

        rerender();
        const [, on2, off2, toggle2] = result.current;

        expect(on1).toBe(on2);
        expect(off1).toBe(off2);
        expect(toggle1).toBe(toggle2);
    });
});
