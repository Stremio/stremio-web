// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const Video = require('@stremio/stremio-video');
const EventEmitter = require('eventemitter3');

const events = new EventEmitter();

const useVideo = () => {
    const video = React.useRef(null);
    const containerRef = React.useRef(null);

    const [state, setState] = React.useState({
        manifest: null,
        stream: null,
        paused: null,
        time: null,
        duration: null,
        buffering: null,
        buffered: null,
        volume: null,
        muted: null,
        playbackSpeed: null,
        videoScale: null,
        videoParams: null,
        hdrInfo: null,
        audioTracks: [],
        selectedAudioTrackId: null,
        subtitlesTracks: [],
        selectedSubtitlesTrackId: null,
        subtitlesOffset: null,
        subtitlesSize: null,
        subtitlesTextColor: null,
        subtitlesBackgroundColor: null,
        subtitlesOutlineColor: null,
        extraSubtitlesTracks: [],
        selectedExtraSubtitlesTrackId: null,
        extraSubtitlesSize: null,
        extraSubtitlesDelay: null,
        extraSubtitlesOffset: null,
        extraSubtitlesTextColor: null,
        extraSubtitlesBackgroundColor: null,
        extraSubtitlesOutlineColor: null,
        assSubtitlesStylingActive: false,
        fullscreen: null,
    });

    const dispatch = React.useCallback((action, options) => {
        if (video.current && containerRef.current) {
            try {
                video.current.dispatch(action, {
                    ...options,
                    containerElement: containerRef.current,
                });
            } catch (error) {
                console.error('Video:', error);
            }
        }
    }, []);

    const load = React.useCallback((args, options) => {
        dispatch({
            type: 'command',
            commandName: 'load',
            commandArgs: args
        }, options);
    }, [dispatch]);

    const unload = React.useCallback(() => {
        dispatch({
            type: 'command',
            commandName: 'unload',
        });
    }, [dispatch]);

    const addExtraSubtitlesTracks = React.useCallback((tracks) => {
        dispatch({
            type: 'command',
            commandName: 'addExtraSubtitlesTracks',
            commandArgs: {
                tracks,
            },
        });
    }, [dispatch]);

    const addLocalSubtitles = React.useCallback((filename, buffer) => {
        dispatch({
            type: 'command',
            commandName: 'addLocalSubtitles',
            commandArgs: {
                filename,
                buffer,
            },
        });
    }, [dispatch]);

    const setProp = React.useCallback((name, value) => {
        dispatch({ type: 'setProp', propName: name, propValue: value });
    }, [dispatch]);

    const setPaused = React.useCallback((state) => {
        setProp('paused', state);
    }, [setProp]);

    const setVolume = React.useCallback((volume) => {
        setProp('volume', volume);
    }, [setProp]);

    const setMuted = React.useCallback((state) => {
        setProp('muted', state);
    }, [setProp]);

    const setTime = React.useCallback((time) => {
        setProp('time', time);
    }, [setProp]);

    const setPlaybackSpeed = React.useCallback((rate) => {
        setProp('playbackSpeed', rate);
    }, [setProp]);

    const setAudioTrack = React.useCallback((id) => {
        setProp('selectedAudioTrackId', id);
    }, [setProp]);

    const setSubtitlesTrack = React.useCallback((id) => {
        setProp('selectedSubtitlesTrackId', id);
        setProp('selectedExtraSubtitlesTrackId', null);
    }, [setProp]);

    const setExtraSubtitlesTrack = React.useCallback((id) => {
        setProp('selectedSubtitlesTrackId', null);
        setProp('selectedExtraSubtitlesTrackId', id);
    }, [setProp]);

    const setSubtitlesDelay = React.useCallback((delay) => {
        setProp('extraSubtitlesDelay', delay);
    }, [setProp]);

    const setSubtitlesSize = React.useCallback((size) => {
        setProp('subtitlesSize', size);
        setProp('extraSubtitlesSize', size);
    }, [setProp]);

    const setSubtitlesOffset = React.useCallback((offset) => {
        setProp('subtitlesOffset', offset);
        setProp('extraSubtitlesOffset', offset);
    }, [setProp]);

    const setSubtitlesOffsetMinimum = React.useCallback((offset) => {
        dispatch({
            type: 'setProp',
            propName: 'subtitlesOffsetMinimum',
            propValue: offset,
        });
    }, [dispatch]);

    const setVideoScale = React.useCallback((scale) => {
        setProp('videoScale', scale);
    }, [setProp]);

    const setFullscreen = React.useCallback((state) => {
        setProp('fullscreen', state);
    }, [setProp]);

    const setSubtitlesTextColor = React.useCallback((color) => {
        setProp('subtitlesTextColor', color);
        setProp('extraSubtitlesTextColor', color);
    }, [setProp]);

    const setSubtitlesBackgroundColor = React.useCallback((color) => {
        setProp('subtitlesBackgroundColor', color);
        setProp('extraSubtitlesBackgroundColor', color);
    }, [setProp]);

    const setSubtitlesOutlineColor = React.useCallback((color) => {
        setProp('subtitlesOutlineColor', color);
        setProp('extraSubtitlesOutlineColor', color);
    }, [setProp]);

    const onError = (error) => {
        events.emit('error', error);
    };

    const onEnded = () => {
        events.emit('ended');
    };

    const onSubtitlesTrackLoaded = (track) => {
        events.emit('subtitlesTrackLoaded', track);
    };

    const onExtraSubtitlesTrackLoaded = (track) => {
        events.emit('extraSubtitlesTrackLoaded', track);
    };

    const onExtraSubtitlesTrackAdded = (track) => {
        events.emit('extraSubtitlesTrackAdded', track);
    };

    const onPropChanged = (name, value) => {
        setState((state) => ({
            ...state,
            [name]: value
        }));
    };

    const onImplementationChanged = (manifest) => {
        manifest.props.forEach((propName) => dispatch(({ type: 'observeProp', propName })));
        setState((state) => ({
            ...state,
            manifest
        }));

        events.emit('implementationChanged', manifest);
    };

    React.useEffect(() => {
        video.current = new Video();
        video.current.on('error', onError);
        video.current.on('ended', onEnded);
        video.current.on('propChanged', onPropChanged);
        video.current.on('propValue', onPropChanged);
        video.current.on('implementationChanged', onImplementationChanged);
        video.current.on('subtitlesTrackLoaded', onSubtitlesTrackLoaded);
        video.current.on('extraSubtitlesTrackLoaded', onExtraSubtitlesTrackLoaded);
        video.current.on('extraSubtitlesTrackAdded', onExtraSubtitlesTrackAdded);

        return () => {
            if (video.current) {
                try {
                    video.current.destroy();
                } catch (err) {
                    console.error('Error destroying video:', err);
                }
            }
        };
    }, []);

    return {
        events,
        containerRef,
        state,
        load,
        unload,
        addExtraSubtitlesTracks,
        addLocalSubtitles,
        setPaused,
        setVolume,
        setMuted,
        setTime,
        setPlaybackSpeed,
        setAudioTrack,
        setSubtitlesTrack,
        setSubtitlesDelay,
        setSubtitlesSize,
        setSubtitlesOffset,
        setSubtitlesOffsetMinimum,
        setSubtitlesTextColor,
        setSubtitlesBackgroundColor,
        setSubtitlesOutlineColor,
        setExtraSubtitlesTrack,
        setVideoScale,
        setFullscreen,
    };
};

module.exports = useVideo;
