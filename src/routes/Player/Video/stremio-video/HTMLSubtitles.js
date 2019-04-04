var EventEmitter = require('events');
var subtitlesParser = require('./subtitlesParser');
var subtitlesRenderer = require('./subtitlesRenderer');

var ERROR_CODE = Object.freeze({
    FETCH_FAILED: 70,
    PARSE_FAILED: 71
});
var FONT_SIZE = Object.freeze({
    1: '3vmin',
    2: '4vmin',
    3: '5vmin',
    4: '8vmin',
    5: '10vmin'
});

function HTMLSubtitles(options) {
    var containerElement = options && options.containerElement;
    if (!(containerElement instanceof HTMLElement) || !containerElement.hasAttribute('id')) {
        throw new Error('Instance of HTMLElement with id attribute required');
    }

    var destroyed = false;
    var events = new EventEmitter();
    var cuesByTime = null;
    var tracks = Object.freeze([]);
    var selectedTrackId = null;
    var delay = null;
    var stylesElement = document.createElement('style');
    var subtitlesElement = document.createElement('div');

    events.on('error', function() { });
    containerElement.appendChild(stylesElement);
    var subtitlesStylesIndex = stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles { position: absolute; right: 0; bottom: 0; left: 0; z-index: 0; font-size: ' + FONT_SIZE[2] + '; color: white; text-align: center; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles .cue { display: inline-block; padding: 0.2em; text-shadow: 0px 0px 0.03em #222222, 0px 0px 0.03em #222222, 0px 0px 0.03em #222222, 0px 0px 0.03em #222222, 0px 0px 0.03em #222222; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles.dark-background .cue { text-shadow: none; background-color: #222222; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(subtitlesElement);
    subtitlesElement.classList.add('subtitles');

    function getProp(propName) {
        switch (propName) {
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
                    return FONT_SIZE[size] === stylesElement.sheet.cssRules[subtitlesStylesIndex].style.fontSize;
                }));
            }
            case 'darkBackground': {
                return subtitlesElement.classList.contains('dark-background');
            }
            case 'offset': {
                return parseInt(stylesElement.sheet.cssRules[subtitlesStylesIndex].style.bottom);
            }
            default: {
                throw new Error('getProp not supported: ' + propName);
            }
        }
    }
    function setProp(propName, propValue) {
        switch (propName) {
            case 'selectedTrackId': {
                cuesByTime = null;
                selectedTrackId = null;
                delay = null;
                var selecterdTrack = tracks.find(function(track) {
                    return track.id === propValue;
                });
                if (selecterdTrack) {
                    selectedTrackId = selecterdTrack.id;
                    delay = 0;
                    fetch(selecterdTrack.url)
                        .then(function(resp) {
                            return resp.text();
                        })
                        .catch(function(error) {
                            events.emit('error', Object.freeze({
                                code: ERROR_CODE.FETCH_FAILED,
                                message: 'Failed to fetch subtitles from ' + selecterdTrack.origin,
                                track: selecterdTrack,
                                error: error
                            }));
                        })
                        .then(function(text) {
                            if (typeof text === 'string' && selectedTrackId === selecterdTrack.id) {
                                cuesByTime = subtitlesParser.parse(text);
                                events.emit('load', Object.freeze({
                                    track: selecterdTrack
                                }));
                            }
                        })
                        .catch(function(error) {
                            events.emit('error', Object.freeze({
                                code: ERROR_CODE.PARSE_FAILED,
                                message: 'Failed to parse subtitles from ' + selecterdTrack.origin,
                                track: selecterdTrack,
                                error: error
                            }));
                        });
                }

                return;
            }
            case 'delay': {
                if (!isNaN(propValue) && propValue !== null && selectedTrackId !== null) {
                    delay = parseInt(propValue);
                }

                return;
            }
            case 'size': {
                if (!isNaN(propValue) && propValue !== null) {
                    stylesElement.sheet.cssRules[subtitlesStylesIndex].style.fontSize = FONT_SIZE[Math.max(1, Math.min(5, parseInt(propValue)))];
                }

                return;
            }
            case 'darkBackground': {
                if (propValue) {
                    subtitlesElement.classList.add('dark-background');
                } else {
                    subtitlesElement.classList.remove('dark-background');
                }

                return;
            }
            case 'offset': {
                if (!isNaN(propValue) && propValue !== null) {
                    stylesElement.sheet.cssRules[subtitlesStylesIndex].style.bottom = Math.max(0, Math.min(100, parseInt(propValue))) + '%';
                }

                return;
            }
            default: {
                throw new Error('setProp not supported: ' + propName);
            }
        }
    }
    function command(commandName, commandArgs) {
        switch (commandName) {
            case 'addTracks': {
                if (!commandArgs || !Array.isArray(commandArgs.tracks)) {
                    return;
                }

                tracks = commandArgs.tracks
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

                if (cuesByTime === null || !commandArgs || isNaN(commandArgs.time) || commandArgs.time === null) {
                    return;
                }

                var time = commandArgs.time + delay;
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
                events.on('error', function() { });
                dispatch({ commandName: 'clearTracks' });
                containerElement.removeChild(stylesElement);
                containerElement.removeChild(subtitlesElement);
                return;
            }
            default: {
                throw new Error('command not supported: ' + commandName);
            }
        }
    }
    function on(eventName, listener) {
        if (destroyed) {
            throw new Error('Subtitles are destroyed');
        }

        events.on(eventName, listener);
    }
    function dispatch(args) {
        if (destroyed) {
            throw new Error('Subtitles are destroyed');
        }

        if (args) {
            if (typeof args.commandName === 'string') {
                command(args.commandName, args.commandArgs);
                return;
            } else if (typeof args.propName === 'string') {
                if (args.hasOwnProperty('propValue')) {
                    setProp(args.propName, args.propValue);
                    return;
                } else {
                    return getProp(args.propName);
                }
            }
        }

        throw new Error('Invalid dispatch call: ' + JSON.stringify(args));
    }

    this.on = on;
    this.dispatch = dispatch;

    Object.freeze(this);
};

Object.freeze(HTMLSubtitles);

module.exports = HTMLSubtitles;
