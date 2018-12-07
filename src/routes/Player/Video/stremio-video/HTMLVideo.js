var EventEmitter = require('events');

var HTMLVideo = function(containerElement) {
    var style = document.createElement('style');
    containerElement.appendChild(style);
    style.sheet.insertRule('#' + containerElement.id + ' video { width: 100%; height: 100%; }', style.sheet.cssRules.length);
    style.sheet.insertRule('#' + containerElement.id + ' video::cue { font-size: 22px; }', style.sheet.cssRules.length);
    var videoElement = document.createElement('video');
    containerElement.appendChild(videoElement);
    videoElement.crossOrigin = 'anonymous';
    videoElement.autoplay = true;
    var events = new EventEmitter();
    var ready = false;
    var dispatchArgsQueue = [];
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
        events.emit('propChanged', 'volume', videoElement.volume * 100);
    };
    var onSubtitlesChanged = function() {
        var subtitles = [];
        for (var i = 0; i < videoElement.textTracks.length; i++) {
            if (videoElement.textTracks[i].kind === 'subtitles') {
                subtitles.push({
                    id: videoElement.textTracks[i].id,
                    language: videoElement.textTracks[i].language,
                    label: videoElement.textTracks[i].label
                });
            }
        }

        events.emit('propChanged', 'subtitles', subtitles);
    };
    var onReady = function() {
        ready = true;
        for (var i = 0; i < dispatchArgsQueue.length; i++) {
            this.dispatch.apply(this, dispatchArgsQueue[i]);
        }

        dispatchArgsQueue = [];
    }.bind(this);
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
                    return;
                case 'time':
                    events.emit('propValue', 'time', videoElement.currentTime * 1000);
                    videoElement.removeEventListener('timeupdate', onTimeChanged);
                    videoElement.addEventListener('timeupdate', onTimeChanged);
                    return;
                case 'duration':
                    events.emit('propValue', 'duration', isNaN(videoElement.duration) ? null : videoElement.duration * 1000);
                    videoElement.removeEventListener('durationchange', onDurationChanged);
                    videoElement.addEventListener('durationchange', onDurationChanged);
                    return;
                case 'volume':
                    events.emit('propValue', 'volume', videoElement.volume * 100);
                    videoElement.removeEventListener('volumechange', onVolumeChanged);
                    videoElement.addEventListener('volumechange', onVolumeChanged);
                    return;
                case 'subtitles':
                    var subtitles = [];
                    for (var i = 0; i < videoElement.textTracks.length; i++) {
                        if (videoElement.textTracks[i].kind === 'subtitles') {
                            subtitles.push({
                                id: videoElement.textTracks[i].id,
                                language: videoElement.textTracks[i].language,
                                label: videoElement.textTracks[i].label
                            });
                        }
                    }

                    events.emit('propValue', 'subtitles', subtitles);
                    videoElement.textTracks.removeEventListener('addtrack', onSubtitlesChanged);
                    videoElement.textTracks.removeEventListener('removetrack', onSubtitlesChanged);
                    videoElement.textTracks.addEventListener('addtrack', onSubtitlesChanged);
                    videoElement.textTracks.addEventListener('removetrack', onSubtitlesChanged);
                    return;
                default:
                    throw new Error('observeProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'setProp') {
            switch (arguments[1]) {
                case 'paused':
                    arguments[2] ? videoElement.pause() : videoElement.play();
                    return;
                case 'time':
                    videoElement.currentTime = arguments[2] / 1000;
                    return;
                case 'volume':
                    videoElement.volume = arguments[2] / 100;
                    return;
                default:
                    throw new Error('setProp not supported: ' + arguments[1]);
            }
        } else if (arguments[0] === 'command') {
            switch (arguments[1]) {
                case 'load':
                    if (!isNaN(arguments[3].time)) {
                        videoElement.currentTime = arguments[3].time / 1000;
                    }

                    videoElement.src = arguments[2].url;
                    videoElement.load();
                    onReady();
                    return;
                case 'addExtraSubtitles':
                    if (ready) {
                        for (var i = 0; i < arguments[2].length; i++) {
                            var track = document.createElement('track');
                            track.kind = 'subtitles';
                            track.id = arguments[2][i].id;
                            track.src = arguments[2][i].url;
                            track.label = arguments[2][i].label;
                            track.srclang = arguments[2][i].language;
                            videoElement.appendChild(track);
                        }
                    }
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
                    videoElement.textTracks.removeEventListener('addtrack', onSubtitlesChanged);
                    videoElement.textTracks.removeEventListener('removetrack', onSubtitlesChanged);
                    videoElement.removeAttribute('src');
                    videoElement.load();
                    ready = false;
                    return;
                default:
                    throw new Error('command not supported: ' + arguments[1]);
            }
        }

        if (!ready) {
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
