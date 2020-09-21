// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('events');
const { default: initializeCoreAPI } = require('@stremio/stremio-core-web');
const CoreTransport = require('./CoreTransport');

let coreAPIAvailable = null;
const coreAPIEvents = new EventEmitter();
coreAPIEvents.on('error', (error) => {
    /* eslint-disable-next-line no-console */
    console.error(error);
});
initializeCoreAPI()
    .then(() => {
        coreAPIAvailable = true;
        coreAPIEvents.emit('availabilityChanged');
    })
    .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error(error);
        coreAPIAvailable = false;
        coreAPIEvents.emit('availabilityChanged');
    });

function Core() {
    let active = false;
    let error = null;
    let starting = false;
    let transport = null;

    const events = new EventEmitter();
    events.on('error', (error) => {
        /* eslint-disable-next-line no-console */
        console.error(error);
    });

    function onCoreAPIAvailabilityChanged() {
        if (coreAPIAvailable) {
            active = true;
            error = null;
            starting = false;
            transport = new CoreTransport();
        } else {
            active = false;
            error = new Error('Stremio Core API not available');
            starting = false;
            transport = null;
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
                return transport;
            }
        }
    });

    this.start = function() {
        if (active || error instanceof Error || starting) {
            return;
        }

        starting = true;
        if (coreAPIAvailable !== null) {
            onCoreAPIAvailabilityChanged();
        } else {
            coreAPIEvents.on('availabilityChanged', onCoreAPIAvailabilityChanged);
            onStateChanged();
        }
    };
    this.stop = function() {
        coreAPIEvents.off('availabilityChanged', onCoreAPIAvailabilityChanged);
        active = false;
        error = null;
        starting = false;
        if (transport !== null) {
            transport.free();
            transport = null;
        }

        onStateChanged();
    };
    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
}

module.exports = Core;
