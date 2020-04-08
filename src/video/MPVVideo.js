// Copyright (C) 2017-2020 Smart code 203358507

var EventEmitter = require('events');

var MPV_CRITICAL_ERROR_CODES = [];

function MPVVideo(options) {
    var ipc = options && options.ipc;
    var id = options && options.id;
    if (!ipc) {
        throw new Error('ipc parameter is required');
    }

    if (typeof id !== 'string') {
        throw new Error('id parameter is required');
    }

    var ready = false;
    var loaded = false;
    var destroyed = false;
    var events = new EventEmitter();
    var observedProps = {};
    var dispatchArgsReadyQueue = [];

    events.on('error', function() { });
    ipc.dispatch('mpv', 'createChannel', id)
        .then(function() {
            if (destroyed) {
                return;
            }

            ready = true;
            Promise.all([getProp('volume'), getProp('mute')]).then(function(values) {
                if (destroyed) {
                    return;
                }

                onPropChanged('volume', values[0]);
                onPropChanged('mute', values[1]);
            });
            ipc.on('mpvEvent', onMpvEvent);
            flushDispatchArgsQueue(dispatchArgsReadyQueue);
        })
        .catch(function(error) {
            onChannelError(error);
        });

    function mapPausedValue(pause) {
        if (!loaded || typeof pause !== 'boolean') {
            return null;
        }

        return pause;
    }
    function mapTimeValue(timePos) {
        if (!loaded || isNaN(timePos) || timePos === null) {
            return null;
        }

        return Math.round(timePos * 1000);
    }
    function mapDurationValue(duration) {
        if (!loaded || isNaN(duration) || duration === null) {
            return null;
        }

        return Math.round(duration * 1000);
    }
    function mapBufferingValue(seeking, pausedForCache) {
        if (!loaded || (seeking === null && pausedForCache === null)) {
            return null;
        }

        return !!seeking || !!pausedForCache;
    }
    function mapVolumeValue(volume) {
        if (!ready || destroyed || isNaN(volume) || volume === null) {
            return null;
        }

        return volume;
    }
    function mapMutedValue(mute) {
        if (!ready || destroyed || typeof mute !== 'boolean') {
            return null;
        }

        return mute;
    }
    function onError(error) {
        if (destroyed || !error) {
            return;
        }

        Object.freeze(error);
        events.emit('error', error);
        if (error.critical) {
            dispatch('command', 'stop');
        }
    }
    function onEnded() {
        if (destroyed) {
            return;
        }

        events.emit('ended');
    }
    function onPropChanged(propName, propValue) {
        switch (propName) {
            case 'pause': {
                if (observedProps['paused']) {
                    events.emit('propChanged', 'paused', mapPausedValue(propValue));
                }

                break;
            }
            case 'time-pos': {
                if (observedProps['time']) {
                    events.emit('propChanged', 'time', mapTimeValue(propValue));
                }

                break;
            }
            case 'duration': {
                if (observedProps['duration']) {
                    events.emit('propChanged', 'duration', mapDurationValue(propValue));
                }

                break;
            }
            case 'seeking': {
                if (observedProps['buffering']) {
                    events.emit('propChanged', 'buffering', mapBufferingValue(propValue, null));
                }

                break;
            }
            case 'paused-for-cache': {
                if (observedProps['buffering']) {
                    events.emit('propChanged', 'buffering', mapBufferingValue(null, propValue));
                }

                break;
            }
            case 'volume': {
                if (observedProps['volume']) {
                    events.emit('propChanged', 'volume', mapVolumeValue(propValue));
                }

                break;
            }
            case 'mute': {
                if (observedProps['muted']) {
                    events.emit('propChanged', 'muted', mapMutedValue(propValue));
                }

                break;
            }
        }
    }
    function onMpvEvent(data) {
        if (destroyed) {
            return;
        }

        if (!data || data.channelId !== id) {
            onChannelError(ipc.errors.mpv_channel_id_expired);
            return;
        }

        switch (data.eventName) {
            case 'error': {
                onError(Object.assign({}, data, {
                    critical: MPV_CRITICAL_ERROR_CODES.indexOf(data.code) !== -1
                }));
                break;
            }
            case 'ended': {
                onEnded();
                break;
            }
            case 'propChanged': {
                onPropChanged(data.propName, data.propValue);
                break;
            }
        }
    }
    function onChannelError(error) {
        if (destroyed) {
            return;
        }

        onError(Object.assign({}, error, {
            critical: true
        }));
        dispatch('command', 'destroy');
    }
    function observeProp(propName) {
        ipc.dispatch('mpv', 'observeProp', id, propName)
            .catch(function(error) {
                onChannelError(error);
            });
    }
    function getProp(propName) {
        return ipc.dispatch('mpv', 'getProp', id, propName)
            .catch(function(error) {
                onChannelError(error);
                return null;
            });
    }
    function setProp(propName, propValue) {
        ipc.dispatch('mpv', 'setProp', id, propName, propValue)
            .catch(function(error) {
                onChannelError(error);
            });
    }
    function command() {
        ipc.dispatch.apply(null, ['mpv', 'command', id].concat(Array.from(arguments)))
            .catch(function(error) {
                onChannelError(error);
            });
    }
    function flushDispatchArgsQueue(dispatchArgsQueue) {
        if (destroyed) {
            return;
        }

        while (dispatchArgsQueue.length > 0) {
            var args = dispatchArgsQueue.shift();
            dispatch.apply(null, args);
        }
    }
    function on(eventName, listener) {
        if (destroyed) {
            throw new Error('Video is destroyed');
        }

        events.on(eventName, listener);
    }
    function dispatch() {
        if (destroyed) {
            throw new Error('Video is destroyed');
        }

        switch (arguments[0]) {
            case 'observeProp': {
                switch (arguments[1]) {
                    case 'paused': {
                        observeProp('pause');
                        getProp('pause').then(function(pause) {
                            if (destroyed) {
                                return;
                            }

                            observedProps['paused'] = true;
                            events.emit('propValue', 'paused', mapPausedValue(pause));
                        });
                        return;
                    }
                    case 'time': {
                        observeProp('time-pos');
                        getProp('time-pos').then(function(timePos) {
                            if (destroyed) {
                                return;
                            }

                            observedProps['time'] = true;
                            events.emit('propValue', 'time', mapTimeValue(timePos));
                        });
                        return;
                    }
                    case 'duration': {
                        observeProp('duration');
                        getProp('duration').then(function(duration) {
                            if (destroyed) {
                                return;
                            }

                            observedProps['duration'] = true;
                            events.emit('propValue', 'duration', mapDurationValue(duration));
                        });
                        return;
                    }
                    case 'buffering': {
                        observeProp('seeking');
                        observeProp('paused-for-cache');
                        Promise.all([getProp('seeking'), getProp('paused-for-cache')]).then(function(values) {
                            if (destroyed) {
                                return;
                            }

                            observedProps['buffering'] = true;
                            events.emit('propValue', 'buffering', mapBufferingValue(values[0], values[1]));
                        });
                        return;
                    }
                    case 'volume': {
                        observeProp('volume');
                        getProp('volume').then(function(volume) {
                            if (destroyed) {
                                return;
                            }

                            observedProps['volume'] = true;
                            events.emit('propValue', 'volume', mapVolumeValue(volume));
                        });
                        return;
                    }
                    case 'muted': {
                        observeProp('mute');
                        getProp('mute').then(function(mute) {
                            if (destroyed) {
                                return;
                            }

                            observedProps['muted'] = true;
                            events.emit('propValue', 'muted', mapMutedValue(mute));
                        });
                        return;
                    }
                }
            }
            case 'setProp': {
                switch (arguments[1]) {
                    case 'paused': {
                        if (loaded) {
                            setProp('pause', !!arguments[2]);
                        }

                        return;
                    }
                    case 'time': {
                        if (loaded && !isNaN(arguments[2]) && arguments[2] !== null) {
                            setProp('time-pos', arguments[2] / 1000);
                        }

                        return;
                    }
                    case 'volume': {
                        if (ready) {
                            if (!isNaN(arguments[2]) && arguments[2] !== null) {
                                setProp('mute', false);
                                setProp('volume', Math.max(0, Math.min(100, arguments[2])));
                            }
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'muted': {
                        if (ready) {
                            setProp('mute', !!arguments[2]);
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                }
            }
            case 'command': {
                switch (arguments[1]) {
                    case 'stop': {
                        loaded = false;
                        if (ready) {
                            command('stop');
                        }
                        onPropChanged('pause', null);
                        onPropChanged('time-pos', null);
                        onPropChanged('duration', null);
                        onPropChanged('seeking', null);
                        onPropChanged('paused-for-cache', null);
                        return;
                    }
                    case 'load': {
                        if (ready) {
                            dispatch('command', 'stop');
                            loaded = true;
                            var startTime = !isNaN(arguments[3].time) && arguments[3].time !== null ? Math.round(arguments[3].time / 1000) : 0;
                            command('loadfile', arguments[2].url, 'replace', 'time-pos=' + startTime);
                            setProp('pause', arguments[3].autoplay === false);
                            Promise.all([
                                getProp('pause'),
                                getProp('time-pos'),
                                getProp('duration'),
                                getProp('seeking'),
                                getProp('paused-for-cache')
                            ]).then(function(values) {
                                if (destroyed) {
                                    return;
                                }

                                onPropChanged('pause', values[0]);
                                onPropChanged('time-pos', values[1]);
                                onPropChanged('duration', values[2]);
                                onPropChanged('seeking', values[3]);
                                onPropChanged('paused-for-cache', values[4]);
                            });
                        } else {
                            dispatchArgsReadyQueue.push(Array.from(arguments));
                        }

                        return;
                    }
                    case 'destroy': {
                        dispatch('command', 'stop');
                        destroyed = true;
                        onPropChanged('volume', null);
                        onPropChanged('mute', null);
                        events.removeAllListeners();
                        events.on('error', function() { });
                        ipc.off('mpvEvent', onMpvEvent);
                        dispatchArgsReadyQueue = [];
                        return;
                    }
                }
            }
        }

        throw new Error('Invalid dispatch call: ' + Array.from(arguments).map(String));
    }

    this.on = on;
    this.dispatch = dispatch;

    Object.freeze(this);
}

MPVVideo.manifest = Object.freeze({
    name: 'MPVVideo',
    embedded: true,
    props: Object.freeze(['paused', 'time', 'duration', 'volume', 'muted', 'buffering'])
});

Object.freeze(MPVVideo);

module.exports = MPVVideo;
