// Copyright (C) 2017-2026 Smart code 203358507

/**
 * Pins the deep-equality semantics used in useModelState, Router,
 * SearchParamsHandler, and useStreamingOptions. All call sites diff
 * plain-JSON state objects returned by Stremio Core — no cyclic refs,
 * no Maps/Sets.
 *
 * This test should remain green whether the implementation is
 * fast-equals's deepEqual or es-toolkit's isEqual.
 */

const { isEqual } = require('es-toolkit');

describe('isEqual semantics (pinned by useModelState / Router / …)', () => {
    it('returns true for structurally equal plain objects', () => {
        expect(isEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })).toBe(true);
    });

    it('returns false when a leaf primitive differs', () => {
        expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('recurses into nested arrays and objects', () => {
        const a = { items: [{ id: 'x', meta: { year: 2024 } }] };
        const b = { items: [{ id: 'x', meta: { year: 2024 } }] };
        expect(isEqual(a, b)).toBe(true);
        const c = { items: [{ id: 'x', meta: { year: 2025 } }] };
        expect(isEqual(a, c)).toBe(false);
    });

    it('distinguishes null from undefined from missing keys', () => {
        expect(isEqual({ a: null }, { a: undefined })).toBe(false);
        expect(isEqual({ a: undefined }, {})).toBe(false);
    });

    it('treats array order as significant', () => {
        expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });
});
