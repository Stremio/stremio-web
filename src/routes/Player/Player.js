// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { HorizontalNavBar, Button, useDeepEqualEffect, useFullscreen, useBinaryState, useToast, useStreamingServer } = require('stremio/common');
const Icon = require('@stremio/stremio-icons/dom');
const BufferingLoader = require('./BufferingLoader');
const ControlBar = require('./ControlBar');
const InfoMenu = require('./InfoMenu');
const SubtitlesMenu = require('./SubtitlesMenu');
const Video = require('./Video');
const usePlayer = require('./usePlayer');
const useSettings = require('./useSettings');
const styles = require('./styles');

const Player = ({ urlParams, queryParams }) => {
    const { core, chromecast } = useServices();
    const [forceTranscoding, audioChannels] = React.useMemo(() => {
        return [
            queryParams.has('forceTranscoding'),
            queryParams.has('audioChannels') ? parseInt(queryParams.get('audioChannels'), 10) : null
        ];
    }, [queryParams]);
    const [player, updateLibraryItemState, pushToLibrary] = usePlayer(urlParams);
    const [settings, updateSettings] = useSettings();
    const streamingServer = useStreamingServer();
    const routeFocused = useRouteFocused();
    const toast = useToast();
    const [, , , toggleFullscreen] = useFullscreen();
    const [casting, setCasting] = React.useState(() => {
        return chromecast.active && chromecast.transport.getCastState() === cast.framework.CastState.CONNECTED;
    });
    const [immersed, setImmersed] = React.useState(true);
    const setImmersedDebounced = React.useCallback(debounce(setImmersed, 3000), []);
    const [subtitlesMenuOpen, , closeSubtitlesMenu, toggleSubtitlesMenu] = useBinaryState(false);
    const [infoMenuOpen, , closeInfoMenu, toggleInfoMenu] = useBinaryState(false);
    const [error, setError] = React.useState(null);
    const [videoState, setVideoState] = React.useReducer(
        (videoState, nextVideoState) => ({ ...videoState, ...nextVideoState }),
        {
            stream: null,
            paused: null,
            time: null,
            duration: null,
            buffering: null,
            volume: null,
            muted: null,
            subtitlesTracks: [],
            selectedSubtitlesTrackId: null,
            extraSubtitlesTracks: [],
            selectedExtraSubtitlesTrackId: null,
            extraSubtitlesSize: null,
            extraSubtitlesDelay: null,
            extraSubtitlesOffset: null,
            extraSubtitlesTextColor: null,
            extraSubtitlesBackgroundColor: null,
            extraSubtitlesOutlineColor: null
        }
    );
    const videoRef = React.useRef(null);
    const dispatch = React.useCallback((args) => {
        if (videoRef.current !== null) {
            videoRef.current.dispatch(args);
        }
    }, []);
    const onImplementationChanged = React.useCallback((manifest) => {
        manifest.props.forEach((propName) => {
            dispatch({ type: 'observeProp', propName });
        });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesSize', propValue: settings.subtitlesSize });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesOffset', propValue: settings.subtitlesOffset });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesTextColor', propValue: settings.subtitlesTextColor });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesBackgroundColor', propValue: settings.subtitlesBackgroundColor });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesOutlineColor', propValue: settings.subtitlesOutlineColor });
    }, [settings.subtitlesSize, settings.subtitlesOffset, settings.subtitlesTextColor, settings.subtitlesBackgroundColor, settings.subtitlesOutlineColor]);
    const onPropChanged = React.useCallback((propName, propValue) => {
        setVideoState({ [propName]: propValue });
    }, []);
    const onEnded = React.useCallback(() => {
        pushToLibrary();
        if (player.libraryItem !== null) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'RewindLibraryItem',
                    args: player.libraryItem._id
                }
            });
        }
        if (player.nextVideo !== null) {
            window.location.replace(
                typeof player.nextVideo.deepLinks.player === 'string' ?
                    player.nextVideo.deepLinks.player
                    :
                    player.nextVideo.deepLinks.metaDetailsStreams
            );
        } else {
            window.history.back();
        }
    }, [player]);
    const onError = React.useCallback((error) => {
        console.error('Player', error);
        if (error.critical) {
            setError(error);
        } else {
            toast.show({
                type: 'error',
                title: 'Error',
                message: error.message,
                timeout: 3000
            });
        }
    }, []);
    const onSubtitlesTrackLoaded = React.useCallback(() => {
        toast.show({
            type: 'success',
            title: 'Subtitles loaded',
            message: 'Embedded subtitles loaded',
            timeout: 3000
        });
    }, []);
    const onExtraSubtitlesTrackLoaded = React.useCallback((track) => {
        toast.show({
            type: 'success',
            title: 'Subtitles loaded',
            message: track.exclusive ? 'Exclusice subtitles loaded' : `Subtitles from ${track.origin} loaded`,
            timeout: 3000
        });
    }, []);
    const onPlayRequested = React.useCallback(() => {
        dispatch({ type: 'setProp', propName: 'paused', propValue: false });
    }, []);
    const onPlayRequestedDebounced = React.useCallback(debounce(onPlayRequested, 200), []);
    const onPauseRequested = React.useCallback(() => {
        dispatch({ type: 'setProp', propName: 'paused', propValue: true });
    }, []);
    const onPauseRequestedDebounced = React.useCallback(debounce(onPauseRequested, 200), []);
    const onMuteRequested = React.useCallback(() => {
        dispatch({ type: 'setProp', propName: 'muted', propValue: true });
    }, []);
    const onUnmuteRequested = React.useCallback(() => {
        dispatch({ type: 'setProp', propName: 'muted', propValue: false });
    }, []);
    const onVolumeChangeRequested = React.useCallback((volume) => {
        dispatch({ type: 'setProp', propName: 'volume', propValue: volume });
    }, []);
    const onSeekRequested = React.useCallback((time) => {
        dispatch({ type: 'setProp', propName: 'time', propValue: time });
    }, []);
    const onSubtitlesTrackSelected = React.useCallback((id) => {
        dispatch({ type: 'setProp', propName: 'selectedExtraSubtitlesTrackId', propValue: null });
        dispatch({ type: 'setProp', propName: 'selectedSubtitlesTrackId', propValue: id });
    }, []);
    const onExtraSubtitlesTrackSelected = React.useCallback((id) => {
        dispatch({ type: 'setProp', propName: 'selectedSubtitlesTrackId', propValue: null });
        dispatch({ type: 'setProp', propName: 'selectedExtraSubtitlesTrackId', propValue: id });
    }, []);
    const onExtraSubtitlesDelayChanged = React.useCallback((delay) => {
        dispatch({ type: 'setProp', propName: 'extraSubtitlesDelay', propValue: delay });
    }, []);
    const onSubtitlesSizeChanged = React.useCallback((size) => {
        updateSettings({ subtitlesSize: size });
    }, [updateSettings]);
    const onSubtitlesOffsetChanged = React.useCallback((offset) => {
        updateSettings({ subtitlesOffset: offset });
    }, [updateSettings]);
    const onVideoClick = React.useCallback(() => {
        if (videoState.paused !== null) {
            if (videoState.paused) {
                onPlayRequestedDebounced();
            } else {
                onPauseRequestedDebounced();
            }
        }
    }, [videoState.paused]);
    const onVideoDoubleClick = React.useCallback(() => {
        onPlayRequestedDebounced.cancel();
        onPauseRequestedDebounced.cancel();
        toggleFullscreen();
    }, [toggleFullscreen]);
    const onContainerMouseDown = React.useCallback((event) => {
        if (!event.nativeEvent.subtitlesMenuClosePrevented) {
            closeSubtitlesMenu();
        }
        if (!event.nativeEvent.infoMenuClosePrevented) {
            closeInfoMenu();
        }
    }, []);
    const onContainerMouseMove = React.useCallback((event) => {
        setImmersed(false);
        if (!event.nativeEvent.immersePrevented) {
            setImmersedDebounced(true);
        } else {
            setImmersedDebounced.cancel();
        }
    }, []);
    const onContainerMouseLeave = React.useCallback(() => {
        setImmersedDebounced.cancel();
        setImmersed(true);
    }, []);
    const onBarMouseMove = React.useCallback((event) => {
        event.nativeEvent.immersePrevented = true;
    }, []);
    useDeepEqualEffect(() => {
        setError(null);
        if (player.selected === null) {
            dispatch({ type: 'command', commandName: 'unload' });
        } else if (streamingServer.baseUrl !== null && streamingServer.baseUrl.type !== 'Loading') {
            let seriesInfo = false;
            if ((player.metaItem?.videos || []).length) {
                const videoId = player.selected?.streamRequest?.path?.id;
                const video = player.metaItem.videos.find((vid) => vid.id === videoId);
                if (video?.season || video?.episode) {
                    seriesInfo = {
                        season: video.season,
                        episode: video.episode,
                    };
                }
            }
            dispatch({
                type: 'command',
                commandName: 'load',
                commandArgs: {
                    stream: {
                        ...player.selected.stream,
                        subtitles: Array.isArray(player.selected.stream.subtitles) ?
                            player.selected.stream.subtitles.map((subtitles) => ({
                                ...subtitles,
                                label: subtitles.url
                            }))
                            :
                            []
                    },
                    autoplay: true,
                    time: player.libraryItem !== null && player.selected.streamRequest !== null && player.libraryItem.state.video_id === player.selected.streamRequest.id ?
                        player.libraryItem.state.timeOffset
                        :
                        0,
                    forceTranscoding: forceTranscoding || casting,
                    audioChannels: typeof audioChannels === 'number' ?
                        audioChannels
                        :
                        window.chrome ?
                            2
                            :
                            null,
                    streamingServerURL: streamingServer.baseUrl.type === 'Ready' ?
                        casting ?
                            streamingServer.baseUrl.content
                            :
                            streamingServer.selected.transportUrl
                        :
                        null,
                    chromecastTransport: chromecast.active ? chromecast.transport : null,
                    seriesInfo,
                }
            });
        }
    }, [streamingServer.baseUrl, player.metaItem, forceTranscoding, audioChannels, casting]);
    useDeepEqualEffect(() => {
        if (videoState.stream !== null) {
            dispatch({
                type: 'command',
                commandName: 'addExtraSubtitlesTracks',
                commandArgs: {
                    tracks: player.subtitles.map((subtitles) => ({
                        ...subtitles,
                        label: subtitles.url
                    }))
                }
            });
        }
    }, [player.subtitles, videoState.stream]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'extraSubtitlesSize', propValue: settings.subtitlesSize });
    }, [settings.subtitlesSize]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'extraSubtitlesOffset', propValue: settings.subtitlesOffset });
    }, [settings.subtitlesOffset]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'extraSubtitlesTextColor', propValue: settings.subtitlesTextColor });
    }, [settings.subtitlesTextColor]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'extraSubtitlesBackgroundColor', propValue: settings.subtitlesBackgroundColor });
    }, [settings.subtitlesBackgroundColor]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'extraSubtitlesOutlineColor', propValue: settings.subtitlesOutlineColor });
    }, [settings.subtitlesOutlineColor]);
    React.useEffect(() => {
        if (videoState.time !== null && !isNaN(videoState.time) && videoState.duration !== null && !isNaN(videoState.duration)) {
            updateLibraryItemState(videoState.time, videoState.duration);
        }
    }, [videoState.time, videoState.duration]);
    React.useEffect(() => {
        if (!Array.isArray(videoState.subtitlesTracks) || videoState.subtitlesTracks.length === 0) {
            closeSubtitlesMenu();
        }
    }, [videoState.subtitlesTracks]);
    React.useEffect(() => {
        if (player.metaItem === null) {
            closeInfoMenu();
        }
    }, [player]);
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            pushToLibrary();
        }, 30000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);
    React.useEffect(() => {
        const onCastStateChange = () => {
            setCasting(chromecast.active && chromecast.transport.getCastState() === cast.framework.CastState.CONNECTED);
        };
        const onChromecastStateChange = () => {
            if (chromecast.active) {
                chromecast.transport.on(
                    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                    onCastStateChange
                );
                onCastStateChange();
            }
        };
        chromecast.on('stateChanged', onChromecastStateChange);
        onChromecastStateChange();
        return () => {
            chromecast.off('stateChanged', onChromecastStateChange);
            if (chromecast.active) {
                chromecast.transport.off(
                    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                    onCastStateChange
                );
            }
        };
    }, []);
    React.useLayoutEffect(() => {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'Space': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && videoState.paused !== null) {
                        if (videoState.paused) {
                            onPlayRequested();
                        } else {
                            onPauseRequested();
                        }
                    }

                    break;
                }
                case 'ArrowRight': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && videoState.time !== null) {
                        const seekTimeMultiplier = event.shiftKey ? 3 : 1;
                        onSeekRequested(videoState.time + (settings.seekTimeDuration * seekTimeMultiplier));
                    }

                    break;
                }
                case 'ArrowLeft': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && videoState.time !== null) {
                        const seekTimeMultiplier = event.shiftKey ? 3 : 1;
                        onSeekRequested(videoState.time - (settings.seekTimeDuration * seekTimeMultiplier));
                    }

                    break;
                }
                case 'ArrowUp': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume + 5);
                    }

                    break;
                }
                case 'ArrowDown': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume - 5);
                    }

                    break;
                }
                case 'KeyS': {
                    closeInfoMenu();
                    if (Array.isArray(videoState.subtitlesTracks) && videoState.subtitlesTracks.length > 0) {
                        toggleSubtitlesMenu();
                    }

                    break;
                }
                case 'KeyI': {
                    closeSubtitlesMenu();
                    if (player.metaItem !== null) {
                        toggleInfoMenu();
                    }

                    break;
                }
                case 'Escape': {
                    closeSubtitlesMenu();
                    closeInfoMenu();
                    break;
                }
            }
        };
        if (routeFocused) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [player, settings.seekTimeDuration, routeFocused, subtitlesMenuOpen, infoMenuOpen, videoState.paused, videoState.time, videoState.volume, videoState.subtitlesTracks, toggleSubtitlesMenu, toggleInfoMenu]);
    React.useLayoutEffect(() => {
        return () => {
            setImmersedDebounced.cancel();
            onPlayRequestedDebounced.cancel();
            onPauseRequestedDebounced.cancel();
        };
    }, []);
    return (
        <div className={classnames(styles['player-container'], { [styles['immersed']]: immersed && !casting && videoState.paused !== null && !videoState.paused && !subtitlesMenuOpen && !infoMenuOpen })}
            onMouseDown={onContainerMouseDown}
            onMouseMove={onContainerMouseMove}
            onMouseOver={onContainerMouseMove}
            onMouseLeave={onContainerMouseLeave}>
            <Video
                ref={videoRef}
                className={styles['layer']}
                onEnded={onEnded}
                onError={onError}
                onPropValue={onPropChanged}
                onPropChanged={onPropChanged}
                onSubtitlesTrackLoaded={onSubtitlesTrackLoaded}
                onExtraSubtitlesTrackLoaded={onExtraSubtitlesTrackLoaded}
                onImplementationChanged={onImplementationChanged}
            />
            {
                videoState.buffering ?
                    <BufferingLoader className={styles['layer']} />
                    :
                    null
            }
            <div
                className={styles['layer']}
                onClick={onVideoClick}
                onDoubleClick={onVideoDoubleClick}
            />
            {
                error !== null ?
                    <div className={classnames(styles['layer'], styles['error-layer'])}>
                        <div className={styles['error-label']} title={error.message}>{error.message}</div>
                        {
                            player.selected !== null ?
                                <Button {...player.selected.stream.deepLinks.externalPlayer} className={styles['playlist-button']} title={'Open in external player'} target={'_blank'}>
                                    <Icon className={styles['icon']} icon={'ic_downloads'} />
                                    <div className={styles['label']}>Open in external player</div>
                                </Button>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
            {
                subtitlesMenuOpen || infoMenuOpen ?
                    <div className={styles['layer']} />
                    :
                    null
            }
            <HorizontalNavBar
                className={classnames(styles['layer'], styles['nav-bar-layer'])}
                title={player.title !== null ? player.title : ''}
                backButton={true}
                fullscreenButton={true}
                onMouseMove={onBarMouseMove}
                onMouseOver={onBarMouseMove}
            />
            <ControlBar
                className={classnames(styles['layer'], styles['control-bar-layer'])}
                paused={videoState.paused}
                time={videoState.time}
                duration={videoState.duration}
                volume={videoState.volume}
                muted={videoState.muted}
                subtitlesTracks={videoState.subtitlesTracks.concat(videoState.extraSubtitlesTracks)}
                infoAvailable={player.metaItem !== null}
                onPlayRequested={onPlayRequested}
                onPauseRequested={onPauseRequested}
                onMuteRequested={onMuteRequested}
                onUnmuteRequested={onUnmuteRequested}
                onVolumeChangeRequested={onVolumeChangeRequested}
                onSeekRequested={onSeekRequested}
                onToggleSubtitlesMenu={toggleSubtitlesMenu}
                onToggleInfoMenu={toggleInfoMenu}
                onMouseMove={onBarMouseMove}
                onMouseOver={onBarMouseMove}
            />
            {
                subtitlesMenuOpen ?
                    <SubtitlesMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        tracks={videoState.subtitlesTracks}
                        selectedTrackId={videoState.selectedSubtitlesTrackId}
                        extraTracks={videoState.extraSubtitlesTracks}
                        selectedExtraTrackId={videoState.selectedExtraSubtitlesTrackId}
                        extraDelay={videoState.extraSubtitlesDelay}
                        extraSize={videoState.extraSubtitlesSize}
                        extraOffset={videoState.extraSubtitlesOffset}
                        onTrackSelected={onSubtitlesTrackSelected}
                        onExtraTrackSelected={onExtraSubtitlesTrackSelected}
                        onExtraDelayChanged={onExtraSubtitlesDelayChanged}
                        onExtraSizeChanged={onSubtitlesSizeChanged}
                        onExtraOffsetChanged={onSubtitlesOffsetChanged}
                    />
                    :
                    null
            }
            {
                infoMenuOpen ?
                    <InfoMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        stream={player.selected !== null ? player.selected.stream : null}
                        addon={player.addon}
                        metaItem={player.metaItem}
                    />
                    :
                    null
            }
        </div>
    );
};

Player.propTypes = {
    urlParams: PropTypes.shape({
        stream: PropTypes.string,
        streamTransportUrl: PropTypes.string,
        metaTransportUrl: PropTypes.string,
        type: PropTypes.string,
        id: PropTypes.string,
        videoId: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Player;
