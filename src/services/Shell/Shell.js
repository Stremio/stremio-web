// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('events');

function Shell() {
    let active = false;
    let error = null;
    let starting = false;

    const events = new EventEmitter();
    events.on('error', () => { });

    function onStateChanged() {
        events.emit('stateChanged');
    }
    function start() {
        if (active || error instanceof Error || starting) {
            return;
        }

        active = false;
        error = new Error('Stremio shell not available');
        starting = false;
        onStateChanged();
    }
    function stop() {
        active = false;
        error = null;
        starting = false;
        onStateChanged();
    }
    function on(name, listener) {
        events.on(name, listener);
    }
    function off(name, listener) {
        events.off(name, listener);
    }
    function dispatch() {
        if (!active) {
            return;
        }

        // TODO
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

    this.start = start;
    this.stop = stop;
    this.on = on;
    this.off = off;
    this.dispatch = dispatch;
}

module.exports = Shell;
