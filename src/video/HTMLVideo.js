// Copyright (C) 2017-2020 Smart code 203358507

var EventEmitter = require('events');
var HTMLSubtitles = require('./HTMLSubtitles');

function HTMLVideo(options) {
    var containerElement = options && options.containerElement;
    if (!(containerElement instanceof HTMLElement) || !containerElement.hasAttribute('id')) {
        throw new Error('Instance of HTMLElement with id attribute required');
    }
    if (!document.body.contains(containerElement)) {
        throw new Error('Container element not attached to body');
    }

    var destroyed = false;
    var loaded = false;
    var events = new EventEmitter();
    var observedProps = {};
    var subtitles = new HTMLSubtitles({ containerElement: containerElement });
    var stylesElement = document.createElement('style');
    var videoElement = document.createElement('video');

    events.on('error', function() { });
    subtitles.on('propChanged', onSubtitlesPropChanged);
    subtitles.on('trackLoaded', onSubtitlesTrackLoaded);
    subtitles.on('error', onSubtitlesError);
    containerElement.appendChild(stylesElement);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .video { position: absolute; width: 100%; height: 100%; z-index: -1; background-color: black; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(videoElement);
    videoElement.classList.add('video');
    videoElement.crossOrigin = 'anonymous';
    videoElement.controls = false;
    videoElement.onpause = function() {
        onVideoPropChanged('paused');
    };
    videoElement.onplay = function() {
        onVideoPropChanged('paused');
    };
    videoElement.ontimeupdate = function() {
        onVideoPropChanged('currentTime');
    };
    videoElement.ondurationchange = function() {
        onVideoPropChanged('duration');
    };
    videoElement.onwaiting = function() {
        onVideoPropChanged('readyState');
    };
    videoElement.onplaying = function() {
        onVideoPropChanged('readyState');
    };
    videoElement.onloadeddata = function() {
        onVideoPropChanged('readyState');
    };
    videoElement.onvolumechange = function() {
        onVideoPropChanged('volume');
        onVideoPropChanged('muted');
    };
    videoElement.onended = function() {
        onVideoEnded();
    };
    videoElement.onerror = function() {
        onVideoError();
    };

    function onSubtitlesPropChanged(propName) {
        switch (propName) {
            case 'tracks': {
                if (observedProps['subtitlesTracks']) {
                    events.emit('propChanged', 'subtitlesTracks', getProp('subtitlesTracks'));
                }

                break;
            }
            case 'selectedTrackId': {
                if (observedProps['selectedSubtitlesTrackId']) {
                    events.emit('propChanged', 'selectedSubtitlesTrackId', getProp('selectedSubtitlesTrackId'));
                }

                break;
            }
            case 'delay': {
                subtitles.updateText(getProp('time'));
                if (observedProps['subtitlesDelay']) {
                    events.emit('propChanged', 'subtitlesDelay', getProp('subtitlesDelay'));
                }

                break;
            }
            case 'size': {
                if (observedProps['subtitlesSize']) {
                    events.emit('propChanged', 'subtitlesSize', getProp('subtitlesSize'));
                }

                break;
            }
            case 'offset': {
                if (observedProps['subtitlesOffset']) {
                    events.emit('propChanged', 'subtitlesOffset', getProp('subtitlesOffset'));
                }

                break;
            }
            case 'textColor': {
                if (observedProps['subtitlesTextColor']) {
                    events.emit('propChanged', 'subtitlesTextColor', getProp('subtitlesTextColor'));
                }

                break;
            }
            case 'backgroundColor': {
                if (observedProps['subtitlesBackgroundColor']) {
                    events.emit('propChanged', 'subtitlesBackgroundColor', getProp('subtitlesBackgroundColor'));
                }

                break;
            }
            case 'outlineColor': {
                if (observedProps['subtitlesOutlineColor']) {
                    events.emit('propChanged', 'subtitlesOutlineColor', getProp('subtitlesOutlineColor'));
                }

                break;
            }
        }
    }
    function onSubtitlesTrackLoaded(track) {
        subtitles.updateText(getProp('time'));
        events.emit('subtitlesTrackLoaded', track);
    }
    function onSubtitlesError(error) {
        onError(Object.assign({}, error, {
            critical: false
        }));
    }
    function onVideoPropChanged(propName) {
        switch (propName) {
            case 'paused': {
                if (observedProps['paused']) {
                    events.emit('propChanged', 'paused', getProp('paused'));
                }

                break;
            }
            case 'currentTime': {
                subtitles.updateText(getProp('time'));
                if (observedProps['time']) {
                    events.emit('propChanged', 'time', getProp('time'));
                }

                break;
            }
            case 'duration': {
                if (observedProps['duration']) {
                    events.emit('propChanged', 'duration', getProp('duration'));
                }

                break;
            }
            case 'readyState': {
                if (observedProps['buffering']) {
                    events.emit('propChanged', 'buffering', getProp('buffering'));
                }

                break;
            }
            case 'volume': {
                if (observedProps['volume']) {
                    events.emit('propChanged', 'volume', getProp('volume'));
                }

                break;
            }
            case 'muted': {
                if (observedProps['muted']) {
                    events.emit('propChanged', 'muted', getProp('muted'));
                }

                break;
            }
        }
    }
    function onVideoEnded() {
        events.emit('ended');
    }
    function onVideoError() {
        onError({
            code: videoElement.error.code,
            message: videoElement.error.message,
            critical: true
        });
    }
    function onError(error) {
        if (!error) {
            return;
        }

        Object.freeze(error);
        events.emit('error', error);
        if (error.critical) {
            command('stop');
        }
    }
    function getProp(propName) {
        switch (propName) {
            case 'paused': {
                if (!loaded) {
                    return null;
                }

                return !!videoElement.paused;
            }
            case 'time': {
                if (!loaded || isNaN(videoElement.currentTime) || videoElement.currentTime === null) {
                    return null;
                }

                return Math.floor(videoElement.currentTime * 1000);
            }
            case 'duration': {
                if (!loaded || isNaN(videoElement.duration) || videoElement.duration === null) {
                    return null;
                }

                return Math.floor(videoElement.duration * 1000);
            }
            case 'buffering': {
                if (!loaded) {
                    return null;
                }

                return videoElement.readyState < videoElement.HAVE_FUTURE_DATA;
            }
            case 'volume': {
                if (destroyed || isNaN(videoElement.volume) || videoElement.volume === null) {
                    return null;
                }

                return Math.floor(videoElement.volume * 100);
            }
            case 'muted': {
                if (destroyed) {
                    return null;
                }

                return !!videoElement.muted;
            }
            case 'subtitlesTracks': {
                return subtitles.tracks;
            }
            case 'selectedSubtitlesTrackId': {
                return subtitles.selectedTrackId;
            }
            case 'subtitlesDelay': {
                return subtitles.delay;
            }
            case 'subtitlesSize': {
                return subtitles.size;
            }
            case 'subtitlesOffset': {
                return subtitles.offset;
            }
            case 'subtitlesTextColor': {
                return subtitles.textColor;
            }
            case 'subtitlesBackgroundColor': {
                return subtitles.backgroundColor;
            }
            case 'subtitlesOutlineColor': {
                return subtitles.outlineColor;
            }
            default: {
                throw new Error('getProp not supported: ' + propName);
            }
        }
    }
    function observeProp(propName) {
        if (HTMLVideo.manifest.props.indexOf(propName) === -1) {
            throw new Error('observeProp not supported: ' + propName);
        }

        events.emit('propValue', propName, getProp(propName));
        observedProps[propName] = true;
    }
    function setProp(propName, propValue) {
        switch (propName) {
            case 'paused': {
                if (loaded) {
                    if (!!propValue) {
                        videoElement.pause();
                    } else {
                        videoElement.play();
                    }
                }

                break;
            }
            case 'time': {
                if (loaded && !isNaN(propValue) && propValue !== null) {
                    videoElement.currentTime = parseInt(propValue) / 1000;
                }

                break;
            }
            case 'volume': {
                if (!isNaN(propValue) && propValue !== null) {
                    videoElement.muted = false;
                    videoElement.volume = Math.max(0, Math.min(100, parseInt(propValue))) / 100;
                }

                break;
            }
            case 'muted': {
                videoElement.muted = !!propValue;
                break;
            }
            case 'selectedSubtitlesTrackId': {
                if (loaded) {
                    subtitles.selectedTrackId = propValue;
                }

                break;
            }
            case 'subtitlesDelay': {
                if (loaded) {
                    subtitles.delay = propValue;
                }

                break;
            }
            case 'subtitlesSize': {
                subtitles.size = propValue;
                break;
            }
            case 'subtitlesOffset': {
                subtitles.offset = propValue;
                break;
            }
            case 'subtitlesTextColor': {
                subtitles.textColor = propValue;
                break;
            }
            case 'subtitlesBackgroundColor': {
                subtitles.backgroundColor = propValue;
                break;
            }
            case 'subtitlesOutlineColor': {
                subtitles.outlineColor = propValue;
                break;
            }
            default: {
                throw new Error('setProp not supported: ' + propName);
            }
        }
    }
    function command(commandName, commandArgs) {
        switch (commandName) {
            case 'addSubtitlesTracks': {
                if (loaded && commandArgs) {
                    subtitles.addTracks(commandArgs.tracks);
                }

                break;
            }
            case 'stop': {
                loaded = false;
                videoElement.removeAttribute('src');
                videoElement.load();
                videoElement.currentTime = 0;
                onVideoPropChanged('paused');
                onVideoPropChanged('currentTime');
                onVideoPropChanged('duration');
                onVideoPropChanged('readyState');
                subtitles.clearTracks();
                break;
            }
            case 'load': {
                if (commandArgs && commandArgs.stream && typeof commandArgs.stream.url === 'string') {
                    command('stop');
                    videoElement.autoplay = typeof commandArgs.autoplay === 'boolean' ? commandArgs.autoplay : true;
                    videoElement.currentTime = !isNaN(commandArgs.time) && commandArgs.time !== null ? parseInt(commandArgs.time) / 1000 : 0;
                    videoElement.src = commandArgs.stream.url;
                    loaded = true;
                    onVideoPropChanged('paused');
                    onVideoPropChanged('currentTime');
                    onVideoPropChanged('duration');
                    onVideoPropChanged('readyState');
                }

                break;
            }
            case 'destroy': {
                command('stop');
                destroyed = true;
                onVideoPropChanged('volume');
                onVideoPropChanged('muted');
                subtitles.destroy();
                events.removeAllListeners();
                events.on('error', function() { });
                videoElement.onpause = null;
                videoElement.onplay = null;
                videoElement.ontimeupdate = null;
                videoElement.ondurationchange = null;
                videoElement.onwaiting = null;
                videoElement.onplaying = null;
                videoElement.onloadeddata = null;
                videoElement.onvolumechange = null;
                videoElement.onended = null;
                videoElement.onerror = null;
                containerElement.removeChild(videoElement);
                containerElement.removeChild(stylesElement);
                break;
            }
            default: {
                throw new Error('command not supported: ' + commandName);
            }
        }
    }
    function on(eventName, listener) {
        if (destroyed) {
            throw new Error('Video is destroyed');
        }

        events.on(eventName, listener);
    }
    function dispatch(args) {
        if (destroyed) {
            throw new Error('Video is destroyed');
        }

        if (args) {
            if (typeof args.commandName === 'string') {
                command(args.commandName, args.commandArgs);
                return;
            } else if (typeof args.propName === 'string') {
                setProp(args.propName, args.propValue);
                return;
            } else if (typeof args.observedPropName === 'string') {
                observeProp(args.observedPropName);
                return;
            }
        }

        throw new Error('Invalid dispatch call: ' + JSON.stringify(args));
    }

    this.on = on;
    this.dispatch = dispatch;

    Object.freeze(this);
};

HTMLVideo.manifest = Object.freeze({
    name: 'HTMLVideo',
    embedded: true,
    props: Object.freeze(['paused', 'time', 'duration', 'buffering', 'volume', 'muted', 'subtitlesTracks', 'selectedSubtitlesTrackId', 'subtitlesSize', 'subtitlesDelay', 'subtitlesOffset', 'subtitlesTextColor', 'subtitlesBackgroundColor', 'subtitlesOutlineColor'])
});

Object.freeze(HTMLVideo);

module.exports = HTMLVideo;
