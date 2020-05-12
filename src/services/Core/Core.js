// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('events');
const { default: initialize, StremioCoreWeb } = require('@stremio/stremio-core-web');

function Core() {
    let active = false;
    let error = null;
    let starting = false;
    let core = null;

    const events = new EventEmitter();
    events.on('error', () => { });

    function onStateChanged() {
        events.emit('stateChanged');
    }
    function start() {
        if (active || error instanceof Error || starting) {
            return;
        }

        starting = true;
        initialize().then(() => {
            if (starting) {
                core = new StremioCoreWeb(({ name, args } = {}) => {
                    if (active) {
                        try {
                            events.emit(name, args);
                        } catch (e) {
                            /* eslint-disable-next-line no-console */
                            console.error(e);
                        }
                    }
                });
                active = true;
                error = null;
                starting = false;
                onStateChanged();
            }
        }).catch((error) => {
            core = null;
            active = false;
            error = new Error('Unable to init stremio-core-web');
            error.error = error;
            starting = false;
            onStateChanged();
        });
    }
    function stop() {
        core = null;
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
    function dispatch(action, model) {
        if (!active || typeof action === 'undefined') {
            return false;
        }

        return core.dispatch(action, model);
    }
    function getState(model) {
        if (!active) {
            return null;
        }

        return core.get_state(model);
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
    this.getState = getState;
}

module.exports = Core;
