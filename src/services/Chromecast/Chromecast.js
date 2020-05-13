// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('events');

const RECEIVER_APPLICATION_ID = '1634F54B';
const MESSAGE_NAMESPACE = 'urn:x-cast:com.stremio';

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
            starting = false;
        } else {
            active = false;
            error = new Error('Google Cast API not available');
            starting = false;
        }

        onStateChanged();
    }
    function onCastStateChanged() {
        events.emit(cast.framework.CastContextEventType.CAST_STATE_CHANGED);
    }
    function onMessageReceived(event) {

    }
    function onSesstionStateChanged(event) {
        switch (event.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED: {
                event.session.addMessageListener(MESSAGE_NAMESPACE, onMessageReceived);
                break;
            }
            case cast.framework.SessionState.SESSION_ENDING: {
                event.session.removeMessageListener(MESSAGE_NAMESPACE, onMessageReceived);
                break;
            }
            case cast.framework.SessionState.SESSION_START_FAILED: {
                events.emit('error', { code: event.errorCode });
                break;
            }
        }

        events.emit(cast.framework.CastContextEventType.SESSION_STATE_CHANGED);
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
            context.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, onCastStateChanged);
            context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, onSesstionStateChanged);
        } else if (castAPIAvailable) {
            const context = cast.framework.CastContext.getInstance();
            context.setOptions({
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
                // TODO language: ''
                receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                resumeSavedSession: false
            });
            context.removeEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, onCastStateChanged);
            context.removeEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, onSesstionStateChanged);
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
            onStateChanged();
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
                    castSession.sendMessage(MESSAGE_NAMESPACE, action.message);
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
        },
        castState: {
            configurable: false,
            enumerable: true,
            get: function() {
                if (!castAPIAvailable) {
                    return null;
                }

                return cast.framework.CastContext.getInstance().getCastState();
            }
        },
        castSessionState: {
            configurable: false,
            enumerable: true,
            get: function() {
                if (!castAPIAvailable) {
                    return null;
                }

                return cast.framework.CastContext.getInstance().getSessionState();
            }
        },
        castSession: {
            configurable: false,
            enumerable: true,
            get: function() {
                if (!castAPIAvailable) {
                    return null;
                }

                return cast.framework.CastContext.getInstance().getCurrentSession();
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
