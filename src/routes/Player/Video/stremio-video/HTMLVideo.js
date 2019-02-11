var EventEmitter = require('events');
var HTMLSubtitles = require('./HTMLSubtitles');

var HTMLVideo = function(containerElement) {
    if (!(containerElement instanceof HTMLElement)) {
        throw new Error('Instance of HTMLElement required as a first argument');
    }

    var self = this;
    var events = new EventEmitter();
    var loaded = false;
    var destroyed = false;
    var dispatchArgsQueue = [];
    var subtitles = new HTMLSubtitles(containerElement);
    var stylesElement = document.createElement('style');
    var videoElement = document.createElement('video');

    containerElement.appendChild(stylesElement);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' video { position: absolute; width: 100%; height: 100%; z-index: -1; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(videoElement);
    videoElement.crossOrigin = 'anonymous';
    videoElement.controls = false;

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

        return Object.freeze(subtitles.tracks.slice());
    }
    function getSelectedSubtitleTrackId() {
        if (!loaded) {
            return null;
        }

        return subtitles.selectedTrackId;
    }
    function getSubtitleDelay() {
        if (!loaded) {
            return null;
        }

        return subtitles.delay;
    }
    function getSubtitleSize() {
        if (destroyed) {
            return null;
        }

        return subtitles.size;
    }
    function getSubtitleDarkBackground() {
        if (destroyed) {
            return null;
        }

        return subtitles.darkBackground;
    }
    function onError(error) {
        Object.freeze(error)
        events.emit('error', error);
        if (error.critical) {
            self.dispatch('command', 'stop');
        }
    }
    function onEnded() {
        events.emit('ended');
    }
    function onSubtitlesError(error) {
        var message;
        switch (error.code) {
            case 70:
                message = 'Failed to fetch subtitles from ' + error.track.origin;
                break;
            case 71:
                message = 'Failed to parse subtitles from ' + error.track.origin;
                break;
            default:
                message = 'Unknown subtitles error';
        }

        onError({
            code: error.code,
            message: message,
            critical: false
        });
    }
    function onVideoError() {
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

        onError({
            code: videoElement.error.code,
            message: message,
            critical: critical
        });
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
        var time = getTime();
        subtitles.updateTextForTime(time);
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
                            subtitles.selectedTrackId = arguments[2];
                            onSubtitleDelayChanged();
                            onSelectedSubtitleTrackIdChanged();
                            updateSubtitleText();
                        }
                        break;
                    case 'subtitleDelay':
                        if (loaded) {
                            if (!isNaN(arguments[2])) {
                                subtitles.delay = arguments[2];
                                onSubtitleDelayChanged();
                                updateSubtitleText();
                            }
                        }
                        break;
                    case 'subtitleSize':
                        if (!isNaN(arguments[2])) {
                            subtitles.size = arguments[2];
                            onSubtitleSizeChanged();
                        }
                        return;
                    case 'subtitleDarkBackground':
                        subtitles.darkBackground = arguments[2];
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
                            subtitles.addTracks(arguments[2]);
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
                        videoElement.removeEventListener('error', onVideoError);
                        videoElement.removeEventListener('timeupdate', updateSubtitleText);
                        subtitles.removeListener('error', onSubtitlesError);
                        subtitles.removeListener('load', updateSubtitleText);
                        loaded = false;
                        dispatchArgsQueue = [];
                        subtitles.clearTracks();
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
                        videoElement.addEventListener('error', onVideoError);
                        videoElement.addEventListener('timeupdate', updateSubtitleText);
                        subtitles.addListener('error', onSubtitlesError);
                        subtitles.addListener('load', updateSubtitleText);
                        videoElement.autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                        videoElement.currentTime = !isNaN(arguments[3].time) ? arguments[3].time / 1000 : 0;
                        videoElement.src = arguments[2].url;
                        loaded = true;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onBufferingChanged();
                        onSubtitleDelayChanged();
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
                        subtitles.detachElements();
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

HTMLVideo.manifest = Object.freeze({
    name: 'HTMLVideo',
    embedded: true,
    props: Object.freeze(['paused', 'time', 'duration', 'volume', 'buffering', 'subtitleTracks', 'selectedSubtitleTrackId', 'subtitleSize', 'subtitleDelay', 'subtitleDarkBackground'])
});

module.exports = HTMLVideo;
