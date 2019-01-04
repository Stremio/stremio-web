var EventEmitter = require('events');
var subtitleUtils = require('./utils/subtitles');

var HTMLVideo = function(container) {
    if (!(container instanceof HTMLElement)) {
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
    var styles = document.createElement('style');
    var video = document.createElement('video');
    var subtitles = document.createElement('div');

    container.appendChild(styles);
    styles.sheet.insertRule('#' + container.id + ' video { width: 100%; height: 100%; position: relative; z-index: 0; }', styles.sheet.cssRules.length);
    var subtitleStylesIndex = styles.sheet.insertRule('#' + container.id + ' .subtitles { position: absolute; right: 0; bottom: 0; left: 0; font-size: 26pt; color: white; text-align: center; }', styles.sheet.cssRules.length);
    styles.sheet.insertRule('#' + container.id + ' .subtitles.dark-background .cue { text-shadow: none; background-color: #222222; }', styles.sheet.cssRules.length);
    styles.sheet.insertRule('#' + container.id + ' .subtitles .cue { display: inline-block; padding: 0.2em; text-shadow: #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px, #222222 0px 0px 1.8px; }', styles.sheet.cssRules.length);
    container.appendChild(video);
    video.crossOrigin = 'anonymous';
    video.controls = false;
    container.appendChild(subtitles);
    subtitles.classList.add('subtitles');

    function getPaused() {
        if (!loaded) {
            return null;
        }

        return !!video.paused;
    }
    function getTime() {
        if (!loaded) {
            return null;
        }

        return Math.floor(video.currentTime * 1000);
    }
    function getDuration() {
        if (!loaded || isNaN(video.duration)) {
            return null;
        }

        return Math.floor(video.duration * 1000);
    }
    function getVolume() {
        return video.muted ? 0 : Math.floor(video.volume * 100);
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
        return subtitleDelay;
    }
    function getSubtitleSize() {
        return parseFloat(styles.sheet.cssRules[subtitleStylesIndex].style.fontSize);
    }
    function getSubtitleDarkBackground() {
        return subtitles.classList.contains('dark-background');
    }
    function onEnded() {
        events.emit('ended');
    }
    function onError() {
        var message;
        var critical;
        switch (video.error.code) {
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
            code: video.error.code,
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
        while (subtitles.hasChildNodes()) {
            subtitles.removeChild(subtitles.lastChild);
        }

        if (!loaded || !Array.isArray(subtitleCues.times)) {
            return;
        }

        var time = getTime() + getSubtitleDelay();
        var cuesForTime = subtitleUtils.cuesForTime(subtitleCues, time);
        for (var i = 0; i < cuesForTime.length; i++) {
            var cueNode = subtitleUtils.render(cuesForTime[i]);
            cueNode.classList.add('cue');
            subtitles.append(cueNode, document.createElement('br'));
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
                        video.removeEventListener('pause', onPausedChanged);
                        video.removeEventListener('play', onPausedChanged);
                        video.addEventListener('pause', onPausedChanged);
                        video.addEventListener('play', onPausedChanged);
                        return;
                    case 'time':
                        events.emit('propValue', 'time', getTime());
                        video.removeEventListener('timeupdate', onTimeChanged);
                        video.addEventListener('timeupdate', onTimeChanged);
                        return;
                    case 'duration':
                        events.emit('propValue', 'duration', getDuration());
                        video.removeEventListener('durationchange', onDurationChanged);
                        video.addEventListener('durationchange', onDurationChanged);
                        return;
                    case 'volume':
                        events.emit('propValue', 'volume', getVolume());
                        video.removeEventListener('volumechange', onVolumeChanged);
                        video.addEventListener('volumechange', onVolumeChanged);
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
                            arguments[2] ? video.pause() : video.play();
                        }
                        break;
                    case 'time':
                        if (loaded) {
                            if (!isNaN(arguments[2])) {
                                video.currentTime = arguments[2] / 1000;
                            }
                        }
                        break;
                    case 'selectedSubtitleTrackId':
                        if (loaded) {
                            selectedSubtitleTrackId = null;
                            subtitleCues = {};
                            for (var i = 0; i < subtitleTracks.length; i++) {
                                var subtitleTrack = subtitleTracks[i];
                                if (subtitleTrack.id === arguments[2]) {
                                    selectedSubtitleTrackId = subtitleTrack.id;
                                    fetch(subtitleTrack.url)
                                        .then(function(resp) {
                                            return resp.text();
                                        })
                                        .then(function(text) {
                                            if (selectedSubtitleTrackId === subtitleTrack.id) {
                                                subtitleCues = subtitleUtils.parse(text);
                                            }
                                        })
                                        .catch(function() {
                                            events.emit('error', {
                                                code: 68,
                                                message: 'Failed to fetch subtitles from ' + subtitleTrack.origin,
                                                critical: false
                                            });
                                        });
                                    break;
                                }
                            }

                            updateSubtitleText();
                            onSelectedSubtitleTrackIdChanged();
                        }
                        break;
                    case 'subtitleSize':
                        if (!isNaN(arguments[2])) {
                            styles.sheet.cssRules[subtitleStylesIndex].style.fontSize = parseFloat(arguments[2]) + 'pt';
                            onSubtitleSizeChanged();
                        }
                        return;
                    case 'subtitleDarkBackground':
                        if (arguments[2]) {
                            subtitles.classList.add('dark-background');
                        } else {
                            subtitles.classList.remove('dark-background');
                        }

                        onSubtitleDarkBackgroundChanged();
                        return;
                    case 'subtitleDelay':
                        if (!isNaN(arguments[2])) {
                            subtitleDelay = parseFloat(arguments[2]);
                            onSubtitleDelayChanged();
                            updateSubtitleText();
                        }
                        return;
                    case 'volume':
                        if (!isNaN(arguments[2])) {
                            video.muted = false;
                            video.volume = arguments[2] / 100;
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
                        video.muted = true;
                        return;
                    case 'unmute':
                        video.volume = video.volume !== 0 ? video.volume : 0.5;
                        video.muted = false;
                        return;
                    case 'stop':
                        video.removeEventListener('ended', onEnded);
                        video.removeEventListener('error', onError);
                        video.removeEventListener('timeupdate', updateSubtitleText);
                        loaded = false;
                        dispatchArgsQueue = [];
                        subtitleCues = {};
                        subtitleTracks = [];
                        selectedSubtitleTrackId = null;
                        video.removeAttribute('src');
                        video.load();
                        video.currentTime = 0;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onSubtitleTracksChanged();
                        onSelectedSubtitleTrackIdChanged();
                        updateSubtitleText();
                        return;
                    case 'load':
                        var dispatchArgsQueueCopy = dispatchArgsQueue.slice();
                        self.dispatch('command', 'stop');
                        dispatchArgsQueue = dispatchArgsQueueCopy;
                        video.addEventListener('ended', onEnded);
                        video.addEventListener('error', onError);
                        video.addEventListener('timeupdate', updateSubtitleText);
                        video.autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                        video.currentTime = !isNaN(arguments[3].time) ? arguments[3].time / 1000 : 0;
                        video.src = arguments[2].url;
                        loaded = true;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onSubtitleTracksChanged();
                        onSelectedSubtitleTrackIdChanged();
                        updateSubtitleText();
                        flushArgsQueue();
                        return;
                    case 'destroy':
                        self.dispatch('command', 'stop');
                        events.removeAllListeners();
                        video.removeEventListener('pause', onPausedChanged);
                        video.removeEventListener('play', onPausedChanged);
                        video.removeEventListener('timeupdate', onTimeChanged);
                        video.removeEventListener('durationchange', onDurationChanged);
                        video.removeEventListener('volumechange', onVolumeChanged);
                        container.removeChild(video);
                        container.removeChild(styles);
                        container.removeChild(subtitles);
                        destroyed = true;
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
    props: ['paused', 'time', 'duration', 'volume', 'subtitleTracks', 'selectedSubtitleTrackId', 'subtitleSize', 'subtitleDelay', 'subtitleDarkBackground']
};

module.exports = HTMLVideo;
