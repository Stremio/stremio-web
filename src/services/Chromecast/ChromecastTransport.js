// Copyright (C) 2017-2023 Smart code 203358507

const EventEmitter = require('eventemitter3');
const hat = require('hat');
const ShellChromecastTransport = require('./ShellChromecastTransport');

// When running inside the desktop shell (WebView2), Google CAF never works
// because Microsoft does not ship Chromium's Cast Sender Media Router with
// WebView2. Detect the shell environment and swap the transport for one that
// bridges directly to the streaming server's /casting/ HTTP API. Browser
// users are unaffected and continue to use the CAF transport below.
const inShell = (typeof window !== 'undefined') &&
    !!window.qt && !!window.qt.webChannelTransport;

if (inShell) {
    // Stub the cast.framework / chrome.cast constants the rest of the
    // codebase reads (Player.js compares getCastState() against
    // cast.framework.CastState.CONNECTED). Values match the real Google CAF
    // wire values, so subscriptions still line up if the actual cast_sender.js
    // happens to load and overwrite these stubs.
    window.cast = window.cast || {};
    window.cast.framework = window.cast.framework || {};
    window.cast.framework.CastState = window.cast.framework.CastState || {
        NO_DEVICES_AVAILABLE: 'NO_DEVICES_AVAILABLE',
        NOT_CONNECTED: 'NOT_CONNECTED',
        CONNECTING: 'CONNECTING',
        CONNECTED: 'CONNECTED',
    };
    window.cast.framework.SessionState = window.cast.framework.SessionState || {
        NO_SESSION: 'NO_SESSION',
        SESSION_STARTED: 'SESSION_STARTED',
        SESSION_STARTING: 'SESSION_STARTING',
        SESSION_START_FAILED: 'SESSION_START_FAILED',
        SESSION_ENDED: 'SESSION_ENDED',
        SESSION_ENDING: 'SESSION_ENDING',
        SESSION_RESUMED: 'SESSION_RESUMED',
    };
    window.cast.framework.CastContextEventType = window.cast.framework.CastContextEventType || {
        CAST_STATE_CHANGED: 'caststatechanged',
        SESSION_STATE_CHANGED: 'sessionstatechanged',
    };
    window.cast.framework.CastSession = window.cast.framework.CastSession || {
        APPLICATION_STATUS_CHANGED: 'applicationstatuschanged',
        APPLICATION_METADATA_CHANGED: 'applicationmetadatachanged',
        ACTIVE_INPUT_STATE_CHANGED: 'activeinputstatechanged',
        VOLUME_CHANGED: 'volumechanged',
        MEDIA_SESSION: 'mediasession',
    };
    window.chrome = window.chrome || {};
    window.chrome.cast = window.chrome.cast || {};
    window.chrome.cast.AutoJoinPolicy = window.chrome.cast.AutoJoinPolicy || {
        TAB_AND_ORIGIN_SCOPED: 'tab_and_origin_scoped',
        ORIGIN_SCOPED: 'origin_scoped',
        PAGE_SCOPED: 'page_scoped',
    };
}

const MESSAGE_NAMESPACE = 'urn:x-cast:com.stremio';
const CHUNK_SIZE = 20000;

let castAPIAvailable = null;
const castAPIEvents = new EventEmitter();
window['__onGCastApiAvailable'] = function(available) {
    delete window['__onGCastApiAvailable'];
    castAPIAvailable = !!available;
    castAPIEvents.emit('availabilityChanged');
};

const initialize = () => {
    return new Promise((resolve, reject) => {
        function onCastAPIAvailabilityChanged() {
            castAPIEvents.off('availabilityChanged', onCastAPIAvailabilityChanged);
            if (castAPIAvailable) {
                resolve();
            } else {
                reject(new Error('window.cast api not available', { cause: 'castAPIAvailable is null.' }));
            }
        }
        if (castAPIAvailable !== null) {
            onCastAPIAvailabilityChanged();
        } else {
            castAPIEvents.on('availabilityChanged', onCastAPIAvailabilityChanged);
        }
    });
};

function ChromecastTransport() {
    const events = new EventEmitter();
    const messages = {};

    initialize()
        .then(() => {
            cast.framework.CastContext.getInstance().addEventListener(
                cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                onCastStateChanged
            );
            cast.framework.CastContext.getInstance().addEventListener(
                cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
                onSesstionStateChanged
            );
        })
        .then(() => {
            try {
                events.emit('init');
            } catch (error) {
                console.error('ChromecastTransport', error);
            }
        })
        .catch((error) => {
            events.emit('init-error', error);
        });

    function onMessage(_, message) {
        try {
            const { id, chunk, index, length } = JSON.parse(message);
            messages[id] = messages[id] || [];
            messages[id][index] = chunk;
            if (Object.keys(messages[id]).length === length) {
                const parsedMessage = JSON.parse(messages[id].join(''));
                delete messages[id];
                events.emit('message', parsedMessage);
            }
        } catch (error) {
            events.emit('message-error', error);
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
    this.removeAllListeners = function() {
        events.removeAllListeners();
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
            const serializedMessage = JSON.stringify(message);
            const chunksCount = Math.ceil(serializedMessage.length / CHUNK_SIZE);
            const chunks = [];
            for (let i = 0; i < chunksCount; i++) {
                const start = i * CHUNK_SIZE;
                const chunk = serializedMessage.slice(start, start + CHUNK_SIZE);
                chunks.push(chunk);
            }
            const id = hat();
            return Promise.all(chunks.map((chunk, index) => {
                return castSession.sendMessage(MESSAGE_NAMESPACE, {
                    id,
                    chunk,
                    index,
                    length: chunks.length
                });
            }));
        } else {
            return Promise.reject(new Error('Session not started', { cause: 'castSession is null.' }));
        }
    };
}

module.exports = inShell ? ShellChromecastTransport : ChromecastTransport;
