// const EventEmitter = require('events');
const { default: init, ContainerService } = require('stremio-core-web');

// Slightly better event handling
class EventEmitter {
    constructor() {
        this._handlers = {};
    }
    _handlersFor(event) {
        return this._handlers[event] || [];
    }
    on(event, handler) {
        this._handlers[event] = this._handlersFor(event).concat(handler);
    }
    off(event, handler) {
        console.log('Before off', this._handlersFor(event))
        this._handlers[event] = this._handlersFor(event).filter(event => event !== handler);
        console.log('After off', this._handlersFor(event))
    }
    emit(event, args) {
        this._handlersFor(event).forEach(handler => {
            try {
                handler(args);
            }
            catch (e) {
                console.log('Event error', event, args, e);
            }
        });
    }
}

function Core() {
    let active = false;
    let error = null;
    let starting = false;
    let containerService = null;
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
                    containerService = new ContainerService(({ name, args } = {}) => {
                        if (active) {
                            events.emit(name, args);
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
        containerService = null;
        onStateChanged();
    }
    function on(name, listener) {
        events.on(name, listener);
    }
    function off(name, listener) {
        events.off(name, listener);
    }
    function dispatch(args, model = 'All') {
        if (!active) {
            return;
        }

        containerService.dispatch({ model, args });
    }
    function getState() {
        if (!active) {
            return {};
        }

        return containerService.get_state();
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
};

module.exports = Core;
