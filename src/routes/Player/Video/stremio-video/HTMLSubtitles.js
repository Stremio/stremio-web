var EventEmitter = require('events');
var subtitlesParser = require('./subtitlesParser');
var subtitlesRenderer = require('./subtitlesRenderer');

var FONT_SIZE = Object.freeze({
    1: '3vmin',
    2: '4vmin',
    3: '5vmin',
    4: '8vmin',
    5: '10vmin'
});

function HTMLSubtitles(containerElement) {
    if (!(containerElement instanceof HTMLElement) || !containerElement.hasAttribute('id')) {
        throw new Error('Instance of HTMLElement with id attribute required as a first argument');
    }

    var self = this;
    var destroyed = false;
    var events = new EventEmitter();
    var cuesByTime = null;
    var tracks = Object.freeze([]);
    var selectedTrackId = null;
    var delay = null;
    var stylesElement = document.createElement('style');
    var subtitlesElement = document.createElement('div');

    containerElement.appendChild(stylesElement);
    var subtitleStylesIndex = stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles { position: absolute; right: 0; bottom: 0; left: 0; z-index: 0; font-size: ' + FONT_SIZE[2] + '; color: white; text-align: center; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles .cue { display: inline-block; padding: 0.2em; text-shadow: 0px 0px 0.03em #222222, 0px 0px 0.03em #222222, 0px 0px 0.03em #222222, 0px 0px 0.03em #222222, 0px 0px 0.03em #222222; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles.dark-background .cue { text-shadow: none; background-color: #222222; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(subtitlesElement);
    subtitlesElement.classList.add('subtitles');
    events.addListener('error', function() { });

    this.on = function(eventName, listener) {
        if (destroyed) {
            throw new Error('Unable to add ' + eventName + ' listener');
        }

        events.addListener(eventName, listener);
    };

    this.dispatch = function() {
        if (destroyed) {
            throw new Error('Unable to dispatch ' + Array.from(arguments).map(String));
        }

        switch (arguments[0]) {
            case 'getProp': {
                switch (arguments[1]) {
                    case 'tracks': {
                        return Object.freeze(tracks.slice());
                    }
                    case 'selectedTrackId': {
                        return selectedTrackId;
                    }
                    case 'delay': {
                        return delay;
                    }
                    case 'size': {
                        return parseInt(Object.keys(FONT_SIZE).find(function(size) {
                            return FONT_SIZE[size] === stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize;
                        }));
                    }
                    case 'darkBackground': {
                        return subtitlesElement.classList.contains('dark-background');
                    }
                    default: {
                        throw new Error('getProp not supported: ' + arguments[1]);
                    }
                }
            }
            case 'setProp': {
                switch (arguments[1]) {
                    case 'selectedTrackId': {
                        cuesByTime = null;
                        selectedTrackId = null;
                        delay = null;
                        for (var i = 0; i < tracks.length; i++) {
                            if (tracks[i].id === arguments[2]) {
                                selectedTrackId = tracks[i].id;
                                delay = 0;
                                fetch(tracks[i].url)
                                    .then(function(resp) {
                                        return resp.text();
                                    })
                                    .catch(function() {
                                        events.emit('error', Object.freeze({
                                            code: HTMLSubtitles.ERROR.SUBTITLES_FETCH_FAILED,
                                            track: tracks[i]
                                        }));
                                    })
                                    .then(function(text) {
                                        if (typeof text === 'string' && selectedTrackId === tracks[i].id) {
                                            cuesByTime = subtitlesParser.parse(text);
                                            events.emit('load', Object.freeze({
                                                track: tracks[i]
                                            }));
                                        }
                                    })
                                    .catch(function() {
                                        events.emit('error', Object.freeze({
                                            code: HTMLSubtitles.ERROR.SUBTITLES_PARSE_FAILED,
                                            track: tracks[i]
                                        }));
                                    });
                                break;
                            }
                        }

                        return;
                    }
                    case 'delay': {
                        if (!isNaN(arguments[2]) && arguments[2] !== null && selectedTrackId !== null) {
                            delay = parseInt(arguments[2]);
                        }

                        return;
                    }
                    case 'size': {
                        if (!isNaN(arguments[2]) && arguments[2] !== null) {
                            stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize = FONT_SIZE[Math.max(1, Math.min(5, Math.floor(arguments[2])))];
                        }

                        return;
                    }
                    case 'darkBackground': {
                        if (arguments[2]) {
                            subtitlesElement.classList.add('dark-background');
                        } else {
                            subtitlesElement.classList.remove('dark-background');
                        }

                        return;
                    }
                    default: {
                        throw new Error('setProp not supported: ' + arguments[1]);
                    }
                }
            }
            case 'command': {
                switch (arguments[1]) {
                    case 'addTracks': {
                        tracks = (Array.isArray(arguments[2]) ? arguments[2] : [])
                            .filter(function(track) {
                                return track &&
                                    typeof track.url === 'string' &&
                                    track.url.length > 0 &&
                                    typeof track.origin === 'string' &&
                                    track.origin.length > 0 &&
                                    track.origin !== 'EMBEDDED';
                            })
                            .map(function(track) {
                                return Object.freeze(Object.assign({}, track, {
                                    id: track.url
                                }));
                            })
                            .concat(tracks)
                            .filter(function(track, index, tracks) {
                                for (var i = 0; i < tracks.length; i++) {
                                    if (tracks[i].id === track.id) {
                                        return i === index;
                                    }
                                }

                                return false;
                            });
                        Object.freeze(tracks);
                        return;
                    }
                    case 'clearTracks': {
                        cuesByTime = null;
                        tracks = Object.freeze([]);
                        selectedTrackId = null;
                        delay = null;
                        return;
                    }
                    case 'updateText': {
                        while (subtitlesElement.hasChildNodes()) {
                            subtitlesElement.removeChild(subtitlesElement.lastChild);
                        }

                        if (cuesByTime === null || isNaN(arguments[2]) || arguments[2] === null) {
                            return;
                        }

                        var time = arguments[2] + delay;
                        var cueNodes = subtitlesRenderer.render(cuesByTime, time);
                        for (var i = 0; i < cueNodes.length; i++) {
                            cueNodes[i].classList.add('cue');
                            subtitlesElement.append(cueNodes[i], document.createElement('br'));
                        }

                        return;
                    }
                    case 'destroy': {
                        destroyed = true;
                        events.removeAllListeners();
                        self.dispatch('command', 'clearTracks');
                        containerElement.removeChild(stylesElement);
                        containerElement.removeChild(subtitlesElement);
                        return;
                    }
                }
            }
            default: {
                throw new Error('Invalid dispatch call: ' + Array.from(arguments).map(String));
            }
        }
    };

    Object.freeze(this);
};

HTMLSubtitles.ERROR = Object.freeze({
    SUBTITLES_FETCH_FAILED: 70,
    SUBTITLES_PARSE_FAILED: 71
});

Object.freeze(HTMLSubtitles);

module.exports = HTMLSubtitles;
