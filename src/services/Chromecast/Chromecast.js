// Copyright (C) 2017-2023 Smart code 203358507

const EventEmitter = require('eventemitter3');
const ChromecastTransport = require('./ChromecastTransport');

function Chromecast() {
    let active = false;
    let error = null;
    let starting = false;
    let transport = null;

    const events = new EventEmitter();

    function onTransportInit() {
        active = true;
        error = null;
        starting = false;
        onStateChanged();
    }
    function onTransportInitError(args) {
        console.error(args);
        active = false;
        error = new Error('Google Cast API not available', { cause: args });
        starting = false;
        onStateChanged();
        transport = null;
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
        transport = new ChromecastTransport();
        transport.on('init', onTransportInit);
        transport.on('init-error', onTransportInitError);
        onStateChanged();
    };
    this.stop = function() {
        active = false;
        error = null;
        starting = false;
        onStateChanged();
        if (transport !== null) {
            transport.removeAllListeners();
            transport = null;
        }
    };
    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
}

module.exports = Chromecast;
