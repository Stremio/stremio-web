// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('eventemitter3');

function Shell() {
    let active = false;
    let error = null;
    let starting = false;

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
        }
    });

    this.start = function() {
        if (active || error instanceof Error || starting) {
            return;
        }

        active = false;
        error = new Error('Stremio Shell API not available');
        starting = false;
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
