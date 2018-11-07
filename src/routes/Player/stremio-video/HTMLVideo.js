var EventEmitter = require('events');

var HTMLVideo = function(videoElement) {
    var events = new EventEmitter();

    this.addListener = function(event, cb) {
        events.addListener(event, cb);
    };

    this.removeListener = function(event, cb) {
        events.removeListener(event, cb);
    };

    this.dispatch = function() {
        if (arguments[0] === 'observeProp') {
            var propName = arguments[1];
            var propValue = videoElement[propName];
            if (propName === 'time') {
                propValue = videoElement.currentTime * 1000;
            } else if (propName === 'duration') {
                propValue = isNaN(videoElement.duration) ? null : (videoElement.duration * 1000);
            }

            events.emit('propValue', propName, propValue);
        } else if (arguments[0] === 'setProp') {
            switch (arguments[1]) {
                case 'time':
                    videoElement.currentTime = arguments[2] / 1000;
                    break;
                case 'paused':
                    arguments[2] ? videoElement.pause() : videoElement.play();
                    break;
                case 'volume':
                    videoElement.volume = arguments[2];
                    break;
            }
        } else if (arguments[0] === 'command') {
            var commandArgs = arguments[2];
            if (arguments[1] === 'load') {
                videoElement.src = commandArgs.source;
                videoElement.autoplay = true;
                if (!isNaN(commandArgs.time)) {
                    videoElement.currentTime = commandArgs.time / 1000;
                }

                videoElement.load();
            } else if (arguments[1] === 'stop') {
                videoElement.pause();
            }
        }
    };

    videoElement.addEventListener('durationchange', function() {
        events.emit('propChanged', 'duration', isNaN(videoElement.duration) ? null : videoElement.duration * 1000);
    });
    videoElement.addEventListener('pause', function() {
        events.emit('propChanged', 'paused', videoElement.paused);
    });
    videoElement.addEventListener('play', function() {
        events.emit('propChanged', 'paused', videoElement.paused);
    });
    videoElement.addEventListener('volumechange', function() {
        events.emit('propChanged', 'volume', videoElement.volume);
    });
    videoElement.addEventListener('timeupdate', function() {
        events.emit('propChanged', 'time', videoElement.currentTime * 1000);
    });
    videoElement.addEventListener('error', function() {
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
            default:
                message = 'fetching process aborted by user';
                critical = false;
                break;
        };

        events.emit('error', {
            code: videoElement.error.code,
            message: message,
            critical: critical
        });
    });
    videoElement.addEventListener('ended', function() {
        events.emit('ended');
    });
};

HTMLVideo.manifest = {
    name: 'HTMLVideo',
    embedded: true,
    controls: ['playback', 'time', 'volume']
};

module.exports = HTMLVideo;
