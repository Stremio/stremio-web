var EventEmitter = require('events');
var HTMLSubtitles = require('./HTMLSubtitles');

function YouTubeVideo(options) {
    var containerElement = options && options.containerElement;
    if (!(containerElement instanceof HTMLElement) || !containerElement.hasAttribute('id')) {
        throw new Error('Instance of HTMLElement with id attribute required');
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
    var embeddedSubtitlesSelectedTrackId = null;
    var subtitles = new HTMLSubtitles(containerElement);
    var video = null;
    var scriptElement = document.createElement('script');
    var stylesElement = document.createElement('style');
    var videoContainer = document.createElement('div');

    events.on('error', function() { });
    subtitles.on('error', onSubtitlesError);
    subtitles.on('load', updateSubtitleText);
    scriptElement.type = 'text/javascript';
    scriptElement.src = 'https://www.youtube.com/iframe_api';
    scriptElement.onload = onYouTubePlayerApiLoaded;
    scriptElement.onerror = onYouTubePlayerApiError;
    containerElement.appendChild(scriptElement);
    containerElement.appendChild(stylesElement);
    stylesElement.sheet.insertRule('#' + containerElement.id + ' .video { position: absolute; width: 100%; height: 100%; z-index: -1; }', stylesElement.sheet.cssRules.length);
    containerElement.appendChild(videoContainer);
    videoContainer.classList.add('video');

    function getPaused() {
        if (!loaded) {
            return null;
        }

        return video.getPlayerState() !== YT.PlayerState.PLAYING;
    }
    function getTime() {
        if (!loaded || isNaN(video.getCurrentTime()) || video.getCurrentTime() === null) {
            return null;
        }

        return Math.floor(video.getCurrentTime() * 1000);
    }
    function getDuration() {
        if (!loaded || isNaN(video.getDuration()) || video.getDuration() === null) {
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
        if (!ready || destroyed || isNaN(video.getVolume()) || video.getVolume() === null) {
            return null;
        }

        return video.isMuted() ? 0 : video.getVolume();
    }
    function getSubtitlesTracks() {
        if (!loaded) {
            return Object.freeze([]);
        }

        var embeddedTracks = (video.getOption('captions', 'tracklist') || [])
            .map(function(track) {
                return Object.freeze({
                    id: track.languageCode,
                    origin: 'EMBEDDED IN VIDEO',
                    label: track.languageName
                });
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
        return Object.freeze(allTracks);
    }
    function getSelectedSubtitlesTrackId() {
        if (!loaded) {
            return null;
        }

        return embeddedSubtitlesSelectedTrackId !== null ?
            embeddedSubtitlesSelectedTrackId
            :
            subtitles.dispatch('getProp', 'selectedTrackId');
    }
    function getSubtitlesDelay() {
        if (!loaded) {
            return null;
        }

        return embeddedSubtitlesSelectedTrackId !== null ?
            null
            :
            subtitles.dispatch('getProp', 'delay');
    }
    function getsubtitlesSize() {
        if (!ready || destroyed) {
            return null;
        }

        return subtitles.dispatch('getProp', 'size');
    }
    function getSubtitlesDarkBackground() {
        if (!ready || destroyed) {
            return null;
        }

        return embeddedSubtitlesSelectedTrackId !== null ?
            null
            :
            subtitles.dispatch('getProp', 'darkBackground');
    }
    function getSubtitleOffset() {
        if (!ready || destroyed) {
            return null;
        }

        return embeddedSubtitlesSelectedTrackId !== null ?
            null
            :
            subtitles.dispatch('getProp', 'offset');
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
    function onSubtitlesTracksChanged() {
        events.emit('propChanged', 'subtitlesTracks', getSubtitlesTracks());
    }
    function onSelectedSubtitlesTrackIdChanged() {
        events.emit('propChanged', 'selectedSubtitlesTrackId', getSelectedSubtitlesTrackId());
    }
    function onSubtitlesDelayChanged() {
        events.emit('propChanged', 'subtitlesDelay', getSubtitlesDelay());
    }
    function onsubtitlesSizeChanged() {
        events.emit('propChanged', 'subtitlesSize', getsubtitlesSize());
    }
    function onSubtitlesDarkBackgroundChanged() {
        events.emit('propChanged', 'subtitlesDarkBackground', getSubtitlesDarkBackground());
    }
    function onSubtitleOffsetChanged() {
        events.emit('propChanged', 'subtitleOffset', getSubtitleOffset());
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

        YT.ready(function() {
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
        onsubtitlesSizeChanged();
        onSubtitlesDarkBackgroundChanged();
        onSubtitleOffsetChanged();
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
        onSubtitlesTracksChanged();
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
                        events.emit('propValue', 'buffering', getBuffering());
                        bufferingObserved = true;
                        return;
                    }
                    case 'volume': {
                        events.emit('propValue', 'volume', getVolume());
                        volumeObserved = true;
                        return;
                    }
                    case 'subtitlesTracks': {
                        events.emit('propValue', 'subtitlesTracks', getSubtitlesTracks());
                        return;
                    }
                    case 'selectedSubtitlesTrackId': {
                        events.emit('propValue', 'selectedSubtitlesTrackId', getSelectedSubtitlesTrackId());
                        return;
                    }
                    case 'subtitlesDelay': {
                        events.emit('propValue', 'subtitlesDelay', getSubtitlesDelay());
                        return;
                    }
                    case 'subtitlesSize': {
                        events.emit('propValue', 'subtitlesSize', getsubtitlesSize());
                        return;
                    }
                    case 'subtitlesDarkBackground': {
                        events.emit('propValue', 'subtitlesDarkBackground', getSubtitlesDarkBackground());
                        return;
                    }
                    case 'subtitleOffset': {
                        events.emit('propValue', 'subtitleOffset', getSubtitleOffset());
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
                            if (!isNaN(arguments[2]) && arguments[2] !== null) {
                                video.seekTo(arguments[2] / 1000);
                            }
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'volume': {
                        if (ready) {
                            if (!isNaN(arguments[2]) && arguments[2] !== null) {
                                video.unMute();
                                video.setVolume(Math.max(0, Math.min(100, arguments[2])));
                            }
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'selectedSubtitlesTrackId': {
                        if (loaded) {
                            embeddedSubtitlesSelectedTrackId = null;
                            var tracks = getSubtitlesTracks();
                            for (var i = 0; i < tracks.length; i++) {
                                if (tracks[i].id === arguments[2] && tracks[i].origin === 'EMBEDDED IN VIDEO') {
                                    embeddedSubtitlesSelectedTrackId = tracks[i].id;
                                    break;
                                }
                            }

                            video.setOption('captions', 'track', { languageCode: arguments[2] });
                            subtitles.dispatch('setProp', 'selectedTrackId', arguments[2]);
                            onSubtitlesDelayChanged();
                            onSubtitlesDarkBackgroundChanged();
                            onSelectedSubtitlesTrackIdChanged();
                            updateSubtitleText();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'subtitlesDelay': {
                        if (loaded) {
                            subtitles.dispatch('setProp', 'delay', arguments[2]);
                            onSubtitlesDelayChanged();
                            updateSubtitleText();
                        } else {
                            dispatchArgsLoadedQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'subtitlesSize': {
                        if (ready) {
                            subtitles.dispatch('setProp', 'size', arguments[2]);
                            video.setOption('captions', 'fontSize', Math.max(1, Math.min(5, Math.floor(arguments[2]))) - 2);
                            onsubtitlesSizeChanged();
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'subtitlesDarkBackground': {
                        if (ready) {
                            subtitles.dispatch('setProp', 'darkBackground', arguments[2]);
                            onSubtitlesDarkBackgroundChanged();
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'subtitleOffset': {
                        if (ready) {
                            subtitles.dispatch('setProp', 'offset', arguments[2]);
                            onSubtitleOffsetChanged();
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
                    case 'addSubtitlesTracks': {
                        if (loaded) {
                            subtitles.dispatch('command', 'addTracks', arguments[2]);
                            onSubtitlesTracksChanged();
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
                        onSubtitlesTracksChanged();
                        onSelectedSubtitlesTrackIdChanged();
                        onSubtitlesDelayChanged();
                        updateSubtitleText();
                        return;
                    }
                    case 'load': {
                        if (ready) {
                            var dispatchArgsLoadedQueueCopy = dispatchArgsLoadedQueue.slice();
                            self.dispatch('command', 'stop');
                            dispatchArgsLoadedQueue = dispatchArgsLoadedQueueCopy;
                            var autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                            var time = !isNaN(arguments[3].time) && arguments[3].time !== null ? arguments[3].time / 1000 : 0;
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
                            onSubtitlesTracksChanged();
                            onSelectedSubtitlesTrackIdChanged();
                            onSubtitlesDelayChanged();
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
                        onsubtitlesSizeChanged();
                        onSubtitlesDarkBackgroundChanged();
                        onSubtitleOffsetChanged();
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
    props: Object.freeze(['paused', 'time', 'duration', 'volume', 'buffering', 'subtitlesTracks', 'selectedSubtitlesTrackId', 'subtitlesSize', 'subtitlesDelay', 'subtitlesDarkBackground', 'subtitleOffset'])
});

Object.freeze(YouTubeVideo);

module.exports = YouTubeVideo;
