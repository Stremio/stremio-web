// Copyright (C) 2017-2026 Smart code 203358507

const { renderHook } = require('@testing-library/react');
const useLiveRef = require('../../src/common/useLiveRef');

describe('useLiveRef', () => {
    it('returns a ref whose .current matches the latest value', () => {
        const { result, rerender } = renderHook(({ value }) => useLiveRef(value), {
            initialProps: { value: 'first' },
        });

        expect(result.current.current).toBe('first');

        rerender({ value: 'second' });
        expect(result.current.current).toBe('second');

        rerender({ value: 42 });
        expect(result.current.current).toBe(42);
    });

    it('returns the same ref object across renders', () => {
        const { result, rerender } = renderHook(({ value }) => useLiveRef(value), {
            initialProps: { value: 1 },
        });
        const first = result.current;

        rerender({ value: 2 });
        expect(result.current).toBe(first);
    });
});
