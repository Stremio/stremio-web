var EventEmitter = require('events');

var YouTubeVideo = function(containerElement) {
    var events = new EventEmitter();
    var ready = false;
    var observedProps = {};
    var timeIntervalId = null;
    var durationIntervalId = null;
    var dispatchArgsQueue = [];
    var onEnded = function() {
        events.emit('ended');
    };
    var onError = function(event) {
        var message;
        var critical;
        switch (event.data) {
            case 2:
                message = 'Invalid request';
                critical = true;
                break;
            case 5:
                message = 'The requested content cannot be played';
                critical = true;
                break;
            case 100:
                message = 'The video has been removed or marked as private';
                critical = true;
                break;
            case 101:
            case 150:
                message = 'The video cannot be played in embedded players';
                critical = true;
                break;
            default:
                message = 'Unknown error';
                critical = true;
        }

        events.emit('error', {
            code: event.data,
            message: message,
            critical: critical
        });
    };
    var onPausedChanged = function() {
        events.emit('propChanged', 'paused', video.getPlayerState() !== YT.PlayerState.PLAYING);
    };
    var onTimeChanged = function() {
        events.emit('propChanged', 'time', video.getCurrentTime() * 1000);
    };
    var onDurationChanged = function() {
        events.emit('propChanged', 'duration', video.getDuration() !== 0 ? video.getDuration() * 1000 : null);
    };
    var onVolumeChanged = function(volume) {
        events.emit('propChanged', 'volume', volume);
    };
    var onReady = function() {
        ready = true;
        dispatchArgsQueue.forEach(function(args) {
            this.dispatch.apply(this, args);
        }, this);
        dispatchArgsQueue = [];
    };
    var onStateChange = function(event) {
        switch (event.data) {
            case YT.PlayerState.ENDED:
                onEnded();
                break;
            case YT.PlayerState.PLAYING:
                if (observedProps.paused) {
                    onPausedChanged();
                }

                if (observedProps.duration) {
                    onDurationChanged();
                }
                break;
            case YT.PlayerState.PAUSED:
                if (observedProps.paused) {
                    onPausedChanged();
                }
                break;
            case YT.PlayerState.UNSTARTED:
                if (observedProps.paused) {
                    onPausedChanged();
                }
                break;
        }
    };
    var video = new YT.Player(containerElement, {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            cc_load_policy: 0,
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
            onError: onError.bind(this),
            onReady: onReady.bind(this),
            onStateChange: onStateChange.bind(this)
        }
    });

    this.on = function(eventName, listener) {
        events.on(eventName, listener);
    };

    this.dispatch = function() {
        if (arguments[0] === 'observeProp') {
            switch (arguments[1]) {
                case 'paused':
                    if (ready) {
                        events.emit('propValue', 'paused', video.getPlayerState() !== YT.PlayerState.PLAYING);
                        observedProps.paused = true;
                    }
                    break;
                case 'time':
                    if (ready) {
                        events.emit('propValue', 'time', video.getCurrentTime() * 1000);
                        if (timeIntervalId === null) {
                            timeIntervalId = window.setInterval(onTimeChanged, 100);
                        }
                    }
                    break;
                case 'duration':
                    if (ready) {
                        events.emit('propValue', 'duration', video.getDuration() !== 0 ? video.getDuration() * 1000 : null);
                        observedProps.duration = true;
                        if (durationIntervalId === null) {
                            durationIntervalId = window.setInterval(onDurationChanged, 5000);
                        }
                    }
                    break;
                case 'volume':
                    if (ready) {
                        events.emit('propValue', 'volume', video.getVolume());
                    }
                    break;
                default:
                    throw new Error('observeProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'setProp') {
            switch (arguments[1]) {
                case 'paused':
                    if (ready) {
                        arguments[2] ? video.pauseVideo() : video.playVideo();
                    }
                    break;
                case 'time':
                    if (ready) {
                        video.seekTo(arguments[2] / 1000);
                    }
                    break;
                case 'volume':
                    if (ready) {
                        video.setVolume(arguments[2]);
                        onVolumeChanged(arguments[2]);
                    }
                    break;
                default:
                    throw new Error('setProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'command') {
            switch (arguments[1]) {
                case 'load':
                    if (ready) {
                        video.loadVideoById({
                            videoId: arguments[2].source,
                            startSeconds: isNaN(arguments[2].time) ? 0 : arguments[2].time / 1000
                        });
                    }
                    break;
                case 'stop':
                    if (ready) {
                        events.removeAllListeners();
                        observedProps = {};
                        clearInterval(timeIntervalId);
                        clearInterval(durationIntervalId);
                        video.pauseVideo();
                    }
                    break;
                default:
                    throw new Error('command not supported: ' + arguments[1]);
            }
        }

        if (!ready) {
            dispatchArgsQueue.push(Array.from(arguments));
        }
    };
};

YouTubeVideo.manifest = {
    name: 'YouTubeVideo',
    embedded: true,
    props: ['paused', 'time', 'duration', 'volume']
};

module.exports = YouTubeVideo;
