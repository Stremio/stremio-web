// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const Video = require('@stremio/stremio-video');
const EventEmitter = require('eventemitter3');

const events = new EventEmitter();

const useVideo = () => {
    const video = React.useRef(null);
    const containerElement = React.useRef(null);

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
        videoParams: null,
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
    });

    const dispatch = (action, options) => {
        if (video.current && containerElement.current) {
            try {
                video.current.dispatch(action, {
                    ...options,
                    containerElement: containerElement.current,
                });
            } catch (error) {
                console.error('Video:', error);
            }
        }
    };

    const load = (args, options) => {
        dispatch({
            type: 'command',
            commandName: 'load',
            commandArgs: args
        }, options);
    };

    const unload = () => {
        dispatch({
            type: 'command',
            commandName: 'unload',
        });
    };

    const addExtraSubtitlesTracks = (tracks) => {
        dispatch({
            type: 'command',
            commandName: 'addExtraSubtitlesTracks',
            commandArgs: {
                tracks,
            },
        });
    };

    const setProp = (name, value) => {
        dispatch({ type: 'setProp', propName: name, propValue: value });
    };

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

        return () => video.current.destroy();
    }, []);

    return {
        events,
        containerElement,
        state,
        load,
        unload,
        addExtraSubtitlesTracks,
        setProp,
    };
};

module.exports = useVideo;
