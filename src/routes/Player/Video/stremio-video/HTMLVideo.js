var EventEmitter = require('events');

var HTMLVideo = function(container) {
    var self = this;
    var events = new EventEmitter();
    var loaded = false;
    var destroyed = false;
    var dispatchArgsQueue = [];
    var subtitleTracks = [];
    var selectedSubtitleTrack = null;
    var styles = document.createElement('style');
    var video = document.createElement('video');

    container.appendChild(styles);
    styles.sheet.insertRule('#' + container.id + ' video { width: 100%; height: 100%; }', styles.sheet.cssRules.length);
    styles.sheet.insertRule('#' + container.id + ' video::cue { font-size: 22px; }', styles.sheet.cssRules.length);
    container.appendChild(video);
    video.crossOrigin = 'anonymous';
    video.controls = false;

    var getPaused = function() {
        if (!loaded) {
            return null;
        }

        return !!video.paused;
    };
    var getTime = function() {
        if (!loaded) {
            return null;
        }

        return Math.floor(video.currentTime * 1000);
    };
    var getDuration = function() {
        if (!loaded || isNaN(video.duration)) {
            return null;
        }

        return Math.floor(video.duration * 1000);
    };
    var getVolume = function() {
        return video.muted ? 0 : Math.floor(video.volume * 100);
    };
    var getSubtitleTracks = function() {
        return subtitleTracks.slice();
    };
    var getSelectedSubtitleTrack = function() {
        return selectedSubtitleTrack;
    };
    var onEnded = function() {
        events.emit('ended');
    };
    var onError = function() {
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
    };
    var onPausedChanged = function() {
        events.emit('propChanged', 'paused', getPaused());
    };
    var onTimeChanged = function() {
        events.emit('propChanged', 'time', getTime());
    };
    var onDurationChanged = function() {
        events.emit('propChanged', 'duration', getDuration());
    };
    var onVolumeChanged = function() {
        events.emit('propChanged', 'volume', getVolume());
    };
    var onSubtitleTracksChanged = function() {
        events.emit('propChanged', 'subtitleTracks', getSubtitleTracks());
    };
    var onSelectedSubtitleTrackChanged = function() {
        events.emit('propChanged', 'selectedSubtitleTrack', getSelectedSubtitleTrack());
    };
    var flushArgsQueue = function() {
        for (var i = 0; i < dispatchArgsQueue.length; i++) {
            self.dispatch.apply(self, dispatchArgsQueue[i]);
        }

        dispatchArgsQueue = [];
    };

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
                    case 'selectedSubtitleTrack':
                        events.emit('propValue', 'selectedSubtitleTrack', getSelectedSubtitleTrack());
                        return;
                    default:
                        throw new Error('observeProp not supported: ' + arguments[1]);
                }
                break;
            case 'setProp':
                switch (arguments[1]) {
                    case 'paused':
                        if (loaded) {
                            arguments[2] ? video.pause() : video.play();
                        }
                        break;
                    case 'time':
                        if (loaded) {
                            video.currentTime = arguments[2] / 1000;
                        }
                        break;
                    case 'volume':
                        video.muted = false;
                        video.volume = arguments[2] / 100;
                        return;
                    default:
                        throw new Error('setProp not supported: ' + arguments[1]);
                }
                break;
            case 'command':
                switch (arguments[1]) {
                    case 'addSubtitleTracks':
                        if (loaded) {
                            var uniqSubtitleIds = {};
                            subtitleTracks = subtitleTracks.concat(arguments[2])
                                .reduce(function(result, subtitleTrack) {
                                    if (!uniqSubtitleIds[subtitleTrack.id]) {
                                        uniqSubtitleIds[subtitleTrack.id] = true;
                                        result.push(Object.freeze(subtitleTrack));
                                    }

                                    return result;
                                }, []);
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
                        loaded = false;
                        dispatchArgsQueue = [];
                        subtitleTracks = [];
                        selectedSubtitleTrack = null;
                        while (video.hasChildNodes()) video.removeChild(video.lastChild);
                        video.removeAttribute('src');
                        video.load();
                        video.currentTime = 0;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onSubtitleTracksChanged();
                        onSelectedSubtitleTrackChanged();
                        return;
                    case 'load':
                        var dispatchArgsQueueCopy = dispatchArgsQueue.slice();
                        self.dispatch('command', 'stop');
                        dispatchArgsQueue = dispatchArgsQueueCopy;
                        video.addEventListener('ended', onEnded);
                        video.addEventListener('error', onError);
                        video.autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                        video.currentTime = !isNaN(arguments[3].time) ? arguments[3].time / 1000 : 0;
                        video.src = arguments[2].url;
                        loaded = true;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onSubtitleTracksChanged();
                        onSelectedSubtitleTrackChanged();
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
                        destroyed = true;
                        return;
                    default:
                        throw new Error('command not supported: ' + arguments[1]);
                }
                break;
            default:
                throw new Error('Invalid dispatch call: ' + arguments[0]);
        }

        if (!loaded) {
            dispatchArgsQueue.push(Array.from(arguments));
        }
    };
};

HTMLVideo.manifest = {
    name: 'HTMLVideo',
    embedded: true,
    props: ['paused', 'time', 'duration', 'volume', 'subtitleTracks', 'selectedSubtitleTrack']
};

module.exports = HTMLVideo;
