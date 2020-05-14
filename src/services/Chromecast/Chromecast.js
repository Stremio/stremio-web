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

const CAST_ERROR = {
    CANCEL: {
        code: 1,
        message: 'The operation was canceled by the user'
    },
    TIMEOUT: {
        code: 2,
        message: 'The operation timed out'
    },
    API_NOT_INITIALIZED: {
        code: 3,
        message: 'The API is not initialized'
    },
    INVALID_PARAMETER: {
        code: 4,
        message: 'The parameters to the operation were not valid'
    },
    EXTENSION_NOT_COMPATIBLE: {
        code: 5,
        message: 'The API script is not compatible with the installed Cast extension'
    },
    EXTENSION_MISSING: {
        code: 6,
        message: 'The Cast extension is not available'
    },
    RECEIVER_UNAVAILABLE: {
        code: 7,
        message: 'No receiver was compatible with the session request'
    },
    SESSION_ERROR: {
        code: 8,
        message: 'A session could not be created, or a session was invalid'
    },
    CHANNEL_ERROR: {
        code: 9,
        message: 'A channel to the receiver is not available'
    },
    LOAD_MEDIA_FAILED: {
        code: 10,
        message: 'Load media failed'
    },
    INVALID_MESSAGE: {
        code: 11,
        message: 'Invalid message received'
    },
    UNKNOWN: {
        code: 100,
        message: 'Unknown error'
    }
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
    function onCastStateChanged(event) {
        events.emit(cast.framework.CastContextEventType.CAST_STATE_CHANGED, event);
    }
    function onCastError(code) {
        switch (code) {
            case chrome.cast.ErrorCode.CANCEL: {
                events.emit('error', CAST_ERROR.CANCEL);
                break;
            }
            case chrome.cast.ErrorCode.TIMEOUT: {
                events.emit('error', CAST_ERROR.TIMEOUT);
                break;
            }
            case chrome.cast.ErrorCode.API_NOT_INITIALIZED: {
                events.emit('error', CAST_ERROR.API_NOT_INITIALIZED);
                break;
            }
            case chrome.cast.ErrorCode.INVALID_PARAMETER: {
                events.emit('error', CAST_ERROR.INVALID_PARAMETER);
                break;
            }
            case chrome.cast.ErrorCode.EXTENSION_NOT_COMPATIBLE: {
                events.emit('error', CAST_ERROR.EXTENSION_NOT_COMPATIBLE);
                break;
            }
            case chrome.cast.ErrorCode.EXTENSION_MISSING: {
                events.emit('error', CAST_ERROR.EXTENSION_MISSING);
                break;
            }
            case chrome.cast.ErrorCode.RECEIVER_UNAVAILABLE: {
                events.emit('error', CAST_ERROR.RECEIVER_UNAVAILABLE);
                break;
            }
            case chrome.cast.ErrorCode.SESSION_ERROR: {
                events.emit('error', CAST_ERROR.SESSION_ERROR);
                break;
            }
            case chrome.cast.ErrorCode.CHANNEL_ERROR: {
                events.emit('error', CAST_ERROR.CHANNEL_ERROR);
                break;
            }
            case chrome.cast.ErrorCode.LOAD_MEDIA_FAILED: {
                events.emit('error', CAST_ERROR.LOAD_MEDIA_FAILED);
                break;
            }
            default: {
                events.emit('error', {
                    ...CAST_ERROR.UNKNOWN,
                    error: { code }
                });
            }
        }
    }
    function onMessageReceived(_, message) {
        try {
            events.emit('message', JSON.parse(message));
        } catch (error) {
            events.emit('error', {
                ...CAST_ERROR.INVALID_MESSAGE,
                error
            });
        }
    }
    function onApplicationStatusChanged(event) {
        events.emit(cast.framework.CastSession.APPLICATION_STATUS_CHANGED, event);
    }
    function onApplicationMetadataChanged(event) {
        events.emit(cast.framework.CastSession.APPLICATION_METADATA_CHANGED, event);
    }
    function onActiveInputStateChanged(event) {
        events.emit(cast.framework.CastSession.ACTIVE_INPUT_STATE_CHANGED, event);
    }
    function onVolumeChanged(event) {
        events.emit(cast.framework.CastSession.VOLUME_CHANGED, event);
    }
    function onMediaSessionChanged(event) {
        events.emit(cast.framework.CastSession.MEDIA_SESSION, event);
    }
    function onSesstionStateChanged(event) {
        events.emit(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, event);
        switch (event.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED: {
                event.session.addMessageListener(MESSAGE_NAMESPACE, onMessageReceived);
                event.session.addEventListener(cast.framework.CastSession.APPLICATION_STATUS_CHANGED, onApplicationStatusChanged);
                event.session.addEventListener(cast.framework.CastSession.APPLICATION_METADATA_CHANGED, onApplicationMetadataChanged);
                event.session.addEventListener(cast.framework.CastSession.ACTIVE_INPUT_STATE_CHANGED, onActiveInputStateChanged);
                event.session.addEventListener(cast.framework.CastSession.VOLUME_CHANGED, onVolumeChanged);
                event.session.addEventListener(cast.framework.CastSession.MEDIA_SESSION, onMediaSessionChanged);
                break;
            }
            case cast.framework.SessionState.SESSION_ENDING: {
                event.session.removeMessageListener(MESSAGE_NAMESPACE, onMessageReceived);
                event.session.removeEventListener(cast.framework.CastSession.APPLICATION_STATUS_CHANGED, onApplicationStatusChanged);
                event.session.removeEventListener(cast.framework.CastSession.APPLICATION_METADATA_CHANGED, onApplicationMetadataChanged);
                event.session.removeEventListener(cast.framework.CastSession.ACTIVE_INPUT_STATE_CHANGED, onActiveInputStateChanged);
                event.session.removeEventListener(cast.framework.CastSession.VOLUME_CHANGED, onVolumeChanged);
                event.session.removeEventListener(cast.framework.CastSession.MEDIA_SESSION, onMediaSessionChanged);
                break;
            }
            case cast.framework.SessionState.SESSION_START_FAILED: {
                onCastError(event.errorCode);
                break;
            }
        }
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
