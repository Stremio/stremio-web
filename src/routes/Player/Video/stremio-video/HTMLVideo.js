var EventEmitter = require('events');

var HTMLVideo = function(containerElement) {
    var self = this;
    var style = document.createElement('style');
    containerElement.appendChild(style);
    style.sheet.insertRule('#' + containerElement.id + ' video { width: 100%; height: 100%; }', style.sheet.cssRules.length);
    style.sheet.insertRule('#' + containerElement.id + ' video::cue { font-size: 22px; }', style.sheet.cssRules.length);
    var videoElement = document.createElement('video');
    containerElement.appendChild(videoElement);
    videoElement.crossOrigin = 'anonymous';
    var events = new EventEmitter();
    var loaded = false;
    var destroyed = false;
    var dispatchArgsQueue = [];
    var getPaused = function() {
        if (!loaded) {
            return null;
        }

        return !!videoElement.paused;
    };
    var getTime = function() {
        if (!loaded) {
            return null;
        }

        return Math.floor(videoElement.currentTime * 1000);
    };
    var getDuration = function() {
        if (!loaded || isNaN(videoElement.duration)) {
            return null;
        }

        return Math.floor(videoElement.duration * 1000);
    };
    var getVolume = function() {
        return videoElement.muted ? 0 : Math.floor(videoElement.volume * 100);
    };
    var getSubtitles = function() {
        return [];
    };
    var onEnded = function() {
        events.emit('ended');
    };
    var onError = function() {
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
    };
    var flushArgsQueue = function() {
        for (var i = 0; i < dispatchArgsQueue.length; i++) {
            self.dispatch.apply(self, dispatchArgsQueue[i]);
        }

        dispatchArgsQueue = [];
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
    var onSubtitlesChanged = function() {
        events.emit('propChanged', 'subtitles', getSubtitles());
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

        if (arguments[0] === 'observeProp') {
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
                case 'volume':
                    events.emit('propValue', 'volume', getVolume());
                    videoElement.removeEventListener('volumechange', onVolumeChanged);
                    videoElement.addEventListener('volumechange', onVolumeChanged);
                    return;
                case 'subtitles':
                    events.emit('propValue', 'subtitles', getSubtitles());
                    return;
                default:
                    throw new Error('observeProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'setProp') {
            switch (arguments[1]) {
                case 'paused':
                    if (loaded) {
                        arguments[2] ? videoElement.pause() : videoElement.play();
                    }
                    break;
                case 'time':
                    if (loaded) {
                        videoElement.currentTime = arguments[2] / 1000;
                    }
                    break;
                case 'volume':
                    videoElement.muted = false;
                    videoElement.volume = arguments[2] / 100;
                    return;
                default:
                    throw new Error('setProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'command') {
            switch (arguments[1]) {
                case 'mute':
                    videoElement.muted = true;
                    return;
                case 'unmute':
                    videoElement.volume = videoElement.volume !== 0 ? videoElement.volume : 0.5;
                    videoElement.muted = false;
                    return;
                case 'addExtraSubtitles':
                    if (loaded) {
                    }
                    break;
                case 'stop':
                    videoElement.removeEventListener('ended', onEnded);
                    videoElement.removeEventListener('error', onError);
                    loaded = false;
                    videoElement.removeAttribute('src');
                    videoElement.load();
                    videoElement.currentTime = 0;
                    onPausedChanged();
                    onTimeChanged();
                    onDurationChanged();
                    onSubtitlesChanged();
                    return;
                case 'load':
                    self.dispatch('command', 'stop');
                    videoElement.addEventListener('ended', onEnded);
                    videoElement.addEventListener('error', onError);
                    videoElement.autoplay = typeof arguments[3].autoplay === 'boolean' ? arguments[3].autoplay : true;
                    videoElement.currentTime = !isNaN(arguments[3].time) ? arguments[3].time / 1000 : 0;
                    videoElement.src = arguments[2].url;
                    loaded = true;
                    onPausedChanged();
                    onTimeChanged();
                    onDurationChanged();
                    onSubtitlesChanged();
                    flushArgsQueue();
                    return;
                case 'destroy':
                    self.dispatch('command', 'stop');
                    events.removeAllListeners();
                    videoElement.removeEventListener('pause', onPausedChanged);
                    videoElement.removeEventListener('play', onPausedChanged);
                    videoElement.removeEventListener('timeupdate', onTimeChanged);
                    videoElement.removeEventListener('durationchange', onDurationChanged);
                    videoElement.removeEventListener('volumechange', onVolumeChanged);
                    destroyed = true;
                    return;
                default:
                    throw new Error('command not supported: ' + arguments[1]);
            }
        }

        if (!loaded) {
            dispatchArgsQueue.push(Array.from(arguments));
        }
    };
};

HTMLVideo.manifest = {
    name: 'HTMLVideo',
    embedded: true,
    props: ['paused', 'time', 'duration', 'volume', 'subtitles']
};

module.exports = HTMLVideo;
