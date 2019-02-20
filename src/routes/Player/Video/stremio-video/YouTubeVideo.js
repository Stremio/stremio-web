var EventEmitter = require('events');
var HTMLSubtitles = require('./HTMLSubtitles');

function YouTubeVideo(containerElement) {
    if (!(containerElement instanceof HTMLElement)) {
        throw new Error('Instance of HTMLElement required as a first argument');
    }

    var self = this;
    var ready = false;
    var loaded = false;
    var destroyed = false;
    var events = new EventEmitter();
    var dispatchArgsReadyQueue = [];
    var dispatchArgsLoadedQueue = [];
    var pausedObserved = false;
    var timeObserved = false;
    var durationObserved = false;
    var bufferingObserved = false;
    var volumeObserved = false;
    var propChangedIntervalId = window.setInterval(onPropChangedInterval, 100);
    var subtitles = new HTMLSubtitles(containerElement);
    var video = null;
    var scriptElement = document.createElement('script');
    var stylesElement = document.createElement('style');
    var videoContainer = document.createElement('div');

    scriptElement.type = 'text/javascript';
    scriptElement.src = 'https://www.youtube.com/iframe_api';
    scriptElement.onload = onYouTubePlayerApiLoaded;
    scriptElement.onerror = onYouTubePlayerApiError;
    containerElement.appendChild(scriptElement);
    containerElement.appendChild(stylesElement);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .video { position: absolute; width: 100%; height: 100%; z-index: -1; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(videoContainer);
    videoContainer.classList.add('video');
    subtitles.addListener('error', onSubtitlesError);
    subtitles.addListener('load', updateSubtitleText);
    events.addListener('error', function() { });

    function getPaused() {
        if (!loaded) {
            return null;
        }

        return video.getPlayerState() !== YT.PlayerState.PLAYING;
    }
    function getTime() {
        if (!loaded) {
            return null;
        }

        return Math.floor(video.getCurrentTime() * 1000);
    }
    function getDuration() {
        if (!loaded) {
            return null;
        }

        return Math.floor(video.getDuration() * 1000);
    }
    function getBuffering() {
        if (!loaded) {
            return null;
        }

        return video.getPlayerState() === YT.PlayerState.BUFFERING;
    }
    function getVolume() {
        if (!ready || destroyed) {
            return null;
        }

        return video.isMuted() ? 0 : video.getVolume();
    }
    function getSubtitleTracks() {
        if (!loaded) {
            return Object.freeze([]);
        }

        var embeddedTracks = (video.getOption('captions', 'tracklist') || [])
            .map(function(track) {
                return {
                    id: track.languageCode,
                    origin: 'EMBEDDED',
                    label: track.languageName
                };
            });
        var extraTracks = subtitles.dispatch('getProp', 'tracks');
        var allTracks = embeddedTracks.concat(extraTracks)
            .filter(function(track, index, tracks) {
                for (var i = 0; i < tracks.length; i++) {
                    if (tracks[i].id === track.id) {
                        return i === index;
                    }
                }

                return false;
            });
        return allTracks;
    }
    function getSelectedSubtitleTrackId() {
        if (!loaded) {
            return null;
        }

        return subtitles.dispatch('getProp', 'selectedTrackId');
    }
    function getSubtitleSize() {
        if (!ready || destroyed) {
            return null;
        }

        return subtitles.dispatch('getProp', 'size');
    }
    function getSubtitleDelay() {
        if (!loaded) {
            return null;
        }

        return subtitles.dispatch('getProp', 'delay');
    }
    function getSubtitleDarkBackground() {
        if (!ready || destroyed) {
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
    function onSubtitleSizeChanged() {
        events.emit('propChanged', 'subtitleSize', getSubtitleSize());
    }
    function onSubtitleDelayChanged() {
        events.emit('propChanged', 'subtitleDelay', getSubtitleDelay());
    }
    function onSubtitleDarkBackgroundChanged() {
        events.emit('propChanged', 'subtitleDarkBackground', getSubtitleDarkBackground());
    }
    function onSubtitlesError(error) {
        var code;
        var message;
        switch (error.code) {
            case HTMLSubtitles.ERROR.SUBTITLES_FETCH_FAILED: {
                code = HTMLSubtitles.ERROR.SUBTITLES_FETCH_FAILED;
                message = 'Failed to fetch subtitles from ' + error.track.origin;
                break;
            }
            case HTMLSubtitles.ERROR.SUBTITLES_PARSE_FAILED: {
                code = HTMLSubtitles.ERROR.SUBTITLES_PARSE_FAILED;
                message = 'Failed to parse subtitles from ' + error.track.origin;
                break;
            }
            default: {
                code = -1;
                message = 'Unknown subtitles error';
            }
        }

        onError({
            code: code,
            message: message,
            critical: false
        });
    }
    function onYouTubePlayerApiError() {
        onError({
            code: YouTubeVideo.ERROR.API_LOAD_FAILED,
            message: 'YouTube player API failed to load',
            critical: true
        });
    }
    function onYouTubePlayerApiLoaded() {
        if (destroyed) {
            return;
        }

        if (!YT) {
            onYouTubePlayerApiError();
            return;
        }

        YT.ready(() => {
            if (destroyed) {
                return;
            }

            video = new YT.Player(videoContainer, {
                height: '100%',
                width: '100%',
                playerVars: {
                    autoplay: 1,
                    cc_load_policy: 3,
                    controls: 0,
                    disablekb: 1,
                    enablejsapi: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    loop: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0
                },
                events: {
                    onError: onVideoError,
                    onReady: onVideoReady,
                    onStateChange: onVideoStateChange,
                    onApiChange: onVideoApiChange
                }
            });
        });
    }
    function onVideoError(error) {
        var code;
        var message;
        switch (error.data) {
            case YouTubeVideo.ERROR.INVALID_REQUEST: {
                code = YouTubeVideo.ERROR.INVALID_REQUEST;
                message = 'Invalid request';
                break;
            }
            case YouTubeVideo.ERROR.CONTENT_CANNOT_BE_PLAYED: {
                code = YouTubeVideo.ERROR.CONTENT_CANNOT_BE_PLAYED;
                message = 'The requested content cannot be played';
                break;
            }
            case YouTubeVideo.ERROR.REMOVED_VIDEO: {
                code = YouTubeVideo.ERROR.REMOVED_VIDEO;
                message = 'The video has been removed or marked as private';
                break;
            }
            case YouTubeVideo.ERROR.CONTENT_CANNOT_BE_EMBEDDED1:
            case YouTubeVideo.ERROR.CONTENT_CANNOT_BE_EMBEDDED2: {
                code = YouTubeVideo.ERROR.CONTENT_CANNOT_BE_EMBEDDED1;
                message = 'The video cannot be played in embedded players';
                break;
            }
            default: {
                code = -1;
                message = 'Unknown video error';
            }
        }

        onError({
            code: code,
            message: message,
            critical: true
        });
    }
    function onVideoReady() {
        ready = true;
        onVolumeChanged();
        onSubtitleSizeChanged();
        onSubtitleDarkBackgroundChanged();
        flushDispatchArgsQueue(dispatchArgsReadyQueue);
    }
    function onVideoStateChange(state) {
        if (bufferingObserved) {
            onBufferingChanged();
        }

        switch (state.data) {
            case YT.PlayerState.ENDED: {
                onEnded();
                break;
            }
            case YT.PlayerState.PAUSED:
            case YT.PlayerState.PLAYING: {
                if (pausedObserved) {
                    onPausedChanged();
                }

                if (timeObserved) {
                    onTimeChanged();
                }

                if (durationObserved) {
                    onDurationChanged();
                }

                break;
            }
            case YT.PlayerState.UNSTARTED: {
                if (pausedObserved) {
                    onPausedChanged();
                }

                break;
            }
        }
    }
    function onVideoApiChange() {
        video.loadModule('captions');
        onSubtitleTracksChanged();
    }
    function onPropChangedInterval() {
        if (timeObserved) {
            onTimeChanged();
        }

        if (durationObserved) {
            onDurationChanged();
        }

        if (volumeObserved) {
            onVolumeChanged();
        }

        updateSubtitleText();
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
            case 'observeProp': {
                switch (arguments[1]) {
                    case 'paused': {
                        events.emit('propValue', 'paused', getPaused());
                        pausedObserved = true;
                        return;
                    }
                    case 'time': {
                        events.emit('propValue', 'time', getTime());
                        timeObserved = true;
                        return;
                    }
                    case 'duration': {
                        events.emit('propValue', 'duration', getDuration());
                        durationObserved = true;
                        return;
                    }
                    case 'buffering': {
                        events.emit('propValue', 'duration', getBuffering());
                        bufferingObserved = true;
                        return;
                    }
                    case 'volume': {
                        events.emit('propValue', 'volume', getVolume());
                        volumeObserved = true;
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
                    case 'subtitleSize': {
                        events.emit('propValue', 'subtitleSize', getSubtitleSize());
                        return;
                    }
                    case 'subtitleDelay': {
                        events.emit('propValue', 'subtitleDelay', getSubtitleDelay());
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
                            arguments[2] ? video.pauseVideo() : video.playVideo();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'time': {
                        if (loaded) {
                            if (!isNaN(arguments[2])) {
                                video.seekTo(arguments[2] / 1000);
                            }
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'volume': {
                        if (ready) {
                            if (!isNaN(arguments[2])) {
                                video.unMute();
                                video.setVolume(Math.max(0, Math.min(100, arguments[2])));
                            }
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'selectedSubtitleTrackId': {
                        if (loaded) {
                            video.setOption('captions', 'track', arguments[2]);
                            subtitles.dispatch('setProp', 'selectedTrackId', arguments[2]);
                            onSubtitleDelayChanged();
                            onSelectedSubtitleTrackIdChanged();
                            updateSubtitleText();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'subtitleSize': {
                        if (ready) {
                            subtitles.dispatch('setProp', 'size', arguments[2]);
                            onSubtitleSizeChanged();
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
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
                    case 'subtitleDarkBackground': {
                        if (ready) {
                            subtitles.dispatch('setProp', 'darkBackground', arguments[2]);
                            onSubtitleDarkBackgroundChanged();
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
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
                        if (ready) {
                            video.mute();
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'unmute': {
                        if (ready) {
                            video.unMute();
                            if (video.getVolume() === 0) {
                                video.setVolume(50);
                            }
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'stop': {
                        loaded = false;
                        dispatchArgsLoadedQueue = [];
                        subtitles.dispatch('command', 'clearTracks');
                        if (ready) {
                            video.stopVideo();
                        }
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
                        if (ready) {
                            var dispatchArgsLoadedQueueCopy = dispatchArgsLoadedQueue.slice();
                            self.dispatch('command', 'stop');
                            dispatchArgsLoadedQueue = dispatchArgsLoadedQueueCopy;
                            var autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                            var time = !isNaN(arguments[3].time) ? arguments[3].time / 1000 : 0;
                            if (autoplay) {
                                video.loadVideoById({
                                    videoId: arguments[2].ytId,
                                    startSeconds: time
                                });
                            } else {
                                video.cueVideoById({
                                    videoId: arguments[2].ytId,
                                    startSeconds: time
                                });
                            }
                            loaded = true;
                            onPausedChanged();
                            onTimeChanged();
                            onDurationChanged();
                            onBufferingChanged();
                            onSubtitleDelayChanged();
                            updateSubtitleText();
                            flushDispatchArgsQueue(dispatchArgsLoadedQueue);
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'destroy': {
                        self.dispatch('command', 'stop');
                        destroyed = true;
                        onVolumeChanged();
                        onSubtitleSizeChanged();
                        onSubtitleDarkBackgroundChanged();
                        events.removeAllListeners();
                        clearInterval(propChangedIntervalId);
                        if (ready) {
                            video.destroy();
                        }
                        containerElement.removeChild(scriptElement);
                        containerElement.removeChild(videoContainer);
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

YouTubeVideo.ERROR = Object.freeze({
    API_LOAD_FAILED: 12,
    INVALID_REQUEST: 2,
    CONTENT_CANNOT_BE_PLAYED: 5,
    REMOVED_VIDEO: 100,
    CONTENT_CANNOT_BE_EMBEDDED1: 101,
    CONTENT_CANNOT_BE_EMBEDDED2: 150
});

YouTubeVideo.manifest = Object.freeze({
    name: 'YouTubeVideo',
    embedded: true,
    props: Object.freeze(['paused', 'time', 'duration', 'volume', 'buffering', 'subtitleTracks', 'selectedSubtitleTrackId', 'subtitleSize', 'subtitleDelay', 'subtitleDarkBackground'])
});

Object.freeze(YouTubeVideo);

module.exports = YouTubeVideo;
