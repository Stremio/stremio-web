const EventEmitter = require('events');
const { default: init, StremioCoreWeb } = require('stremio-core-web');

function Core() {
    let active = false;
    let error = null;
    let starting = false;
    let stremio_core = null;
    let events = new EventEmitter();
    events.on('error', () => { });

    function onStateChanged() {
        events.emit('stateChanged');
    }
    function start() {
        if (active || error instanceof Error || starting) {
            return;
        }

        starting = true;
        init()
            .then(() => {
                if (starting) {
                    stremio_core = new StremioCoreWeb(({ name, args } = {}) => {
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
                    onStateChanged();
                }
            })
            .catch((e) => {
                error = new Error('Unable to init stremio-core-web');
                error.error = e;
                onStateChanged();
            })
            .then(() => {
                starting = false;
            });
    }
    function stop() {
        active = false;
        error = null;
        starting = false;
        stremio_core = null;
        onStateChanged();
    }
    function on(name, listener) {
        events.on(name, listener);
    }
    function off(name, listener) {
        events.off(name, listener);
    }
    function dispatch(action, model) {
        if (!active) {
            return false;
        }

        return stremio_core.dispatch(action, model);
    }
    function getState(model) {
        if (!active) {
            return null;
        }

        return stremio_core.get_state(model);
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
        }
    });

    this.start = start;
    this.stop = stop;
    this.on = on;
    this.off = off;
    this.dispatch = dispatch;
    this.getState = getState;

    Object.freeze(this);
}

module.exports = Core;
