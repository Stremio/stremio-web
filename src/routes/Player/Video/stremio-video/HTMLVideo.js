var EventEmitter = require('events');
var HTMLSubtitles = require('./HTMLSubtitles');

function HTMLVideo(options) {
    var containerElement = options && options.containerElement;
    if (!(containerElement instanceof HTMLElement) || !containerElement.hasAttribute('id')) {
        throw new Error('Instance of HTMLElement with id attribute required');
    }

    var destroyed = false;
    var loaded = false;
    var events = new EventEmitter();
    var observedProps = {};
    var subtitles = new HTMLSubtitles({ containerElement: containerElement });
    var stylesElement = document.createElement('style');
    var videoElement = document.createElement('video');

    events.on('error', function() { });
    subtitles.on('textShouldUpdate', onSubtitlesTextShouldUpdate);
    subtitles.on('propChanged', onSubtitlesPropChanged);
    subtitles.on('error', onSubtitlesError);
    containerElement.appendChild(stylesElement);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .video { position: absolute; width: 100%; height: 100%; z-index: -1; background-color: black; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(videoElement);
    videoElement.classList.add('video');
    videoElement.crossOrigin = 'anonymous';
    videoElement.controls = false;
    videoElement.onended = onVideoEnded;
    videoElement.onerror = onVideoError;
    videoElement.ontimeupdate = function() {
        onSubtitlesTextShouldUpdate();
    };

    function onError(error) {
        if (destroyed || !error) {
            return;
        }

        Object.freeze(error);
        events.emit('error', error);
        if (error.critical) {
            dispatch({ commandName: 'stop' });
        }
    }
    function getPropValue(propName) {
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
                if (!loaded) {
                    return Object.freeze([]);
                }

                return subtitles.dispatch({ propName: 'tracks' });
            }
            case 'selectedSubtitlesTrackId': {
                if (!loaded) {
                    return null;
                }

                return subtitles.dispatch({ propName: 'selectedTrackId' });
            }
            case 'subtitlesDelay': {
                if (!loaded) {
                    return null;
                }

                return subtitles.dispatch({ propName: 'delay' });
            }
            case 'subtitlesSize': {
                if (destroyed) {
                    return null;
                }

                return subtitles.dispatch({ propName: 'size' });
            }
            case 'subtitlesDarkBackground': {
                if (destroyed) {
                    return null;
                }

                return subtitles.dispatch({ propName: 'darkBackground' });
            }
            case 'subtitlesOffset': {
                if (destroyed) {
                    return null;
                }

                return subtitles.dispatch({ propName: 'offset' });
            }
            default: {
                throw new Error('getProp not supported: ' + propName);
            }
        }
    }
    function onVideoEnded() {
        if (destroyed) {
            return;
        }

        events.emit('ended');
    }
    function onVideoError() {
        onError({
            code: videoElement.error.code,
            message: videoElement.error.message,
            critical: true
        });
    }
    function onVideoPropChanged(propName) {
        switch (propName) {
            case 'paused': {
                if (observedProps['paused']) {
                    events.emit('propChanged', 'paused', getPropValue('paused'));
                }

                break;
            }
            case 'currentTime': {
                if (observedProps['time']) {
                    events.emit('propChanged', 'time', getPropValue('time'));
                }

                break;
            }
            case 'duration': {
                if (observedProps['duration']) {
                    events.emit('propChanged', 'duration', getPropValue('duration'));
                }

                break;
            }
            case 'readyState': {
                if (observedProps['buffering']) {
                    events.emit('propChanged', 'buffering', getPropValue('buffering'));
                }

                break;
            }
            case 'volume': {
                if (observedProps['volume']) {
                    events.emit('propChanged', 'volume', getPropValue('volume'));
                }

                break;
            }
            case 'muted': {
                if (observedProps['muted']) {
                    events.emit('propChanged', 'muted', getPropValue('muted'));
                }

                break;
            }
        }
    }
    function onSubtitlesError(error) {
        onError(Object.assign({}, error, {
            critical: false
        }));
    }
    function onSubtitlesPropChanged(propName) {
        switch (propName) {
            case 'tracks': {
                if (observedProps['subtitlesTracks']) {
                    events.emit('propChanged', 'subtitlesTracks', getPropValue('subtitlesTracks'));
                }

                break;
            }
            case 'selectedTrackId': {
                if (observedProps['selectedSubtitlesTrackId']) {
                    events.emit('propChanged', 'selectedSubtitlesTrackId', getPropValue('selectedSubtitlesTrackId'));
                }

                break;
            }
            case 'delay': {
                if (observedProps['subtitlesDelay']) {
                    events.emit('propChanged', 'subtitlesDelay', getPropValue('subtitlesDelay'));
                }

                break;
            }
            case 'size': {
                if (observedProps['subtitlesSize']) {
                    events.emit('propChanged', 'subtitlesSize', getPropValue('subtitlesSize'));
                }

                break;
            }
            case 'darkBackground': {
                if (observedProps['subtitlesDarkBackground']) {
                    events.emit('propChanged', 'subtitlesDarkBackground', getPropValue('subtitlesDarkBackground'));
                }

                break;
            }
            case 'offset': {
                if (observedProps['subtitlesOffset']) {
                    events.emit('propChanged', 'subtitlesOffset', getPropValue('subtitlesOffset'));
                }

                break;
            }
        }
    }
    function onSubtitlesTextShouldUpdate() {
        subtitles.dispatch({
            commandName: 'updateText',
            commandArgs: {
                time: getPropValue('time')
            }
        });
    }
    function observeProp(propName) {
        switch (propName) {
            case 'paused': {
                observedProps['paused'] = true;
                events.emit('propValue', 'paused', getPropValue('paused'));
                videoElement.onpause = function() {
                    onVideoPropChanged('paused');
                };
                videoElement.onplay = function() {
                    onVideoPropChanged('paused');
                };
                return;
            }
            case 'time': {
                observedProps['time'] = true;
                events.emit('propValue', 'time', getPropValue('time'));
                videoElement.ontimeupdate = function() {
                    onSubtitlesTextShouldUpdate();
                    onVideoPropChanged('currentTime');
                };
                return;
            }
            case 'duration': {
                observedProps['duration'] = true;
                events.emit('propValue', 'duration', getPropValue('duration'));
                videoElement.ondurationchange = function() {
                    onVideoPropChanged('duration');
                };
                return;
            }
            case 'buffering': {
                observedProps['buffering'] = true;
                events.emit('propValue', 'buffering', getPropValue('buffering'));
                videoElement.onwaiting = function() {
                    onVideoPropChanged('readyState');
                };
                videoElement.onplaying = function() {
                    onVideoPropChanged('readyState');
                };
                videoElement.onloadeddata = function() {
                    onVideoPropChanged('readyState');
                };
                return;
            }
            case 'volume': {
                observedProps['volume'] = true;
                events.emit('propValue', 'volume', getPropValue('volume'));
                videoElement.onvolumechange = function() {
                    onVideoPropChanged('volume');
                    onVideoPropChanged('muted');
                };
                return;
            }
            case 'muted': {
                observedProps['muted'] = true;
                events.emit('propValue', 'muted', getPropValue('muted'));
                videoElement.onvolumechange = function() {
                    onVideoPropChanged('volume');
                    onVideoPropChanged('muted');
                };
                return;
            }
            case 'subtitlesTracks': {
                observedProps['subtitlesTracks'] = true;
                events.emit('propValue', 'subtitlesTracks', getPropValue('subtitlesTracks'));
                return;
            }
            case 'selectedSubtitlesTrackId': {
                observedProps['selectedSubtitlesTrackId'] = true;
                events.emit('propValue', 'selectedSubtitlesTrackId', getPropValue('selectedSubtitlesTrackId'));
                return;
            }
            case 'subtitlesDelay': {
                observedProps['subtitlesDelay'] = true;
                events.emit('propValue', 'subtitlesDelay', getPropValue('subtitlesDelay'));
                return;
            }
            case 'subtitlesSize': {
                observedProps['subtitlesSize'] = true;
                events.emit('propValue', 'subtitlesSize', getPropValue('subtitlesSize'));
                return;
            }
            case 'subtitlesDarkBackground': {
                observedProps['subtitlesDarkBackground'] = true;
                events.emit('propValue', 'subtitlesDarkBackground', getPropValue('subtitlesDarkBackground'));
                return;
            }
            case 'subtitlesOffset': {
                observedProps['subtitlesOffset'] = true;
                events.emit('propValue', 'subtitlesOffset', getPropValue('subtitlesOffset'));
                return;
            }
            default: {
                throw new Error('observeProp not supported: ' + propName);
            }
        }
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

                return;
            }
            case 'time': {
                if (loaded && !isNaN(propValue) && propValue !== null) {
                    videoElement.currentTime = parseInt(propValue) / 1000;
                }

                return;
            }
            case 'volume': {
                if (!isNaN(propValue) && propValue !== null) {
                    videoElement.muted = false;
                    videoElement.volume = Math.max(0, Math.min(100, parseInt(propValue))) / 100;
                }

                return;
            }
            case 'muted': {
                videoElement.muted = !!propValue;
                return;
            }
            case 'selectedSubtitlesTrackId': {
                if (loaded) {
                    subtitles.dispatch({ propName: 'selectedTrackId', propValue: propValue });
                }

                return;
            }
            case 'subtitlesDelay': {
                if (loaded) {
                    subtitles.dispatch({ propName: 'delay', propValue: propValue });
                }

                return;
            }
            case 'subtitlesSize': {
                subtitles.dispatch({ propName: 'size', propValue: propValue });
                return;
            }
            case 'subtitlesDarkBackground': {
                subtitles.dispatch({ propName: 'darkBackground', propValue: propValue });
                return;
            }
            case 'subtitlesOffset': {
                subtitles.dispatch({ propName: 'offset', propValue: propValue });
                return;
            }
            default: {
                throw new Error('setProp not supported: ' + propName);
            }
        }
    }
    function command(commandName, commandArgs) {
        switch (commandName) {
            case 'addSubtitleTracks': {
                subtitles.dispatch({ commandName: 'addTracks', commandArgs: commandArgs });
                return;
            }
            case 'stop': {
                loaded = false;
                subtitles.dispatch({ commandName: 'clearTracks' });
                videoElement.removeAttribute('src');
                videoElement.load();
                videoElement.currentTime = 0;
                onVideoPropChanged('paused');
                onVideoPropChanged('currentTime');
                onVideoPropChanged('duration');
                onVideoPropChanged('readyState');
                return;
            }
            case 'load': {
                dispatch({ commandName: 'stop' });
                videoElement.autoplay = commandArgs.autoplay !== false;
                videoElement.currentTime = !isNaN(commandArgs.time) && commandArgs.time !== null ? parseInt(commandArgs.time) / 1000 : 0;
                videoElement.src = commandArgs.url;
                loaded = true;
                onVideoPropChanged('paused');
                onVideoPropChanged('currentTime');
                onVideoPropChanged('duration');
                onVideoPropChanged('readyState');
                return;
            }
            case 'destroy': {
                dispatch({ commandName: 'stop' });
                destroyed = true;
                onVideoPropChanged('volume');
                onVideoPropChanged('muted');
                onSubtitlesPropChanged('size');
                onSubtitlesPropChanged('darkBackground');
                onSubtitlesPropChanged('offset');
                events.removeAllListeners();
                events.on('error', function() { });
                videoElement.onended = null;
                videoElement.onerror = null;
                videoElement.onpause = null;
                videoElement.onplay = null;
                videoElement.ontimeupdate = null;
                videoElement.ondurationchange = null;
                videoElement.onwaiting = null;
                videoElement.onplaying = null;
                videoElement.onloadeddata = null;
                videoElement.onvolumechange = null;
                containerElement.removeChild(videoElement);
                containerElement.removeChild(stylesElement);
                subtitles.dispatch({ commandName: 'destroy' });
                return;
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
    props: Object.freeze(['paused', 'time', 'duration', 'buffering', 'volume', 'muted', 'subtitlesTracks', 'selectedSubtitlesTrackId', 'subtitlesSize', 'subtitlesDelay', 'subtitlesDarkBackground', 'subtitlesOffset'])
});

Object.freeze(HTMLVideo);

module.exports = HTMLVideo;
