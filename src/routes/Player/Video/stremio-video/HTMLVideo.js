var EventEmitter = require('events');

var HTMLVideo = function(container) {
    if (!(container instanceof HTMLElement)) {
        throw new Error('Instance of HTMLElement required as a first argument');
    }

    var self = this;
    var events = new EventEmitter();
    var loaded = false;
    var destroyed = false;
    var dispatchArgsQueue = [];
    var subtitleTracks = [];
    var selectedSubtitleTrackId = null;
    var styles = document.createElement('style');
    var video = document.createElement('video');

    container.appendChild(styles);
    styles.sheet.insertRule('#' + container.id + ' video { width: 100%; height: 100%; }', styles.sheet.cssRules.length);
    styles.sheet.insertRule('#' + container.id + ' video::cue { font-size: 22px; }', styles.sheet.cssRules.length);
    container.appendChild(video);
    video.crossOrigin = 'anonymous';
    video.controls = false;

    function getPaused() {
        if (!loaded) {
            return null;
        }

        return !!video.paused;
    };
    function getTime() {
        if (!loaded) {
            return null;
        }

        return Math.floor(video.currentTime * 1000);
    };
    function getDuration() {
        if (!loaded || isNaN(video.duration)) {
            return null;
        }

        return Math.floor(video.duration * 1000);
    };
    function getVolume() {
        return video.muted ? 0 : Math.floor(video.volume * 100);
    };
    function getSubtitleTracks() {
        if (!loaded) {
            return [];
        }

        return subtitleTracks.slice();
    };
    function getSelectedSubtitleTrackId() {
        if (!loaded) {
            return null;
        }

        return selectedSubtitleTrackId;
    };
    function onEnded() {
        events.emit('ended');
    };
    function onError() {
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

        if (error.critical) {
            self.dispatch('command', 'stop');
        }
    };
    function onPausedChanged() {
        events.emit('propChanged', 'paused', getPaused());
    };
    function onTimeChanged() {
        events.emit('propChanged', 'time', getTime());
    };
    function onDurationChanged() {
        events.emit('propChanged', 'duration', getDuration());
    };
    function onVolumeChanged() {
        events.emit('propChanged', 'volume', getVolume());
    };
    function onSubtitleTracksChanged() {
        events.emit('propChanged', 'subtitleTracks', getSubtitleTracks());
    };
    function onSelectedSubtitleTrackIdChanged() {
        events.emit('propChanged', 'selectedSubtitleTrackId', getSelectedSubtitleTrackId());
    };
    function flushArgsQueue() {
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
                    case 'selectedSubtitleTrackId':
                        events.emit('propValue', 'selectedSubtitleTrackId', getSelectedSubtitleTrackId());
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
                            if (!isNaN(arguments[2])) {
                                video.currentTime = arguments[2] / 1000;
                            }
                        }
                        break;
                    case 'selectedSubtitleTrackId':
                        if (loaded) {
                            var subtitleTrack;
                            for (var i = 0; i < subtitleTracks.length; i++) {
                                if (subtitleTracks[i].id === arguments[2]) {
                                    subtitleTrack = subtitleTracks[i];
                                    break;
                                }
                            }
                            selectedSubtitleTrackId = subtitleTrack ? subtitleTrack.id : null;
                            onSelectedSubtitleTrackIdChanged();
                        }
                        break;
                    case 'volume':
                        if (!isNaN(arguments[2])) {
                            video.muted = false;
                            video.volume = arguments[2] / 100;
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
                            var extraSubtitleTracks = (Array.isArray(arguments[2]) ? arguments[2] : [])
                                .filter(function(track) {
                                    return track &&
                                        typeof track.url === 'string' &&
                                        track.url.length > 0 &&
                                        track.origin !== 'EMBEDDED';
                                })
                                .map(function(track) {
                                    return Object.freeze(Object.assign({}, track, {
                                        id: track.url
                                    }));
                                });
                            subtitleTracks = subtitleTracks.concat(extraSubtitleTracks)
                                .filter(function(track, index, tracks) {
                                    for (var i = 0; i < tracks.length; i++) {
                                        if (tracks[i].id === track.id) {
                                            return i === index;
                                        }
                                    }

                                    return false;
                                });
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
                        selectedSubtitleTrackId = null;
                        while (video.hasChildNodes()) video.removeChild(video.lastChild);
                        video.removeAttribute('src');
                        video.load();
                        video.currentTime = 0;
                        onPausedChanged();
                        onTimeChanged();
                        onDurationChanged();
                        onSubtitleTracksChanged();
                        onSelectedSubtitleTrackIdChanged();
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
                        onSelectedSubtitleTrackIdChanged();
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
                        container.removeChild(video);
                        container.removeChild(styles);
                        destroyed = true;
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

HTMLVideo.manifest = {
    name: 'HTMLVideo',
    embedded: true,
    props: ['paused', 'time', 'duration', 'volume', 'subtitleTracks', 'selectedSubtitleTrackId']
};

module.exports = HTMLVideo;
