// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('eventemitter3');

const MESSAGE_NAMESPACE = 'urn:x-cast:com.stremio';

function ChromecastTransport() {
    const events = new EventEmitter();

    cast.framework.CastContext.getInstance().addEventListener(
        cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        onCastStateChanged
    );
    cast.framework.CastContext.getInstance().addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        onSesstionStateChanged
    );

    function onMessage(_, message) {
        events.emit('message', JSON.parse(message));
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
        cast.framework.CastContext.getInstance().setOptions(options);
    };
    this.requestSession = function() {
        return cast.framework.CastContext.getInstance().requestSession();
    };
    this.endCurrentSession = function(stopCasting) {
        cast.framework.CastContext.getInstance().endCurrentSession(stopCasting);
    };
    this.sendMessage = function(message) {
        const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        if (castSession !== null) {
            return castSession.sendMessage(MESSAGE_NAMESPACE, message);
        } else {
            return Promise.reject(new Error('Session not started'));
        }
    };
}

module.exports = ChromecastTransport;
