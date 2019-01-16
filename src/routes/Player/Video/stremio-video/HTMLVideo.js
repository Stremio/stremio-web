var EventEmitter = require('events');
var subtitleUtils = require('./utils/subtitles');

var HTMLVideo = function(containerElement) {
    if (!(containerElement instanceof HTMLElement)) {
        throw new Error('Instance of HTMLElement required as a first argument');
    }

    var self = this;
    var events = new EventEmitter();
    var loaded = false;
    var destroyed = false;
    var dispatchArgsQueue = [];
    var subtitleCues = {};
    var subtitleTracks = [];
    var selectedSubtitleTrackId = null;
    var subtitleDelay = 0;
    var stylesElement = document.createElement('style');
    var videoElement = document.createElement('video');
    var subtitlesElement = document.createElement('div');

    containerElement.appendChild(stylesElement);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' video { width: 100%; height: 100%; position: relative; z-index: 0; }', stylesElement.sheet.cssRules.length);
    var subtitleStylesIndex = stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles { position: absolute; right: 0; bottom: 0; left: 0; font-size: 26pt; color: white; text-align: center; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles .cue { display: inline-block; padding: 0.2em; text-shadow: #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px; }', stylesElement.sheet.cssRules.length);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .subtitles.dark-background .cue { text-shadow: none; background-color: #222222; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(videoElement);
    videoElement.crossOrigin = 'anonymous';
    videoElement.controls = false;
    containerElement.appendChild(subtitlesElement);
    subtitlesElement.classList.add('subtitles');

    function getPaused() {
        if (!loaded) {
            return null;
        }

        return !!videoElement.paused;
    }
    function getTime() {
        if (!loaded) {
            return null;
        }

        return Math.floor(videoElement.currentTime * 1000);
    }
    function getDuration() {
        if (!loaded || isNaN(videoElement.duration)) {
            return null;
        }

        return Math.floor(videoElement.duration * 1000);
    }
    function getBuffering() {
        if (!loaded) {
            return null;
        }

        return videoElement.readyState < videoElement.HAVE_FUTURE_DATA;
    }
    function getVolume() {
        if (destroyed) {
            return null;
        }

        return videoElement.muted ? 0 : Math.floor(videoElement.volume * 100);
    }
    function getSubtitleTracks() {
        if (!loaded) {
            return [];
        }

        return subtitleTracks.slice();
    }
    function getSelectedSubtitleTrackId() {
        if (!loaded) {
            return null;
        }

        return selectedSubtitleTrackId;
    }
    function getSubtitleDelay() {
        if (!loaded) {
            return null;
        }

        return subtitleDelay;
    }
    function getSubtitleSize() {
        if (destroyed) {
            return null;
        }

        return parseFloat(stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize);
    }
    function getSubtitleDarkBackground() {
        if (destroyed) {
            return null;
        }

        return subtitlesElement.classList.contains('dark-background');
    }
    function onEnded() {
        events.emit('ended');
    }
    function onError() {
        var message;
        var critical;
        switch (videoElement.error.code) {
            case 1:
                message = 'Fetching process aborted';
                critical = false;
                break;
            case 2:
                message = 'Error occurred when downloading';
                critical = true;
                break;
            case 3:
                message = 'Error occurred when decoding';
                critical = true;
                break;
            case 4:
                message = 'Video is not supported';
                critical = true;
                break;
            default:
                message = 'Unknown error';
                critical = true;
        }

        events.emit('error', {
            code: videoElement.error.code,
            message: message,
            critical: critical
        });

        if (critical) {
            self.dispatch('command', 'stop');
        }
    }
    function onPausedChanged() {
        events.emit('propChanged', 'paused', getPaused());
    }
    function onTimeChanged() {
        events.emit('propChanged', 'time', getTime());
    }
    function onDurationChanged() {
        events.emit('propChanged', 'duration', getDuration());
    }
    function onBufferingChanged() {
        events.emit('propChanged', 'buffering', getBuffering());
    }
    function onVolumeChanged() {
        events.emit('propChanged', 'volume', getVolume());
    }
    function onSubtitleTracksChanged() {
        events.emit('propChanged', 'subtitleTracks', getSubtitleTracks());
    }
    function onSelectedSubtitleTrackIdChanged() {
        events.emit('propChanged', 'selectedSubtitleTrackId', getSelectedSubtitleTrackId());
    }
    function onSubtitleDelayChanged() {
        events.emit('propChanged', 'subtitleDelay', getSubtitleDelay());
    }
    function onSubtitleSizeChanged() {
        events.emit('propChanged', 'subtitleSize', getSubtitleSize());
    }
    function onSubtitleDarkBackgroundChanged() {
        events.emit('propChanged', 'subtitleDarkBackground', getSubtitleDarkBackground());
    }
    function updateSubtitleText() {
        while (subtitlesElement.hasChildNodes()) {
            subtitlesElement.removeChild(subtitlesElement.lastChild);
        }

        if (!loaded || !Array.isArray(subtitleCues.times)) {
            return;
        }

        var time = getTime() + getSubtitleDelay();
        var cuesForTime = subtitleUtils.cuesForTime(subtitleCues, time);
        for (var i = 0; i < cuesForTime.length; i++) {
            var cueNode = subtitleUtils.render(cuesForTime[i]);
            cueNode.classList.add('cue');
            subtitlesElement.append(cueNode, document.createElement('br'));
        }
    }
    function flushArgsQueue() {
        for (var i = 0; i < dispatchArgsQueue.length; i++) {
            self.dispatch.apply(self, dispatchArgsQueue[i]);
        }

        dispatchArgsQueue = [];
    }

    this.on = function(eventName, listener) {
        if (destroyed) {
            throw new Error('Unable to add ' + eventName + ' listener to destroyed video');
        }

        events.on(eventName, listener);
    };

    this.dispatch = function() {
        if (destroyed) {
            throw new Error('Unable to dispatch ' + arguments[0] + ' to destroyed video');
        }

        switch (arguments[0]) {
            case 'observeProp':
                switch (arguments[1]) {
                    case 'paused':
                        events.emit('propValue', 'paused', getPaused());
                        videoElement.removeEventListener('pause', onPausedChanged);
                        videoElement.removeEventListener('play', onPausedChanged);
                        videoElement.addEventListener('pause', onPausedChanged);
                        videoElement.addEventListener('play', onPausedChanged);
                        return;
                    case 'time':
                        events.emit('propValue', 'time', getTime());
                        videoElement.removeEventListener('timeupdate', onTimeChanged);
                        videoElement.addEventListener('timeupdate', onTimeChanged);
                        return;
                    case 'duration':
                        events.emit('propValue', 'duration', getDuration());
                        videoElement.removeEventListener('durationchange', onDurationChanged);
                        videoElement.addEventListener('durationchange', onDurationChanged);
                        return;
                    case 'buffering':
                        events.emit('propValue', 'buffering', getBuffering());
                        videoElement.removeEventListener('waiting', onBufferingChanged);
                        videoElement.addEventListener('waiting', onBufferingChanged);
                        videoElement.removeEventListener('playing', onBufferingChanged);
                        videoElement.addEventListener('playing', onBufferingChanged);
                        videoElement.removeEventListener('loadeddata', onBufferingChanged);
                        videoElement.addEventListener('loadeddata', onBufferingChanged);
                        return;
                    case 'volume':
                        events.emit('propValue', 'volume', getVolume());
                        videoElement.removeEventListener('volumechange', onVolumeChanged);
                        videoElement.addEventListener('volumechange', onVolumeChanged);
                        return;
                    case 'subtitleTracks':
                        events.emit('propValue', 'subtitleTracks', getSubtitleTracks());
                        return;
                    case 'selectedSubtitleTrackId':
                        events.emit('propValue', 'selectedSubtitleTrackId', getSelectedSubtitleTrackId());
                        return;
                    case 'subtitleSize':
                        events.emit('propValue', 'subtitleSize', getSubtitleSize());
                        return;
                    case 'subtitleDelay':
                        events.emit('propValue', 'subtitleDelay', getSubtitleDelay());
                        return;
                    case 'subtitleDarkBackground':
                        events.emit('propValue', 'subtitleDarkBackground', getSubtitleDarkBackground());
                        return;
                    default:
                        throw new Error('observeProp not supported: ' + arguments[1]);
                }
            case 'setProp':
                switch (arguments[1]) {
                    case 'paused':
                        if (loaded) {
                            arguments[2] ? videoElement.pause() : videoElement.play();
                        }
                        break;
                    case 'time':
                        if (loaded) {
                            if (!isNaN(arguments[2])) {
                                videoElement.currentTime = arguments[2] / 1000;
                            }
                        }
                        break;
                    case 'selectedSubtitleTrackId':
                        if (loaded) {
                            selectedSubtitleTrackId = null;
                            subtitleDelay = 0;
                            subtitleCues = {};
                            for (var i = 0; i < subtitleTracks.length; i++) {
                                var subtitleTrack = subtitleTracks[i];
                                if (subtitleTrack.id === arguments[2]) {
                                    selectedSubtitleTrackId = subtitleTrack.id;
                                    fetch(subtitleTrack.url)
                                        .then(function(resp) {
                                            return resp.text();
                                        })
                                        .catch(function() {
                                            events.emit('error', {
                                                code: 70,
                                                message: 'Failed to fetch subtitles from ' + subtitleTrack.origin,
                                                critical: false
                                            });
                                        })
                                        .then(function(text) {
                                            if (selectedSubtitleTrackId === subtitleTrack.id) {
                                                subtitleCues = subtitleUtils.parse(text);
                                                updateSubtitleText();
                                            }
                                        })
                                        .catch(function() {
                                            events.emit('error', {
                                                code: 71,
                                                message: 'Failed to parse subtitles from ' + subtitleTrack.origin,
                                                critical: false
                                            });
                                        });
                                    break;
                                }
                            }

                            onSubtitleDelayChanged();
                            onSelectedSubtitleTrackIdChanged();
                            updateSubtitleText();
                        }
                        break;
                    case 'subtitleDelay':
                        if (loaded) {
                            if (!isNaN(arguments[2])) {
                                subtitleDelay = parseFloat(arguments[2]);
                                onSubtitleDelayChanged();
                                updateSubtitleText();
                            }
                        }
                        break;
                    case 'subtitleSize':
                        if (!isNaN(arguments[2])) {
                            stylesElement.sheet.cssRules[subtitleStylesIndex].style.fontSize = parseFloat(arguments[2]) + 'pt';
                            onSubtitleSizeChanged();
                        }
                        return;
                    case 'subtitleDarkBackground':
                        if (arguments[2]) {
                            subtitlesElement.classList.add('dark-background');
                        } else {
                            subtitlesElement.classList.remove('dark-background');
                        }

                        onSubtitleDarkBackgroundChanged();
                        return;
                    case 'volume':
                        if (!isNaN(arguments[2])) {
                            videoElement.muted = false;
                            videoElement.volume = arguments[2] / 100;
                        }
                        return;
                    default:
                        throw new Error('setProp not supported: ' + arguments[1]);
                }
                break;
            case 'command':
                switch (arguments[1]) {
                    case 'addSubtitleTracks':
                        if (loaded) {
                            var extraSubtitleTracks = (Array.isArray(arguments[2]) ? arguments[2] : [])
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
                                });
                            subtitleTracks = subtitleTracks.concat(extraSubtitleTracks)
                                .filter(function(track, index, tracks) {
                                    for (var i = 0; i < tracks.length; i++) {
                                        if (tracks[i].id === track.id) {
                                            return i === index;
                                        }
                                    }

                                    return false;
                                });
                            onSubtitleTracksChanged();
                        }
                        break;
                    case 'mute':
                        videoElement.muted = true;
                        return;
                    case 'unmute':
                        videoElement.volume = videoElement.volume !== 0 ? videoElement.volume : 0.5;
                        videoElement.muted = false;
                        return;
                    case 'stop':
                        videoElement.removeEventListener('ended', onEnded);
                        videoElement.removeEventListener('error', onError);
                        videoElement.removeEventListener('timeupdate', updateSubtitleText);
                        loaded = false;
                        dispatchArgsQueue = [];
                        subtitleCues = {};
                        subtitleTracks = [];
                        selectedSubtitleTrackId = null;
                        subtitleDelay = 0;
                        videoElement.removeAttribute('src');
                        videoElement.load();
                        videoElement.currentTime = 0;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onBufferingChanged();
                        onSubtitleTracksChanged();
                        onSelectedSubtitleTrackIdChanged();
                        onSubtitleDelayChanged();
                        updateSubtitleText();
                        return;
                    case 'load':
                        var dispatchArgsQueueCopy = dispatchArgsQueue.slice();
                        self.dispatch('command', 'stop');
                        dispatchArgsQueue = dispatchArgsQueueCopy;
                        videoElement.addEventListener('ended', onEnded);
                        videoElement.addEventListener('error', onError);
                        videoElement.addEventListener('timeupdate', updateSubtitleText);
                        videoElement.autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                        videoElement.currentTime = !isNaN(arguments[3].time) ? arguments[3].time / 1000 : 0;
                        videoElement.src = arguments[2].url;
                        loaded = true;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onBufferingChanged();
                        updateSubtitleText();
                        flushArgsQueue();
                        return;
                    case 'destroy':
                        self.dispatch('command', 'stop');
                        destroyed = true;
                        onVolumeChanged();
                        onSubtitleSizeChanged();
                        onSubtitleDarkBackgroundChanged();
                        events.removeAllListeners();
                        videoElement.removeEventListener('pause', onPausedChanged);
                        videoElement.removeEventListener('play', onPausedChanged);
                        videoElement.removeEventListener('timeupdate', onTimeChanged);
                        videoElement.removeEventListener('durationchange', onDurationChanged);
                        videoElement.removeEventListener('volumechange', onVolumeChanged);
                        videoElement.removeEventListener('waiting', onBufferingChanged);
                        videoElement.removeEventListener('playing', onBufferingChanged);
                        videoElement.removeEventListener('loadeddata', onBufferingChanged);
                        containerElement.removeChild(videoElement);
                        containerElement.removeChild(stylesElement);
                        containerElement.removeChild(subtitlesElement);
                        return;
                    default:
                        throw new Error('command not supported: ' + arguments[1]);
                }
                break;
            default:
                throw new Error('Invalid dispatch call: ' + Array.from(arguments).map(String));
        }

        if (!loaded) {
            dispatchArgsQueue.push(Array.from(arguments));
        }
    };
};

HTMLVideo.manifest = {
    name: 'HTMLVideo',
    embedded: true,
    props: ['paused', 'time', 'duration', 'volume', 'buffering', 'subtitleTracks', 'selectedSubtitleTrackId', 'subtitleSize', 'subtitleDelay', 'subtitleDarkBackground']
};

module.exports = HTMLVideo;
