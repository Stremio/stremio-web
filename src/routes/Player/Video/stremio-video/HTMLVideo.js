var EventEmitter = require('events');
var HTMLSubtitles = require('./HTMLSubtitles');

function HTMLVideo(containerElement) {
    if (!(containerElement instanceof HTMLElement) || !containerElement.hasAttribute('id')) {
        throw new Error('Instance of HTMLElement with id attribute required as a first argument');
    }

    var self = this;
    var loaded = false;
    var destroyed = false;
    var events = new EventEmitter();
    var dispatchArgsLoadedQueue = [];
    var subtitles = new HTMLSubtitles(containerElement);
    var stylesElement = document.createElement('style');
    var videoElement = document.createElement('video');

    events.on('error', function() { });
    subtitles.on('error', onSubtitlesError);
    subtitles.on('load', updateSubtitleText);
    containerElement.appendChild(stylesElement);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .video { position: absolute; width: 100%; height: 100%; z-index: -1; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(videoElement);
    videoElement.classList.add('video');
    videoElement.crossOrigin = 'anonymous';
    videoElement.controls = false;
    videoElement.addEventListener('ended', onEnded);
    videoElement.addEventListener('error', onVideoError);
    videoElement.addEventListener('timeupdate', updateSubtitleText);

    function getPaused() {
        if (!loaded) {
            return null;
        }

        return !!videoElement.paused;
    }
    function getTime() {
        if (!loaded || isNaN(videoElement.currentTime) || videoElement.currentTime === null) {
            return null;
        }

        return Math.floor(videoElement.currentTime * 1000);
    }
    function getDuration() {
        if (!loaded || isNaN(videoElement.duration) || videoElement.duration === null) {
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
        if (destroyed || isNaN(videoElement.volume) || videoElement.volume === null) {
            return null;
        }

        return videoElement.muted ? 0 : Math.floor(videoElement.volume * 100);
    }
    function getSubtitleTracks() {
        if (!loaded) {
            return Object.freeze([]);
        }

        return subtitles.dispatch('getProp', 'tracks');
    }
    function getSelectedSubtitleTrackId() {
        if (!loaded) {
            return null;
        }

        return subtitles.dispatch('getProp', 'selectedTrackId');
    }
    function getSubtitleDelay() {
        if (!loaded) {
            return null;
        }

        return subtitles.dispatch('getProp', 'delay');
    }
    function getSubtitleSize() {
        if (destroyed) {
            return null;
        }

        return subtitles.dispatch('getProp', 'size');
    }
    function getSubtitleDarkBackground() {
        if (destroyed) {
            return null;
        }

        return subtitles.dispatch('getProp', 'darkBackground');
    }
    function onEnded() {
        events.emit('ended');
    }
    function onError(error) {
        Object.freeze(error);
        events.emit('error', error);
        if (error.critical) {
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
    function onSubtitlesError(error) {
        var code;
        var message;
        switch (error.code) {
            case HTMLSubtitles.ERROR.SUBTITLES_FETCH_FAILED:
                code = HTMLSubtitles.ERROR.SUBTITLES_FETCH_FAILED;
                message = 'Failed to fetch subtitles from ' + error.track.origin;
                break;
            case HTMLSubtitles.ERROR.SUBTITLES_PARSE_FAILED:
                code = HTMLSubtitles.ERROR.SUBTITLES_PARSE_FAILED;
                message = 'Failed to parse subtitles from ' + error.track.origin;
                break;
            default:
                code = -1;
                message = 'Unknown subtitles error';
        }

        onError({
            code: code,
            message: message,
            critical: false
        });
    }
    function onVideoError() {
        var code;
        var message;
        switch (videoElement.error.code) {
            case HTMLVideo.ERROR.FETCH_ABORTED:
                code = HTMLVideo.ERROR.FETCH_ABORTED;
                message = 'Fetching process aborted';
                break;
            case HTMLVideo.ERROR.DOWNLOAD_FAILED:
                code = HTMLVideo.ERROR.DOWNLOAD_FAILED;
                message = 'Error occurred when downloading';
                break;
            case HTMLVideo.ERROR.DECODING_FAILED:
                code = HTMLVideo.ERROR.DECODING_FAILED;
                message = 'Error occurred when decoding';
                break;
            case HTMLVideo.ERROR.VIDEO_NOT_SUPPORTED:
                code = HTMLVideo.ERROR.VIDEO_NOT_SUPPORTED;
                message = 'Video is not supported';
                break;
            default:
                code = -1;
                message = 'Unknown error';
        }

        onError({
            code: code,
            message: message,
            critical: true
        });
    }
    function updateSubtitleText() {
        subtitles.dispatch('command', 'updateText', getTime());
    }
    function flushDispatchArgsQueue(dispatchArgsQueue) {
        while (dispatchArgsQueue.length > 0) {
            var args = dispatchArgsQueue.shift();
            self.dispatch.apply(self, args);
        }
    }

    this.on = function(eventName, listener) {
        if (destroyed) {
            throw new Error('Unable to add ' + eventName + ' listener');
        }

        events.on(eventName, listener);
    };

    this.dispatch = function() {
        if (destroyed) {
            throw new Error('Unable to dispatch ' + arguments[0]);
        }

        switch (arguments[0]) {
            case 'observeProp': {
                switch (arguments[1]) {
                    case 'paused': {
                        events.emit('propValue', 'paused', getPaused());
                        videoElement.removeEventListener('pause', onPausedChanged);
                        videoElement.removeEventListener('play', onPausedChanged);
                        videoElement.addEventListener('pause', onPausedChanged);
                        videoElement.addEventListener('play', onPausedChanged);
                        return;
                    }
                    case 'time': {
                        events.emit('propValue', 'time', getTime());
                        videoElement.removeEventListener('timeupdate', onTimeChanged);
                        videoElement.addEventListener('timeupdate', onTimeChanged);
                        return;
                    }
                    case 'duration': {
                        events.emit('propValue', 'duration', getDuration());
                        videoElement.removeEventListener('durationchange', onDurationChanged);
                        videoElement.addEventListener('durationchange', onDurationChanged);
                        return;
                    }
                    case 'buffering': {
                        events.emit('propValue', 'buffering', getBuffering());
                        videoElement.removeEventListener('waiting', onBufferingChanged);
                        videoElement.addEventListener('waiting', onBufferingChanged);
                        videoElement.removeEventListener('playing', onBufferingChanged);
                        videoElement.addEventListener('playing', onBufferingChanged);
                        videoElement.removeEventListener('loadeddata', onBufferingChanged);
                        videoElement.addEventListener('loadeddata', onBufferingChanged);
                        return;
                    }
                    case 'volume': {
                        events.emit('propValue', 'volume', getVolume());
                        videoElement.removeEventListener('volumechange', onVolumeChanged);
                        videoElement.addEventListener('volumechange', onVolumeChanged);
                        return;
                    }
                    case 'subtitleTracks': {
                        events.emit('propValue', 'subtitleTracks', getSubtitleTracks());
                        return;
                    }
                    case 'selectedSubtitleTrackId': {
                        events.emit('propValue', 'selectedSubtitleTrackId', getSelectedSubtitleTrackId());
                        return;
                    }
                    case 'subtitleDelay': {
                        events.emit('propValue', 'subtitleDelay', getSubtitleDelay());
                        return;
                    }
                    case 'subtitleSize': {
                        events.emit('propValue', 'subtitleSize', getSubtitleSize());
                        return;
                    }
                    case 'subtitleDarkBackground': {
                        events.emit('propValue', 'subtitleDarkBackground', getSubtitleDarkBackground());
                        return;
                    }
                    default: {
                        throw new Error('observeProp not supported: ' + arguments[1]);
                    }
                }
            }
            case 'setProp': {
                switch (arguments[1]) {
                    case 'paused': {
                        if (loaded) {
                            arguments[2] ? videoElement.pause() : videoElement.play();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'time': {
                        if (loaded) {
                            if (!isNaN(arguments[2]) && arguments[2] !== null) {
                                videoElement.currentTime = arguments[2] / 1000;
                            }
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'volume': {
                        if (!isNaN(arguments[2]) && arguments[2] !== null) {
                            videoElement.muted = false;
                            videoElement.volume = Math.max(0, Math.min(100, arguments[2])) / 100;
                        }

                        return;
                    }
                    case 'selectedSubtitleTrackId': {
                        if (loaded) {
                            subtitles.dispatch('setProp', 'selectedTrackId', arguments[2]);
                            onSubtitleDelayChanged();
                            onSelectedSubtitleTrackIdChanged();
                            updateSubtitleText();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'subtitleDelay': {
                        if (loaded) {
                            subtitles.dispatch('setProp', 'delay', arguments[2]);
                            onSubtitleDelayChanged();
                            updateSubtitleText();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'subtitleSize': {
                        subtitles.dispatch('setProp', 'size', arguments[2]);
                        onSubtitleSizeChanged();
                        return;
                    }
                    case 'subtitleDarkBackground': {
                        subtitles.dispatch('setProp', 'darkBackground', arguments[2]);
                        onSubtitleDarkBackgroundChanged();
                        return;
                    }
                    default: {
                        throw new Error('setProp not supported: ' + arguments[1]);
                    }
                }
            }
            case 'command': {
                switch (arguments[1]) {
                    case 'addSubtitleTracks': {
                        if (loaded) {
                            subtitles.dispatch('command', 'addTracks', arguments[2]);
                            onSubtitleTracksChanged();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'mute': {
                        videoElement.muted = true;
                        return;
                    }
                    case 'unmute': {
                        videoElement.muted = false;
                        if (videoElement.volume === 0) {
                            videoElement.volume = 0.5;
                        }

                        return;
                    }
                    case 'stop': {
                        loaded = false;
                        dispatchArgsLoadedQueue = [];
                        subtitles.dispatch('command', 'clearTracks');
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
                    }
                    case 'load': {
                        var dispatchArgsLoadedQueueCopy = dispatchArgsLoadedQueue.slice();
                        self.dispatch('command', 'stop');
                        dispatchArgsLoadedQueue = dispatchArgsLoadedQueueCopy;
                        videoElement.autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                        videoElement.currentTime = !isNaN(arguments[3].time) && arguments[3].time !== null ? arguments[3].time / 1000 : 0;
                        videoElement.src = arguments[2].url;
                        loaded = true;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onBufferingChanged();
                        onSubtitleTracksChanged();
                        onSelectedSubtitleTrackIdChanged();
                        onSubtitleDelayChanged();
                        updateSubtitleText();
                        flushDispatchArgsQueue(dispatchArgsLoadedQueue);
                        return;
                    }
                    case 'destroy': {
                        self.dispatch('command', 'stop');
                        destroyed = true;
                        onVolumeChanged();
                        onSubtitleSizeChanged();
                        onSubtitleDarkBackgroundChanged();
                        events.removeAllListeners();
                        videoElement.removeEventListener('ended', onEnded);
                        videoElement.removeEventListener('error', onVideoError);
                        videoElement.removeEventListener('timeupdate', updateSubtitleText);
                        videoElement.removeEventListener('pause', onPausedChanged);
                        videoElement.removeEventListener('play', onPausedChanged);
                        videoElement.removeEventListener('timeupdate', onTimeChanged);
                        videoElement.removeEventListener('durationchange', onDurationChanged);
                        videoElement.removeEventListener('waiting', onBufferingChanged);
                        videoElement.removeEventListener('playing', onBufferingChanged);
                        videoElement.removeEventListener('loadeddata', onBufferingChanged);
                        videoElement.removeEventListener('volumechange', onVolumeChanged);
                        containerElement.removeChild(videoElement);
                        containerElement.removeChild(stylesElement);
                        subtitles.dispatch('command', 'destroy');
                        return;
                    }
                    default: {
                        throw new Error('command not supported: ' + arguments[1]);
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

HTMLVideo.ERROR = Object.freeze({
    FETCH_ABORTED: 1,
    DOWNLOAD_FAILED: 2,
    DECODING_FAILED: 3,
    VIDEO_NOT_SUPPORTED: 4
});

HTMLVideo.manifest = Object.freeze({
    name: 'HTMLVideo',
    embedded: true,
    props: Object.freeze(['paused', 'time', 'duration', 'volume', 'buffering', 'subtitleTracks', 'selectedSubtitleTrackId', 'subtitleSize', 'subtitleDelay', 'subtitleDarkBackground'])
});

Object.freeze(HTMLVideo);

module.exports = HTMLVideo;
