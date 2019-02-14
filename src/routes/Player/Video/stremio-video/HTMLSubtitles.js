var EventEmitter = require('events');
var subtitleUtils = require('./utils/subtitles');

var HTMLSubtitles = function(containerElement) {
    if (!(containerElement instanceof HTMLElement)) {
        throw new Error('Instance of HTMLElement required as a first argument to HTMLSubtitles');
    }

    var events = new EventEmitter();
    var tracks = Object.freeze([]);
    var cues = Object.freeze({});
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

    Object.defineProperty(this, 'tracks', {
        configurable: false,
        enumerable: true,
        get: function() { return Object.freeze(tracks.slice()); }
    });

    Object.defineProperty(this, 'selectedTrackId', {
        configurable: false,
        enumerable: true,
        get: function() { return selectedTrackId; },
        set: function(nextSelectedTrackId) {
            cues = Object.freeze({});
            selectedTrackId = null;
            delay = 0;
            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                if (track.id === nextSelectedTrackId) {
                    selectedTrackId = track.id;
                    fetch(track.url)
                        .then(function(resp) {
                            return resp.text();
                        })
                        .catch(function() {
                            events.emit('error', Object.freeze({
                                code: 70,
                                track: track
                            }));
                        })
                        .then(function(text) {
                            if (typeof text === 'string' && selectedTrackId === track.id) {
                                cues = subtitleUtils.parse(text);
                                events.emit('load', Object.freeze({
                                    track: track
                                }));
                            }
                        })
                        .catch(function() {
                            events.emit('error', Object.freeze({
                                code: 71,
                                track: track
                            }));
                        });
                    break;
                }
            }
        }
    });

    Object.defineProperty(this, 'delay', {
        configurable: false,
        enumerable: true,
        get: function() { return delay; },
        set: function(nextDelay) {
            if (!isNaN(nextDelay)) {
                delay = parseFloat(nextDelay);
            }
        }
    });

    Object.defineProperty(this, 'size', {
        configurable: false,
        enumerable: true,
        get: function() { return parseFloat(stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize); },
        set: function(nextSize) {
            if (!isNaN(nextSize)) {
                stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize = parseFloat(nextSize) + 'pt';
            }
        }
    });

    Object.defineProperty(this, 'darkBackground', {
        configurable: false,
        enumerable: true,
        get: function() { return subtitlesElement.classList.contains('dark-background'); },
        set: function(nextDarkBackground) {
            if (!!nextDarkBackground) {
                subtitlesElement.classList.add('dark-background');
            } else {
                subtitlesElement.classList.remove('dark-background');
            }
        }
    });

    this.addListener = function(eventName, listener) {
        events.addListener(eventName, listener);
    };

    this.removeListener = function(eventName, listener) {
        events.removeListener(eventName, listener);
    };

    this.addTracks = function(extraTracks) {
        tracks = (Array.isArray(extraTracks) ? extraTracks : [])
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
    };

    this.updateTextForTime = function(mediaTime) {
        while (subtitlesElement.hasChildNodes()) {
            subtitlesElement.removeChild(subtitlesElement.lastChild);
        }

        if (isNaN(mediaTime) || !Array.isArray(cues.times)) {
            return;
        }

        var time = mediaTime + delay;
        var cuesForTime = subtitleUtils.cuesForTime(cues, time);
        for (var i = 0; i < cuesForTime.length; i++) {
            var cueNode = subtitleUtils.render(cuesForTime[i]);
            cueNode.classList.add('cue');
            subtitlesElement.append(cueNode, document.createElement('br'));
        }
    };

    this.clearTracks = function() {
        tracks = Object.freeze([]);
        cues = Object.freeze({});
        selectedTrackId = null;
        delay = 0;
    };

    this.detachElements = function() {
        containerElement.removeChild(stylesElement);
        containerElement.removeChild(subtitlesElement);
    };

    Object.freeze(this);
};

module.exports = HTMLSubtitles;
