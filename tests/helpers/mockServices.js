// Copyright (C) 2017-2026 Smart code 203358507

const EventEmitter = require('eventemitter3');
const mockCoreTransport = require('./mockCoreTransport');

/**
 * Builds a minimal services object shaped like the real ServicesContext
 * (see src/services/ServicesContext/types.d.ts), backed by jest mocks.
 * Pass overrides to customise a specific sub-service.
 */
function mockServices(overrides = {}) {
    const coreEvents = new EventEmitter();
    const transport = overrides.core?.transport ?? mockCoreTransport();

    const core = {
        active: true,
        error: null,
        starting: false,
        transport,
        start: jest.fn(),
        stop: jest.fn(),
        on: (name, listener) => coreEvents.on(name, listener),
        off: (name, listener) => coreEvents.off(name, listener),
        __emit: (name, ...args) => coreEvents.emit(name, ...args),
        ...overrides.core,
    };

    return {
        core,
        shell: overrides.shell ?? { active: false, on: jest.fn(), off: jest.fn(), send: jest.fn() },
        chromecast: overrides.chromecast ?? { active: false, on: jest.fn(), off: jest.fn() },
        keyboardShortcuts: overrides.keyboardShortcuts ?? { register: jest.fn(), unregister: jest.fn() },
        dragAndDrop: overrides.dragAndDrop ?? { on: jest.fn(), off: jest.fn() },
    };
}

module.exports = mockServices;
