// Copyright (C) 2017-2023 Smart code 203358507

const EventEmitter = require('eventemitter3');
const ShellTransport = require('./ShellTransport');

function Shell() {
    let active = false;
    let error = null;
    let starting = false;
    let transport = null;

    const events = new EventEmitter();

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

        active = false;
        starting = true;

        try {
            transport = new ShellTransport();
            active = true;
            error = null;
            starting = false;
            onStateChanged();
        } catch (e) {
            console.error(e);
            active = false;
            error = new Error('Failed to initialize shell transport', { cause: e });
            starting = false;
            onStateChanged();
            transport = null;
        }

        onStateChanged();
    };
    this.stop = function() {
        active = false;
        error = null;
        starting = false;
        onStateChanged();
    };
    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
}

module.exports = Shell;
