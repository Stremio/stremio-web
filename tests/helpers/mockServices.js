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
        start: vi.fn(),
        stop: vi.fn(),
        on: (name, listener) => coreEvents.on(name, listener),
        off: (name, listener) => coreEvents.off(name, listener),
        __emit: (name, ...args) => coreEvents.emit(name, ...args),
        ...overrides.core,
    };

    return {
        core,
        shell: overrides.shell ?? { active: false, on: vi.fn(), off: vi.fn(), send: vi.fn() },
        chromecast: overrides.chromecast ?? { active: false, on: vi.fn(), off: vi.fn() },
        keyboardShortcuts: overrides.keyboardShortcuts ?? { register: vi.fn(), unregister: vi.fn() },
        dragAndDrop: overrides.dragAndDrop ?? { on: vi.fn(), off: vi.fn() },
    };
}

module.exports = mockServices;
