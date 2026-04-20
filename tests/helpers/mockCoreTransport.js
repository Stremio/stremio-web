// Copyright (C) 2017-2026 Smart code 203358507

const EventEmitter = require('eventemitter3');

/**
 * Builds a jest-friendly stand-in for @stremio/stremio-core-web's CoreTransport.
 * No WASM, no worker. Events are routed through an in-memory EventEmitter so
 * tests can emit('StateChanged', ...) and the React side will receive it.
 *
 * Override any method by passing `overrides`:
 *   mockCoreTransport({ getState: jest.fn().mockResolvedValue({ settings: {} }) })
 */
function mockCoreTransport(overrides = {}) {
    const events = new EventEmitter();

    const transport = {
        on: jest.fn((name, listener) => events.on(name, listener)),
        off: jest.fn((name, listener) => events.off(name, listener)),
        removeAllListeners: jest.fn(() => events.removeAllListeners()),
        getState: jest.fn().mockResolvedValue({}),
        getDebugState: jest.fn().mockResolvedValue({}),
        dispatch: jest.fn().mockResolvedValue(undefined),
        analytics: jest.fn().mockResolvedValue(undefined),
        decodeStream: jest.fn().mockResolvedValue({}),
        encodeStream: jest.fn().mockResolvedValue(''),
        ...overrides,
    };

    transport.__emit = (name, ...args) => events.emit(name, ...args);

    return transport;
}

module.exports = mockCoreTransport;
