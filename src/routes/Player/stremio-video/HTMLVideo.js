var EventEmitter = require('events');

var HTMLVideo = function(videoElement) {
    var events = new EventEmitter();
    var onEnded = function() {
        events.emit('ended');
    };
    var onError = function() {
        var message;
        var critical;
        switch (videoElement.error.code) {
            case 4:
                message = 'video not supported';
                critical = true;
                break;
            case 3:
                message = 'error occurred when decoding';
                critical = true;
                break;
            case 2:
                message = 'error occurred when downloading';
                critical = true;
                break;
            case 1:
                message = 'fetching process aborted by user';
                critical = false;
                break;
            default:
                message = 'unknown error';
                critical = false;
        };

        events.emit('error', {
            code: videoElement.error.code,
            message: message,
            critical: critical
        });
    };
    var onPausedChanged = function() {
        events.emit('propChanged', 'paused', videoElement.paused);
    };
    var onTimeChanged = function() {
        events.emit('propChanged', 'time', videoElement.currentTime * 1000);
    };
    var onDurationChanged = function() {
        events.emit('propChanged', 'duration', isNaN(videoElement.duration) ? null : videoElement.duration * 1000);
    };
    var onVolumeChanged = function() {
        events.emit('propChanged', 'volume', videoElement.volume);
    };

    videoElement.addEventListener('ended', onEnded);
    videoElement.addEventListener('error', onError);

    this.on = function(eventName, listener) {
        events.on(eventName, listener);
    };

    this.dispatch = function() {
        if (arguments[0] === 'observeProp') {
            switch (arguments[1]) {
                case 'paused':
                    events.emit('propValue', 'paused', videoElement.paused);
                    videoElement.removeEventListener('pause', onPausedChanged);
                    videoElement.removeEventListener('play', onPausedChanged);
                    videoElement.addEventListener('pause', onPausedChanged);
                    videoElement.addEventListener('play', onPausedChanged);
                    break;
                case 'time':
                    events.emit('propValue', 'time', videoElement.currentTime * 1000);
                    videoElement.removeEventListener('timeupdate', onTimeChanged);
                    videoElement.addEventListener('timeupdate', onTimeChanged);
                    break;
                case 'duration':
                    events.emit('propValue', 'duration', isNaN(videoElement.duration) ? null : videoElement.duration * 1000);
                    videoElement.removeEventListener('durationchange', onDurationChanged);
                    videoElement.addEventListener('durationchange', onDurationChanged);
                    break;
                case 'volume':
                    events.emit('propValue', 'volume', videoElement.volume);
                    videoElement.removeEventListener('volumechange', onVolumeChanged);
                    videoElement.addEventListener('volumechange', onVolumeChanged);
                    break;
                default:
                    throw new Error('observeProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'setProp') {
            switch (arguments[1]) {
                case 'paused':
                    arguments[2] ? videoElement.pause() : videoElement.play();
                    break;
                case 'time':
                    videoElement.currentTime = arguments[2] / 1000;
                    break;
                case 'volume':
                    videoElement.volume = arguments[2];
                    break;
                default:
                    throw new Error('setProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'command') {
            switch (arguments[1]) {
                case 'load':
                    videoElement.src = arguments[2].source;
                    videoElement.autoplay = true;
                    if (!isNaN(arguments[2].time)) {
                        videoElement.currentTime = arguments[2].time / 1000;
                    }

                    videoElement.load();
                    break;
                case 'stop':
                    events.removeAllListeners();
                    videoElement.removeEventListener('ended', onEnded);
                    videoElement.removeEventListener('error', onError);
                    videoElement.removeEventListener('pause', onPausedChanged);
                    videoElement.removeEventListener('play', onPausedChanged);
                    videoElement.removeEventListener('timeupdate', onTimeChanged);
                    videoElement.removeEventListener('durationchange', onDurationChanged);
                    videoElement.removeEventListener('volumechange', onVolumeChanged);
                    videoElement.pause();
                    break;
                default:
                    throw new Error('command not supported: ' + arguments[1]);
            }
        }
    };
};

HTMLVideo.manifest = {
    name: 'HTMLVideo',
    embedded: true,
    props: ['paused', 'time', 'duration', 'volume']
};

module.exports = HTMLVideo;
