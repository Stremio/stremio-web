// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const langs = require('langs');
const { useTranslation } = require('react-i18next');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { HorizontalNavBar, Button, useFullscreen, useBinaryState, useToast, useStreamingServer, withCoreSuspender } = require('stremio/common');
const { default: Icon } = require('@stremio/stremio-icons/react');
const BufferingLoader = require('./BufferingLoader');
const ControlBar = require('./ControlBar');
const NextVideoPopup = require('./NextVideoPopup');
const StatisticsMenu = require('./StatisticsMenu');
const InfoMenu = require('./InfoMenu');
const OptionsMenu = require('./OptionsMenu');
const VideosMenu = require('./VideosMenu');
const SubtitlesMenu = require('./SubtitlesMenu');
const SpeedMenu = require('./SpeedMenu');
const Video = require('./Video');
const usePlayer = require('./usePlayer');
const useSettings = require('./useSettings');
const styles = require('./styles');

const Player = ({ urlParams, queryParams }) => {
    const { t } = useTranslation();
    const { chromecast, shell, core } = useServices();
    const [forceTranscoding, maxAudioChannels] = React.useMemo(() => {
        return [
            queryParams.has('forceTranscoding'),
            queryParams.has('maxAudioChannels') ? parseInt(queryParams.get('maxAudioChannels'), 10) : null
        ];
    }, [queryParams]);
    const [player, videoParamsChanged, timeChanged, pausedChanged, ended] = usePlayer(urlParams);
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
    const [optionsMenuOpen, , closeOptionsMenu, toggleOptionsMenu] = useBinaryState(false);
    const [subtitlesMenuOpen, , closeSubtitlesMenu, toggleSubtitlesMenu] = useBinaryState(false);
    const [infoMenuOpen, , closeInfoMenu, toggleInfoMenu] = useBinaryState(false);
    const [speedMenuOpen, , closeSpeedMenu, toggleSpeedMenu] = useBinaryState(false);
    const [videosMenuOpen, , closeVideosMenu, toggleVideosMenu] = useBinaryState(false);
    const [nextVideoPopupOpen, openNextVideoPopup, closeNextVideoPopup] = useBinaryState(false);
    const [statisticsMenuOpen, , closeStatisticsMenu, toggleStatisticsMenu] = useBinaryState(false);
    const nextVideoPopupDismissed = React.useRef(false);
    const defaultSubtitlesSelected = React.useRef(false);
    const defaultAudioTrackSelected = React.useRef(false);
    const [error, setError] = React.useState(null);
    const [videoState, setVideoState] = React.useReducer(
        (videoState, nextVideoState) => ({ ...videoState, ...nextVideoState }),
        {
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
            extraSubtitlesOutlineColor: null
        }
    );
    const videoRef = React.useRef(null);
    const dispatch = React.useCallback((action, options) => {
        if (videoRef.current !== null) {
            videoRef.current.dispatch(action, options);
        }
    }, []);
    const onImplementationChanged = React.useCallback((manifest) => {
        setVideoState({ manifest });
        manifest.props.forEach((propName) => {
            dispatch({ type: 'observeProp', propName });
        });
        dispatch({ type: 'setProp', propName: 'subtitlesSize', propValue: settings.subtitlesSize });
        dispatch({ type: 'setProp', propName: 'subtitlesOffset', propValue: settings.subtitlesOffset });
        dispatch({ type: 'setProp', propName: 'subtitlesTextColor', propValue: settings.subtitlesTextColor });
        dispatch({ type: 'setProp', propName: 'subtitlesBackgroundColor', propValue: settings.subtitlesBackgroundColor });
        dispatch({ type: 'setProp', propName: 'subtitlesOutlineColor', propValue: settings.subtitlesOutlineColor });
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
        ended();
        if (player.nextVideo !== null) {
            onNextVideoRequested();
        } else {
            window.history.back();
        }
    }, [player.nextVideo, onNextVideoRequested]);
    const onError = React.useCallback((error) => {
        console.error('Player', error);
        if (error.critical) {
            setError(error);
        } else {
            toast.show({
                type: 'error',
                title: t('ERROR'),
                message: error.message,
                timeout: 3000
            });
        }
    }, []);
    const onSubtitlesTrackLoaded = React.useCallback(() => {
        toast.show({
            type: 'success',
            title: t('PLAYER_SUBTITLES_LOADED'),
            message: t('PLAYER_SUBTITLES_LOADED_EMBEDDED'),
            timeout: 3000
        });
    }, []);
    const onExtraSubtitlesTrackLoaded = React.useCallback((track) => {
        toast.show({
            type: 'success',
            title: t('PLAYER_SUBTITLES_LOADED'),
            message: track.exclusive ? t('PLAYER_SUBTITLES_LOADED_EXCLUSIVE') : t('PLAYER_SUBTITLES_LOADED_ORIGIN', { origin: track.origin }),
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
    const onPlaybackSpeedChanged = React.useCallback((rate) => {
        dispatch({ type: 'setProp', propName: 'playbackSpeed', propValue: rate });
    }, []);
    const onSubtitlesTrackSelected = React.useCallback((id) => {
        dispatch({ type: 'setProp', propName: 'selectedSubtitlesTrackId', propValue: id });
        dispatch({ type: 'setProp', propName: 'selectedExtraSubtitlesTrackId', propValue: null });
    }, []);
    const onExtraSubtitlesTrackSelected = React.useCallback((id) => {
        dispatch({ type: 'setProp', propName: 'selectedSubtitlesTrackId', propValue: null });
        dispatch({ type: 'setProp', propName: 'selectedExtraSubtitlesTrackId', propValue: id });
    }, []);
    const onAudioTrackSelected = React.useCallback((id) => {
        dispatch({ type: 'setProp', propName: 'selectedAudioTrackId', propValue: id });
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
    const onDismissNextVideoPopup = React.useCallback(() => {
        closeNextVideoPopup();
        nextVideoPopupDismissed.current = true;
    }, []);
    const onNextVideoRequested = React.useCallback(() => {
        if (player.nextVideo !== null) {
            const deepLinks = player.nextVideo.deepLinks;
            if (deepLinks.metaDetailsStreams && deepLinks.player) {
                window.location.replace(deepLinks.metaDetailsStreams);
                window.location.href = deepLinks.player;
            } else {
                window.location.replace(deepLinks.player ?? deepLinks.metaDetailsStreams);
            }
        }
    }, [player.nextVideo]);
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
        if (!event.nativeEvent.optionsMenuClosePrevented) {
            closeOptionsMenu();
        }
        if (!event.nativeEvent.subtitlesMenuClosePrevented) {
            closeSubtitlesMenu();
        }
        if (!event.nativeEvent.infoMenuClosePrevented) {
            closeInfoMenu();
        }
        if (!event.nativeEvent.speedMenuClosePrevented) {
            closeSpeedMenu();
        }
        if (!event.nativeEvent.videosMenuClosePrevented) {
            closeVideosMenu();
        }
        if (!event.nativeEvent.statisticsMenuClosePrevented) {
            closeStatisticsMenu();
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
    React.useEffect(() => {
        setError(null);
        if (player.selected === null) {
            dispatch({ type: 'command', commandName: 'unload' });
        } else if (streamingServer.baseUrl !== null && streamingServer.baseUrl.type !== 'Loading' &&
            (player.selected.metaRequest === null || (player.metaItem !== null && player.metaItem.type !== 'Loading'))) {
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
                    time: player.libraryItem !== null &&
                        player.selected.streamRequest !== null &&
                        player.selected.streamRequest.path !== null &&
                        player.libraryItem.state.video_id === player.selected.streamRequest.path.id ?
                        player.libraryItem.state.timeOffset
                        :
                        0,
                    forceTranscoding: forceTranscoding || casting,
                    maxAudioChannels: typeof maxAudioChannels === 'number' ?
                        maxAudioChannels
                        :
                        null,
                    streamingServerURL: streamingServer.baseUrl.type === 'Ready' ?
                        casting ?
                            streamingServer.baseUrl.content
                            :
                            streamingServer.selected.transportUrl
                        :
                        null,
                    seriesInfo: player.seriesInfo
                }
            }, {
                chromecastTransport: chromecast.active ? chromecast.transport : null,
                shellTransport: shell.active ? shell.transport : null,
            });
        }
    }, [streamingServer.baseUrl, player.selected, player.metaItem, forceTranscoding, maxAudioChannels, casting]);
    React.useEffect(() => {
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
        dispatch({ type: 'setProp', propName: 'subtitlesSize', propValue: settings.subtitlesSize });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesSize', propValue: settings.subtitlesSize });
    }, [settings.subtitlesSize]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'subtitlesOffset', propValue: settings.subtitlesOffset });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesOffset', propValue: settings.subtitlesOffset });
    }, [settings.subtitlesOffset]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'subtitlesTextColor', propValue: settings.subtitlesTextColor });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesTextColor', propValue: settings.subtitlesTextColor });
    }, [settings.subtitlesTextColor]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'subtitlesBackgroundColor', propValue: settings.subtitlesBackgroundColor });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesBackgroundColor', propValue: settings.subtitlesBackgroundColor });
    }, [settings.subtitlesBackgroundColor]);
    React.useEffect(() => {
        dispatch({ type: 'setProp', propName: 'subtitlesOutlineColor', propValue: settings.subtitlesOutlineColor });
        dispatch({ type: 'setProp', propName: 'extraSubtitlesOutlineColor', propValue: settings.subtitlesOutlineColor });
    }, [settings.subtitlesOutlineColor]);
    React.useEffect(() => {
        if (videoState.time !== null && !isNaN(videoState.time) &&
            videoState.duration !== null && !isNaN(videoState.duration) &&
            videoState.manifest !== null && typeof videoState.manifest.name === 'string') {
            timeChanged(videoState.time, videoState.duration, videoState.manifest.name);
        }
    }, [videoState.time, videoState.duration, videoState.manifest]);
    React.useEffect(() => {
        if (videoState.paused !== null) {
            pausedChanged(videoState.paused);
        }
    }, [videoState.paused]);
    React.useEffect(() => {
        videoParamsChanged(videoState.videoParams);
    }, [videoState.videoParams]);
    React.useEffect(() => {
        if (!!settings.bingeWatching && player.nextVideo !== null && !nextVideoPopupDismissed.current) {
            if (videoState.time !== null && videoState.duration !== null && videoState.time < videoState.duration && (videoState.duration - videoState.time) <= settings.nextVideoNotificationDuration) {
                openNextVideoPopup();
            } else {
                closeNextVideoPopup();
            }
        }
    }, [player.nextVideo, videoState.time, videoState.duration]);
    React.useEffect(() => {
        if (player.selected && player.selected.stream && typeof player.selected.stream.infoHash === 'string' && typeof player.selected.stream.fileIdx === 'number') {
            const { infoHash, fileIdx } = player.selected.stream;
            const getStatistics = () => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'GetStatistics',
                        args: {
                            infoHash,
                            fileIdx,
                        }
                    }
                });
            };
            getStatistics();
            const statisticsInterval = setInterval(getStatistics, 5000);
            return () => clearInterval(statisticsInterval);
        }
    }, [player.selected]);
    React.useEffect(() => {
        if (!defaultSubtitlesSelected.current) {
            const findTrackByLang = (tracks, lang) => tracks.find((track) => track.lang === lang || langs.where('1', track.lang)?.[2] === lang);

            const subtitlesTrack = findTrackByLang(videoState.subtitlesTracks, settings.subtitlesLanguage);
            const extraSubtitlesTrack = findTrackByLang(videoState.extraSubtitlesTracks, settings.subtitlesLanguage);

            if (subtitlesTrack && subtitlesTrack.id) {
                onSubtitlesTrackSelected(subtitlesTrack.id);
                defaultSubtitlesSelected.current = true;
            } else if (extraSubtitlesTrack && extraSubtitlesTrack.id) {
                onExtraSubtitlesTrackSelected(extraSubtitlesTrack.id);
                defaultSubtitlesSelected.current = true;
            }
        }
    }, [videoState.subtitlesTracks, videoState.extraSubtitlesTracks]);
    React.useEffect(() => {
        if (!defaultAudioTrackSelected.current) {
            const findTrackByLang = (tracks, lang) => tracks.find((track) => track.lang === lang || langs.where('1', track.lang)?.[2] === lang);
            const audioTrack = findTrackByLang(videoState.audioTracks, settings.audioLanguage);

            if (audioTrack && audioTrack.id) {
                onAudioTrackSelected(audioTrack.id);
                defaultAudioTrackSelected.current = true;
            }
        }
    }, [videoState.audioTracks]);
    React.useEffect(() => {
        defaultSubtitlesSelected.current = false;
        defaultAudioTrackSelected.current = false;
        nextVideoPopupDismissed.current = false;
    }, [videoState.stream]);
    React.useEffect(() => {
        if ((!Array.isArray(videoState.subtitlesTracks) || videoState.subtitlesTracks.length === 0) &&
            (!Array.isArray(videoState.extraSubtitlesTracks) || videoState.extraSubtitlesTracks.length === 0) &&
            (!Array.isArray(videoState.audioTracks) || videoState.audioTracks.length === 0)) {
            closeSubtitlesMenu();
        }
    }, [videoState.audioTracks, videoState.subtitlesTracks, videoState.extraSubtitlesTracks]);
    React.useEffect(() => {
        if (player.metaItem === null || player.metaItem.type !== 'Ready') {
            closeInfoMenu();
            closeVideosMenu();
        }
    }, [player.metaItem]);
    React.useEffect(() => {
        if (videoState.playbackSpeed === null) {
            closeSpeedMenu();
        }
    }, [videoState.playbackSpeed]);
    React.useEffect(() => {
        const toastFilter = (item) => item?.dataset?.type === 'CoreEvent';
        toast.addFilter(toastFilter);
        const onCastStateChange = () => {
            setCasting(chromecast.active && chromecast.transport.getCastState() === cast.framework.CastState.CONNECTED);
        };
        const onChromecastServiceStateChange = () => {
            onCastStateChange();
            if (chromecast.active) {
                chromecast.transport.on(
                    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                    onCastStateChange
                );
            }
        };
        const onCoreEvent = ({ event }) => {
            if (event === 'PlayingOnDevice') {
                onPauseRequested();
            }
        };
        chromecast.on('stateChanged', onChromecastServiceStateChange);
        core.transport.on('CoreEvent', onCoreEvent);
        onChromecastServiceStateChange();
        return () => {
            toast.removeFilter(toastFilter);
            chromecast.off('stateChanged', onChromecastServiceStateChange);
            core.transport.off('CoreEvent', onCoreEvent);
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
                    if (!subtitlesMenuOpen && !infoMenuOpen && !videosMenuOpen && !speedMenuOpen && !optionsMenuOpen && !statisticsMenuOpen && videoState.paused !== null) {
                        if (videoState.paused) {
                            onPlayRequested();
                        } else {
                            onPauseRequested();
                        }
                    }

                    break;
                }
                case 'ArrowRight': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && !videosMenuOpen && !speedMenuOpen && !optionsMenuOpen && !statisticsMenuOpen && videoState.time !== null) {
                        const seekDuration = event.shiftKey ? settings.seekShortTimeDuration : settings.seekTimeDuration;
                        onSeekRequested(videoState.time + seekDuration);
                    }

                    break;
                }
                case 'ArrowLeft': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && !videosMenuOpen && !speedMenuOpen && !optionsMenuOpen && !statisticsMenuOpen && videoState.time !== null) {
                        const seekDuration = event.shiftKey ? settings.seekShortTimeDuration : settings.seekTimeDuration;
                        onSeekRequested(videoState.time - seekDuration);
                    }

                    break;
                }
                case 'ArrowUp': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && !videosMenuOpen && !speedMenuOpen && !optionsMenuOpen && !statisticsMenuOpen && videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume + 5);
                    }

                    break;
                }
                case 'ArrowDown': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && !videosMenuOpen && !speedMenuOpen && !optionsMenuOpen && !statisticsMenuOpen && videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume - 5);
                    }

                    break;
                }
                case 'KeyS': {
                    closeOptionsMenu();
                    closeInfoMenu();
                    closeSpeedMenu();
                    closeVideosMenu();
                    closeStatisticsMenu();
                    if ((Array.isArray(videoState.subtitlesTracks) && videoState.subtitlesTracks.length > 0) ||
                        (Array.isArray(videoState.extraSubtitlesTracks) && videoState.extraSubtitlesTracks.length > 0) ||
                        (Array.isArray(videoState.audioTracks) && videoState.audioTracks.length > 0)) {
                        toggleSubtitlesMenu();
                    }

                    break;
                }
                case 'KeyI': {
                    closeOptionsMenu();
                    closeSubtitlesMenu();
                    closeSpeedMenu();
                    closeVideosMenu();
                    closeStatisticsMenu();
                    if (player.metaItem !== null && player.metaItem.type === 'Ready') {
                        toggleInfoMenu();
                    }

                    break;
                }
                case 'KeyR': {
                    closeOptionsMenu();
                    closeInfoMenu();
                    closeSubtitlesMenu();
                    closeVideosMenu();
                    closeStatisticsMenu();
                    if (videoState.playbackSpeed !== null) {
                        toggleSpeedMenu();
                    }

                    break;
                }
                case 'KeyV': {
                    closeOptionsMenu();
                    closeInfoMenu();
                    closeSubtitlesMenu();
                    closeSpeedMenu();
                    closeStatisticsMenu();
                    if (player.metaItem !== null && player.metaItem.type === 'Ready') {
                        toggleVideosMenu();
                    }

                    break;
                }
                case 'KeyD': {
                    closeOptionsMenu();
                    closeInfoMenu();
                    closeSubtitlesMenu();
                    closeSpeedMenu();
                    closeVideosMenu();
                    if (streamingServer.statistics !== null && streamingServer.statistics.type !== 'Err' && player.selected && typeof player.selected.stream.infoHash === 'string' && typeof player.selected.stream.fileIdx === 'number') {
                        toggleStatisticsMenu();
                    }

                    break;
                }
                case 'Escape': {
                    closeOptionsMenu();
                    closeSubtitlesMenu();
                    closeInfoMenu();
                    closeSpeedMenu();
                    closeVideosMenu();
                    closeStatisticsMenu();
                    onDismissNextVideoPopup();
                    break;
                }
            }
        };
        const onWheel = ({ deltaY }) => {
            if (deltaY > 0) {
                if (!subtitlesMenuOpen && !infoMenuOpen && !videosMenuOpen && !speedMenuOpen && !optionsMenuOpen && !statisticsMenuOpen && videoState.volume !== null) {
                    onVolumeChangeRequested(videoState.volume - 5);
                }
            } else {
                if (!subtitlesMenuOpen && !infoMenuOpen && !videosMenuOpen && !speedMenuOpen && !optionsMenuOpen && !statisticsMenuOpen && videoState.volume !== null) {
                    onVolumeChangeRequested(videoState.volume + 5);
                }
            }
        };
        if (routeFocused) {
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('wheel', onWheel);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('wheel', onWheel);
        };
    }, [player.metaItem, player.selected, streamingServer.statistics, settings.seekTimeDuration, settings.seekShortTimeDuration, routeFocused, subtitlesMenuOpen, infoMenuOpen, videosMenuOpen, speedMenuOpen, optionsMenuOpen, statisticsMenuOpen, videoState.paused, videoState.time, videoState.volume, videoState.audioTracks, videoState.subtitlesTracks, videoState.extraSubtitlesTracks, videoState.playbackSpeed, toggleSubtitlesMenu, toggleInfoMenu, toggleVideosMenu, toggleStatisticsMenu]);
    React.useLayoutEffect(() => {
        return () => {
            setImmersedDebounced.cancel();
            onPlayRequestedDebounced.cancel();
            onPauseRequestedDebounced.cancel();
        };
    }, []);
    return (
        <div className={classnames(styles['player-container'], { [styles['immersed']]: immersed && !casting && videoState.paused !== null && !videoState.paused && !subtitlesMenuOpen && !infoMenuOpen && !speedMenuOpen && !videosMenuOpen && !nextVideoPopupOpen && !optionsMenuOpen && !statisticsMenuOpen })}
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
                    <BufferingLoader className={styles['layer']} logo={player?.metaItem?.content?.logo} />
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
                            error.code === 2 ?
                                <div className={styles['error-sub']} title={t('EXTERNAL_PLAYER_HINT')}>{t('EXTERNAL_PLAYER_HINT')}</div>
                                :
                                null
                        }
                        {
                            player.selected !== null ?
                                <Button className={styles['playlist-button']} title={t('PLAYER_OPEN_IN_EXTERNAL')} href={player.selected.stream.deepLinks.externalPlayer.href} download={player.selected.stream.deepLinks.externalPlayer.fileName} target={'_blank'}>
                                    <Icon className={styles['icon']} name={'ic_downloads'} />
                                    <div className={styles['label']}>{t('PLAYER_OPEN_IN_EXTERNAL')}</div>
                                </Button>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
            {
                subtitlesMenuOpen || infoMenuOpen || videosMenuOpen || speedMenuOpen || optionsMenuOpen || statisticsMenuOpen ?
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
                buffered={videoState.buffered}
                volume={videoState.volume}
                muted={videoState.muted}
                playbackSpeed={videoState.playbackSpeed}
                subtitlesTracks={videoState.subtitlesTracks.concat(videoState.extraSubtitlesTracks)}
                audioTracks={videoState.audioTracks}
                metaItem={player.metaItem}
                nextVideo={player.nextVideo}
                stream={player.selected !== null ? player.selected.stream : null}
                statistics={streamingServer.statistics}
                onPlayRequested={onPlayRequested}
                onPauseRequested={onPauseRequested}
                onNextVideoRequested={onNextVideoRequested}
                onMuteRequested={onMuteRequested}
                onUnmuteRequested={onUnmuteRequested}
                onVolumeChangeRequested={onVolumeChangeRequested}
                onSeekRequested={onSeekRequested}
                onToggleOptionsMenu={toggleOptionsMenu}
                onToggleSubtitlesMenu={toggleSubtitlesMenu}
                onToggleInfoMenu={toggleInfoMenu}
                onToggleSpeedMenu={toggleSpeedMenu}
                onToggleVideosMenu={toggleVideosMenu}
                onToggleStatisticsMenu={toggleStatisticsMenu}
                onMouseMove={onBarMouseMove}
                onMouseOver={onBarMouseMove}
            />
            {
                nextVideoPopupOpen ?
                    <NextVideoPopup
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        metaItem={player.metaItem !== null && player.metaItem.type === 'Ready' ? player.metaItem.content : null}
                        nextVideo={player.nextVideo}
                        onDismiss={onDismissNextVideoPopup}
                        onNextVideoRequested={onNextVideoRequested}
                    />
                    :
                    null
            }
            {
                statisticsMenuOpen ?
                    <StatisticsMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        stream={player.selected !== null ? player.selected.stream : null}
                        statistics={streamingServer.statistics}
                    />
                    :
                    null
            }
            {
                subtitlesMenuOpen ?
                    <SubtitlesMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        audioTracks={videoState.audioTracks}
                        selectedAudioTrackId={videoState.selectedAudioTrackId}
                        subtitlesTracks={videoState.subtitlesTracks}
                        selectedSubtitlesTrackId={videoState.selectedSubtitlesTrackId}
                        subtitlesOffset={videoState.subtitlesOffset}
                        subtitlesSize={videoState.subtitlesSize}
                        extraSubtitlesTracks={videoState.extraSubtitlesTracks}
                        selectedExtraSubtitlesTrackId={videoState.selectedExtraSubtitlesTrackId}
                        extraSubtitlesOffset={videoState.extraSubtitlesOffset}
                        extraSubtitlesDelay={videoState.extraSubtitlesDelay}
                        extraSubtitlesSize={videoState.extraSubtitlesSize}
                        onSubtitlesTrackSelected={onSubtitlesTrackSelected}
                        onExtraSubtitlesTrackSelected={onExtraSubtitlesTrackSelected}
                        onAudioTrackSelected={onAudioTrackSelected}
                        onSubtitlesOffsetChanged={onSubtitlesOffsetChanged}
                        onSubtitlesSizeChanged={onSubtitlesSizeChanged}
                        onExtraSubtitlesOffsetChanged={onSubtitlesOffsetChanged}
                        onExtraSubtitlesDelayChanged={onExtraSubtitlesDelayChanged}
                        onExtraSubtitlesSizeChanged={onSubtitlesSizeChanged}
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
                        metaItem={player.metaItem !== null && player.metaItem.type === 'Ready' ? player.metaItem.content : null}
                    />
                    :
                    null
            }
            {
                speedMenuOpen ?
                    <SpeedMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        playbackSpeed={videoState.playbackSpeed}
                        onPlaybackSpeedChanged={onPlaybackSpeedChanged}
                    />
                    :
                    null
            }
            {
                videosMenuOpen ?
                    <VideosMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        metaItem={player.metaItem !== null && player.metaItem.type === 'Ready' ? player.metaItem.content : null}
                        seriesInfo={player.seriesInfo}
                    />
                    :
                    null
            }
            {
                optionsMenuOpen ?
                    <OptionsMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        stream={player.selected.stream}
                        playbackDevices={streamingServer.playbackDevices !== null && streamingServer.playbackDevices.type === 'Ready' ? streamingServer.playbackDevices.content : []}
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

const PlayerFallback = () => (
    <div className={classnames(styles['player-container'])} />
);

module.exports = withCoreSuspender(Player, PlayerFallback);
