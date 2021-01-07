// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('eventemitter3');
const { default: initialize_api, initialize_runtime } = require('@stremio/stremio-core-web');
const CoreTransport = require('./CoreTransport');

let transport = null;
let apiInitialized = null;
const apiEvents = new EventEmitter();
initialize_api(require('@stremio/stremio-core-web/stremio_core_web_bg.wasm'))
    .then(() => {
        const transportEvents = new EventEmitter();
        return initialize_runtime(({ name, args }) => {
            try {
                transportEvents.emit(name, args);
            } catch (error) {
                console.error('Core', error);
            }
        }).then(() => {
            transport = new CoreTransport(transportEvents);
        });
    })
    .then(() => {
        apiInitialized = true;
        apiEvents.emit('initialized');
    })
    .catch((error) => {
        console.error('Core', error);
        apiInitialized = false;
        apiEvents.emit('initialized');
    });

function Core() {
    let active = false;
    let error = null;
    let starting = false;
    let _transport = null;

    const events = new EventEmitter();

    function onAPIInitialized() {
        if (apiInitialized) {
            active = true;
            error = null;
            starting = false;
            _transport = transport;
        } else {
            active = false;
            error = new Error('Stremio Core API initialization failed');
            starting = false;
            _transport = null;
        }

        onStateChanged();
    }
    function onStateChanged() {
        events.emit('stateChanged');
    }

    Object.defineProperties(this, {
        active: {
            configurable: false,
            enumerable: true,
            get: function() {
                return active;
            }
        },
        error: {
            configurable: false,
            enumerable: true,
            get: function() {
                return error;
            }
        },
        starting: {
            configurable: false,
            enumerable: true,
            get: function() {
                return starting;
            }
        },
        transport: {
            configurable: false,
            enumerable: true,
            get: function() {
                return _transport;
            }
        }
    });

    this.start = function() {
        if (active || error instanceof Error || starting) {
            return;
        }

        starting = true;
        if (apiInitialized !== null) {
            onAPIInitialized();
        } else {
            apiEvents.on('initialized', onAPIInitialized);
            onStateChanged();
        }
    };
    this.stop = function() {
        apiEvents.off('initialized', onAPIInitialized);
        active = false;
        error = null;
        starting = false;
        onStateChanged();
        _transport = null;
    };
    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
}

module.exports = Core;
