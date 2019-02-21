var EventEmitter = require('events');
var subtitleUtils = require('./utils/subtitles');

function HTMLSubtitles(containerElement) {
    if (!(containerElement instanceof HTMLElement)) {
        throw new Error('Instance of HTMLElement required as a first argument');
    }

    var self = this;
    var destroyed = false;
    var events = new EventEmitter();
    var cuesByTime = null;
    var tracks = Object.freeze([]);
    var selectedTrackId = null;
    var delay = 0;
    var stylesElement = document.createElement('style');
    var subtitlesElement = document.createElement('div');

    containerElement.appendChild(stylesElement);
    var subtitleStylesIndex = stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles { position: absolute; right: 0; bottom: 0; left: 0; z-index: 0; font-size: 26pt; color: white; text-align: center; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles .cue { display: inline-block; padding: 0.2em; text-shadow: #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles.dark-background .cue { text-shadow: none; background-color: #222222; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(subtitlesElement);
    subtitlesElement.classList.add('subtitles');

    this.addListener = function(eventName, listener) {
        if (destroyed) {
            throw new Error('Unable to add ' + eventName + ' listener');
        }

        events.addListener(eventName, listener);
    };

    this.removeListener = function(eventName, listener) {
        if (destroyed) {
            throw new Error('Unable to remove ' + eventName + ' listener');
        }

        events.removeListener(eventName, listener);
    };

    this.dispatch = function() {
        if (destroyed) {
            throw new Error('Unable to dispatch ' + arguments[0]);
        }

        switch (arguments[0]) {
            case 'getProp':
                switch (arguments[1]) {
                    case 'tracks':
                        return Object.freeze(tracks.slice());
                    case 'selectedTrackId':
                        return selectedTrackId;
                    case 'size':
                        return parseFloat(stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize);
                    case 'delay':
                        return delay;
                    case 'darkBackground':
                        return subtitlesElement.classList.contains('dark-background');
                    default:
                        throw new Error('getProp not supported: ' + arguments[1]);
                }
            case 'setProp':
                switch (arguments[1]) {
                    case 'selectedTrackId':
                        cuesByTime = null;
                        selectedTrackId = null;
                        delay = 0;
                        for (var i = 0; i < tracks.length; i++) {
                            var track = tracks[i];
                            if (track.id === arguments[2]) {
                                selectedTrackId = track.id;
                                fetch(track.url)
                                    .then(function(resp) {
                                        return resp.text();
                                    })
                                    .catch(function() {
                                        events.emit('error', Object.freeze({
                                            code: HTMLSubtitles.ERROR.SUBTITLES_FETCH_FAILED,
                                            track: track
                                        }));
                                    })
                                    .then(function(text) {
                                        if (typeof text === 'string' && selectedTrackId === track.id) {
                                            cuesByTime = subtitleUtils.parse(text);
                                            events.emit('load', Object.freeze({
                                                track: track
                                            }));
                                        }
                                    })
                                    .catch(function() {
                                        events.emit('error', Object.freeze({
                                            code: HTMLSubtitles.ERROR.SUBTITLES_PARSE_FAILED,
                                            track: track
                                        }));
                                    });
                                break;
                            }
                        }
                        return;
                    case 'size':
                        if (!isNaN(arguments[2])) {
                            stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize = parseFloat(arguments[2]) + 'pt';
                        }
                        return;
                    case 'delay':
                        if (!isNaN(arguments[2])) {
                            delay = parseFloat(arguments[2]);
                        }
                        return;
                    case 'darkBackground':
                        if (arguments[2]) {
                            subtitlesElement.classList.add('dark-background');
                        } else {
                            subtitlesElement.classList.remove('dark-background');
                        }
                        return;
                    default:
                        throw new Error('setProp not supported: ' + arguments[1]);
                }
            case 'command':
                switch (arguments[1]) {
                    case 'addTracks':
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
                    case 'clearTracks':
                        cuesByTime = null;
                        tracks = Object.freeze([]);
                        selectedTrackId = null;
                        delay = 0;
                        return;
                    case 'updateText':
                        while (subtitlesElement.hasChildNodes()) {
                            subtitlesElement.removeChild(subtitlesElement.lastChild);
                        }

                        if (isNaN(arguments[2]) || cuesByTime === null) {
                            return;
                        }

                        var time = arguments[2] + delay;
                        var cuesForTime = subtitleUtils.cuesForTime(cuesByTime, time);
                        for (var i = 0; i < cuesForTime.length; i++) {
                            var cueNode = subtitleUtils.render(cuesForTime[i].text);
                            cueNode.classList.add('cue');
                            subtitlesElement.append(cueNode, document.createElement('br'));
                        }
                        return;
                    case 'destroy':
                        destroyed = true;
                        events.removeAllListeners();
                        self.dispatch('command', 'clearTracks');
                        containerElement.removeChild(stylesElement);
                        containerElement.removeChild(subtitlesElement);
                        return;
                }
            default:
                throw new Error('Invalid dispatch call: ' + Array.from(arguments).map(String));
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
