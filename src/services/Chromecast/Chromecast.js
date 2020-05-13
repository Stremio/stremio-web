// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('events');

const RECEIVER_APPLICATION_ID = '1634F54B';
const CUSTOM_MESSAGE_NAMESPACE = 'urn:x-cast:com.stremio';

let castAPIAvailable = null;
const castAPIEvents = new EventEmitter();
window['__onGCastApiAvailable'] = function(available) {
    delete window['__onGCastApiAvailable'];
    castAPIAvailable = available;
    castAPIEvents.emit('availabilityChanged');
};

function Chromecast() {
    let active = false;
    let error = null;
    let starting = false;

    const events = new EventEmitter();
    events.on('error', () => { });

    function onCastAPIAvailabilityChanged() {
        if (castAPIAvailable) {
            active = true;
            error = null;
        } else {
            active = false;
            error = new Error('Google Cast API not available');
        }

        starting = false;
        onStateChanged();
    }
    function onStateChanged() {
        if (active) {
            const context = cast.framework.CastContext.getInstance();
            context.setOptions({
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
                // TODO language: ''
                receiverApplicationId: RECEIVER_APPLICATION_ID,
                resumeSavedSession: false
            });
            // context.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, onCastStateChanged);
        } else if (castAPIAvailable) {
            const context = cast.framework.CastContext.getInstance();
            context.setOptions({
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
                // TODO language: ''
                receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                resumeSavedSession: false
            });
            // context.removeEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, onCastStateChanged);
        }

        events.emit('stateChanged');
    }
    function start() {
        if (active || error instanceof Error || starting) {
            return;
        }

        starting = true;
        if (castAPIAvailable !== null) {
            onCastAPIAvailabilityChanged();
        } else {
            castAPIEvents.on('availabilityChanged', onCastAPIAvailabilityChanged);
        }
    }
    function stop() {
        castAPIEvents.off('availabilityChanged', onCastAPIAvailabilityChanged);
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
    function dispatch(action) {
        if (!active || !action) {
            return;
        }

        switch (action.type) {
            case 'message': {
                const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
                if (castSession) {
                    castSession.sendMessage(CUSTOM_MESSAGE_NAMESPACE, action.message);
                }

                return;
            }
        }
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

module.exports = Chromecast;
