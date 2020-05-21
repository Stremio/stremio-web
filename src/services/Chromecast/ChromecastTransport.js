// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('events');

const MESSAGE_NAMESPACE = 'urn:x-cast:com.stremio';
const CAST_ERROR = {
    UNKNOWN: {
        code: 300,
        message: 'Unknown error'
    },
    CANCEL: {
        code: 301,
        message: 'The operation was canceled by the user'
    },
    TIMEOUT: {
        code: 302,
        message: 'The operation timed out'
    },
    API_NOT_INITIALIZED: {
        code: 303,
        message: 'The API is not initialized'
    },
    INVALID_PARAMETER: {
        code: 304,
        message: 'The parameters to the operation were not valid'
    },
    EXTENSION_NOT_COMPATIBLE: {
        code: 305,
        message: 'The API script is not compatible with the installed Cast extension'
    },
    EXTENSION_MISSING: {
        code: 306,
        message: 'The Cast extension is not available'
    },
    RECEIVER_UNAVAILABLE: {
        code: 307,
        message: 'No receiver was compatible with the session request'
    },
    SESSION_ERROR: {
        code: 308,
        message: 'A session could not be created, or a session was invalid'
    },
    CHANNEL_ERROR: {
        code: 309,
        message: 'A channel to the receiver is not available'
    },
    LOAD_MEDIA_FAILED: {
        code: 310,
        message: 'Load media failed'
    },
    INVALID_MESSAGE: {
        code: 350,
        message: 'Invalid message received'
    },
    INVALID_OPTIONS: {
        code: 351,
        message: 'Cannot start session before cast options are provided'
    }
};

function ChromecastTransport() {
    const events = new EventEmitter();
    events.on('error', () => { });

    cast.framework.CastContext.getInstance().addEventListener(
        cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        onCastStateChanged
    );
    cast.framework.CastContext.getInstance().addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        onSesstionStateChanged
    );

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
    function onMessage(_, message) {
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
    function onCastStateChanged(event) {
        events.emit(cast.framework.CastContextEventType.CAST_STATE_CHANGED, event);
    }
    function onSesstionStateChanged(event) {
        events.emit(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, event);
        switch (event.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED: {
                event.session.addMessageListener(MESSAGE_NAMESPACE, onMessage);
                event.session.addEventListener(cast.framework.CastSession.APPLICATION_STATUS_CHANGED, onApplicationStatusChanged);
                event.session.addEventListener(cast.framework.CastSession.APPLICATION_METADATA_CHANGED, onApplicationMetadataChanged);
                event.session.addEventListener(cast.framework.CastSession.ACTIVE_INPUT_STATE_CHANGED, onActiveInputStateChanged);
                event.session.addEventListener(cast.framework.CastSession.VOLUME_CHANGED, onVolumeChanged);
                event.session.addEventListener(cast.framework.CastSession.MEDIA_SESSION, onMediaSessionChanged);
                break;
            }
            case cast.framework.SessionState.SESSION_ENDED: {
                event.session.removeMessageListener(MESSAGE_NAMESPACE, onMessage);
                event.session.removeEventListener(cast.framework.CastSession.APPLICATION_STATUS_CHANGED, onApplicationStatusChanged);
                event.session.removeEventListener(cast.framework.CastSession.APPLICATION_METADATA_CHANGED, onApplicationMetadataChanged);
                event.session.removeEventListener(cast.framework.CastSession.ACTIVE_INPUT_STATE_CHANGED, onActiveInputStateChanged);
                event.session.removeEventListener(cast.framework.CastSession.VOLUME_CHANGED, onVolumeChanged);
                event.session.removeEventListener(cast.framework.CastSession.MEDIA_SESSION, onMediaSessionChanged);
                break;
            }
        }
    }

    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
    this.getCastState = function() {
        return cast.framework.CastContext.getInstance().getCastState();
    };
    this.getSessionState = function() {
        return cast.framework.CastContext.getInstance().getSessionState();
    };
    this.getCastDevice = function() {
        const session = cast.framework.CastContext.getInstance().getCurrentSession();
        if (session !== null) {
            return session.getCastDevice();
        }

        return null;
    };
    this.setOptions = function(options) {
        try {
            cast.framework.CastContext.getInstance().setOptions(options);
        } catch (error) {
            events.emit('error', {
                ...CAST_ERROR.INVALID_OPTIONS,
                error
            });
        }
    };
    this.requestSession = function() {
        try {
            cast.framework.CastContext.getInstance().requestSession()
                .catch((code) => {
                    onCastError(code);
                });
        } catch (error) {
            events.emit('error', {
                ...CAST_ERROR.INVALID_OPTIONS,
                error
            });
        }
    };
    this.endCurrentSession = function(stopCasting) {
        cast.framework.CastContext.getInstance().endCurrentSession(stopCasting);
    };
    this.sendMessage = function(data) {
        const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        if (castSession !== null) {
            castSession.sendMessage(MESSAGE_NAMESPACE, JSON.stringify(data))
                .catch((code) => {
                    onCastError(code);
                });
        }
    };
}

module.exports = ChromecastTransport;
