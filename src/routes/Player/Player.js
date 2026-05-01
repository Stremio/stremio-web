// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const langs = require('langs');
const { useTranslation } = require('react-i18next');
const { useRouteFocused } = require('stremio-router');
const { useServices, useGamepad } = require('stremio/services');
const { useContentGamepadNavigation } = require('stremio/services/GamepadNavigation');
const { useSettings, useProfile, useFullscreen, useBinaryState, useToast, useStreamingServer, withCoreSuspender, useShell, usePlatform, onShortcut } = require('stremio/common');
const { HorizontalNavBar, Transition, ContextMenu } = require('stremio/components');
const BufferingLoader = require('./BufferingLoader');
const VolumeChangeIndicator = require('./VolumeChangeIndicator');
const Error = require('./Error');
const ControlBar = require('./ControlBar');
const NextVideoPopup = require('./NextVideoPopup');
const StatisticsMenu = require('./StatisticsMenu');
const OptionsMenu = require('./OptionsMenu');
const SubtitlesMenu = require('./SubtitlesMenu');
const { default: AudioMenu } = require('./AudioMenu');
const SpeedMenu = require('./SpeedMenu');
const { default: SideDrawerButton } = require('./SideDrawerButton');
const { default: SideDrawer } = require('./SideDrawer');
const usePlayer = require('./usePlayer');
const useStatistics = require('./useStatistics');
const useVideo = require('./useVideo');
const { default: useSubtitles } = require('./useSubtitles');
const styles = require('./styles');
const Video = require('./Video');
const { default: Indicator } = require('./Indicator/Indicator');
const { default: useMediaSession } = require('./useMediaSession');

const findTrackByLang = (tracks, lang) => tracks.find((track) => track.lang === lang || langs.where('1', track.lang)?.[2] === lang);
const findTrackById = (tracks, id) => tracks.find((track) => track.id === id);

const GAMEPAD_HANDLER_ID = 'player';

const Player = ({ urlParams, queryParams }) => {
    const { t } = useTranslation();
    const services = useServices();
    const shell = useShell();
    const gamepad = useGamepad();
    const forceTranscoding = React.useMemo(() => {
        return queryParams.has('forceTranscoding');
    }, [queryParams]);
    const profile = useProfile();
    const [player, videoParamsChanged, streamStateChanged, timeChanged, seek, pausedChanged, ended, nextVideo] = usePlayer(urlParams);
    const [settings] = useSettings();
    const streamingServer = useStreamingServer();
    const statistics = useStatistics(player, streamingServer);
    const video = useVideo();
    const routeFocused = useRouteFocused();
    const platform = usePlatform();
    const toast = useToast();

    const [seeking, setSeeking] = React.useState(false);

    const [casting, setCasting] = React.useState(() => {
        return services.chromecast.active && services.chromecast.transport.getCastState() === cast.framework.CastState.CONNECTED;
    });
    const playbackDevices = React.useMemo(() => streamingServer.playbackDevices !== null && streamingServer.playbackDevices.type === 'Ready' ? streamingServer.playbackDevices.content : [], [streamingServer]);

    const playerRef = React.useRef(null);
    const bufferingRef = React.useRef();
    const errorRef = React.useRef();

    const [immersed, setImmersed] = React.useState(true);
    const setImmersedDebounced = React.useCallback(debounce(setImmersed, 3000), []);
    const [, , , toggleFullscreen] = useFullscreen();

    const [optionsMenuOpen, , closeOptionsMenu, toggleOptionsMenu] = useBinaryState(false);
    const [subtitlesMenuOpen, , closeSubtitlesMenu, toggleSubtitlesMenu] = useBinaryState(false);
    const [audioMenuOpen, , closeAudioMenu, toggleAudioMenu] = useBinaryState(false);
    const [speedMenuOpen, , closeSpeedMenu, toggleSpeedMenu] = useBinaryState(false);
    const [statisticsMenuOpen, , closeStatisticsMenu, toggleStatisticsMenu] = useBinaryState(false);
    const [nextVideoPopupOpen, openNextVideoPopup, closeNextVideoPopup] = useBinaryState(false);
    const [sideDrawerOpen, , closeSideDrawer, toggleSideDrawer] = useBinaryState(false);

    const menusOpen = React.useMemo(() => {
        return optionsMenuOpen || subtitlesMenuOpen || audioMenuOpen || speedMenuOpen || statisticsMenuOpen || sideDrawerOpen || nextVideoPopupOpen;
    }, [optionsMenuOpen, subtitlesMenuOpen, audioMenuOpen, speedMenuOpen, statisticsMenuOpen, sideDrawerOpen, nextVideoPopupOpen]);

    const closeMenus = React.useCallback(() => {
        closeOptionsMenu();
        closeSubtitlesMenu();
        closeAudioMenu();
        closeSpeedMenu();
        closeStatisticsMenu();
        closeSideDrawer();
    }, []);

    const {
        streamSubtitles,
        allSubtitleTracks,
        extraSubtitleTracks,
        selectedExtraSubtitleTrackId,
        subtitlesMenuProps,
    } = useSubtitles({
        player,
        video,
        settings,
        streamStateChanged,
        menusOpen,
        closeMenus,
        closeSubtitlesMenu,
        toggleSubtitlesMenu,
    });

    const overlayHidden = React.useMemo(() => {
        return immersed && !casting && video.state.paused !== null && !video.state.paused && !menusOpen;
    }, [immersed, casting, video.state.paused, menusOpen]);

    const nextVideoPopupDismissed = React.useRef(false);
    const defaultAudioTrackSelected = React.useRef(false);
    const playingOnExternalDevice = React.useRef(false);
    const [error, setError] = React.useState(null);

    const isNavigating = React.useRef(false);

    const VIDEO_SCALES = ['contain', 'cover', 'fill'];
    const VIDEO_SCALE_LABELS = { contain: t('PLAYER_SCALE_FIT'), cover: t('PLAYER_SCALE_CROP'), fill: t('PLAYER_SCALE_STRETCH') };

    const playbackSpeed = React.useRef(video.state.playbackSpeed || 1);
    const pressTimer = React.useRef(null);
    const longPress = React.useRef(false);
    const controlBarRef = React.useRef(null);

    const HOLD_DELAY = 400;

    const handleNextVideoNavigation = React.useCallback((deepLinks, bingeWatching, ended) => {
        if (ended) {
            if (bingeWatching) {
                if (deepLinks.player) {
                    isNavigating.current = true;
                    window.location.replace(deepLinks.player);
                } else if (deepLinks.metaDetailsStreams) {
                    isNavigating.current = true;
                    window.location.replace(deepLinks.metaDetailsStreams);
                }
            } else {
                window.history.back();
            }
        } else {
            if (deepLinks.player) {
                isNavigating.current = true;
                window.location.replace(deepLinks.player);
            } else if (deepLinks.metaDetailsStreams) {
                isNavigating.current = true;
                window.location.replace(deepLinks.metaDetailsStreams);
            }
        }
    }, []);

    const onEnded = React.useCallback(() => {
        // here we need to explicitly check for isNavigating.current
        // the ended event can be called multiple times by MPV inside Shell
        if (isNavigating.current) {
            return;
        }

        ended();
        if (window.playerNextVideo !== null) {
            nextVideo();

            const deepLinks = window.playerNextVideo.deepLinks;
            handleNextVideoNavigation(deepLinks, profile.settings.bingeWatching, true);

        } else {
            window.history.back();
        }
    }, []);

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

    const onPlayRequested = React.useCallback(() => {
        playingOnExternalDevice.current = false;
        video.setPaused(false);
        setSeeking(false);
    }, []);

    const onPlayRequestedDebounced = React.useCallback(debounce(onPlayRequested, 200), []);

    const onPauseRequested = React.useCallback(() => {
        video.setPaused(true);
    }, []);

    const onPauseRequestedDebounced = React.useCallback(debounce(onPauseRequested, 200), []);
    const onMuteRequested = React.useCallback(() => {
        video.setMuted(true);
    }, []);

    const onUnmuteRequested = React.useCallback(() => {
        video.setMuted(false);
    }, []);

    const onVolumeChangeRequested = React.useCallback((volume) => {
        video.setVolume(volume);
    }, []);

    const onSeekRequested = React.useCallback((time) => {
        video.setTime(time);
        seek(time, video.state.duration, video.state.manifest?.name);
    }, [video.state.duration, video.state.manifest]);

    const onPlaybackSpeedChanged = React.useCallback((rate, skipUpdate) => {
        video.setPlaybackSpeed(rate);

        if (skipUpdate) return;

        playbackSpeed.current = rate;

    }, []);

    const onVideoScaleChanged = React.useCallback(() => {
        const currentScale = video.state.videoScale || 'contain';
        const currentIndex = VIDEO_SCALES.indexOf(currentScale);
        const nextScale = VIDEO_SCALES[(currentIndex + 1) % VIDEO_SCALES.length];
        video.setVideoScale(nextScale);
    }, [video.state.videoScale]);

    const onAudioTrackSelected = React.useCallback((id) => {
        video.setAudioTrack(id);
        streamStateChanged({
            audioTrack: {
                id,
            },
        });
    }, [streamStateChanged]);

    const onDismissNextVideoPopup = React.useCallback(() => {
        closeNextVideoPopup();
        nextVideoPopupDismissed.current = true;
    }, []);

    const onNextVideoRequested = React.useCallback(() => {
        if (player.nextVideo !== null) {
            nextVideo();

            const deepLinks = player.nextVideo.deepLinks;
            handleNextVideoNavigation(deepLinks, profile.settings.bingeWatching, false);
        }
    }, [player.nextVideo, handleNextVideoNavigation, profile.settings]);

    const onVideoClick = React.useCallback(() => {
        if (video.state.paused !== null && !longPress.current) {
            if (video.state.paused) {
                onPlayRequestedDebounced();
            } else {
                onPauseRequestedDebounced();
            }
        }
    }, [video.state.paused, longPress.current]);

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
        if (!event.nativeEvent.audioMenuClosePrevented) {
            closeAudioMenu();
        }
        if (!event.nativeEvent.speedMenuClosePrevented) {
            closeSpeedMenu();
        }
        if (!event.nativeEvent.statisticsMenuClosePrevented) {
            closeStatisticsMenu();
        }

        closeSideDrawer();
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

    const onPlayPause = React.useCallback(() => {
        if (!menusOpen && !nextVideoPopupOpen && video.state.paused !== null) {
            if (video.state.paused) {
                onPlayRequested();
                setSeeking(false);
            } else {
                onPauseRequested();
            }
        }
    }, [menusOpen, nextVideoPopupOpen, video.state.paused]);

    const onSeekPrev = React.useCallback((event) => {
        if (!menusOpen && !nextVideoPopupOpen && video.state.time !== null) {
            const seekDuration = event?.shiftKey ? settings.seekShortTimeDuration : settings.seekTimeDuration;
            const seekTime = video.state.time - seekDuration;
            setSeeking(true);
            onSeekRequested(Math.max(seekTime, 0));
        }
    }, [menusOpen, nextVideoPopupOpen, video.state.time]);

    const onSeekNext = React.useCallback((event) => {
        if (!menusOpen && !nextVideoPopupOpen && video.state.time !== null) {
            const seekDuration = event?.shiftKey ? settings.seekShortTimeDuration : settings.seekTimeDuration;
            setSeeking(true);
            onSeekRequested(video.state.time + seekDuration);
        }
    }, [menusOpen, nextVideoPopupOpen, video.state.time]);

    const onVolumeUp = React.useCallback(() => {
        if (!menusOpen && !nextVideoPopupOpen && video.state.volume !== null) {
            onVolumeChangeRequested(Math.min(video.state.volume + 5, 200));
        }
    }, [menusOpen, nextVideoPopupOpen, video.state.volume]);

    const onVolumeDown = React.useCallback(() => {
        if (!menusOpen && !nextVideoPopupOpen && video.state.volume !== null) {
            onVolumeChangeRequested(Math.max(video.state.volume - 5, 0));
        }
    }, [menusOpen, nextVideoPopupOpen, video.state.volume]);

    const onGamepadSeekAndVol = React.useCallback((axis) => {
        switch(axis) {
            case 'left': {
                onSeekPrev();
                break;
            }
            case 'right': {
                onSeekNext();
                break;
            }
            case 'up': {
                onVolumeUp();
                break;
            }
            case 'down': {
                onVolumeDown();
                break;
            }
        }
    }, [onSeekPrev, onSeekNext, onVolumeUp, onVolumeDown]);

    useContentGamepadNavigation(playerRef, GAMEPAD_HANDLER_ID);

    React.useEffect(() => {
        gamepad?.on('buttonX', GAMEPAD_HANDLER_ID, onPlayPause);
        gamepad?.on('analogRight', GAMEPAD_HANDLER_ID, onGamepadSeekAndVol);

        return () => {
            gamepad?.off('buttonX', GAMEPAD_HANDLER_ID);
            gamepad?.off('analogRight', GAMEPAD_HANDLER_ID);
        };
    }, [onPlayPause, onGamepadSeekAndVol]);

    React.useEffect(() => {
        setError(null);
        video.unload();

        if (player.selected && player.stream?.type === 'Ready' && streamingServer.settings?.type !== 'Loading') {
            video.load({
                stream: {
                    ...player.stream.content,
                    subtitles: streamSubtitles
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
                maxAudioChannels: settings.surroundSound ? 32 : 2,
                hardwareDecoding: settings.hardwareDecoding,
                assSubtitlesStyling: settings.assSubtitlesStyling,
                videoMode: settings.videoMode,
                platform: platform.name,
                streamingServerURL: streamingServer.baseUrl ?
                    casting ?
                        streamingServer.baseUrl
                        :
                        streamingServer.selected.transportUrl
                    :
                    null,
                seriesInfo: player.seriesInfo,
            }, {
                chromecastTransport: services.chromecast.active ? services.chromecast.transport : null,
                shellTransport: services.shell.active ? services.shell.transport : null,
            });
        }
    }, [streamingServer.baseUrl, player.selected, player.stream, streamSubtitles, forceTranscoding, casting]);

    React.useEffect(() => {
        !seeking && timeChanged(video.state.time, video.state.duration, video.state.manifest?.name);
    }, [video.state.time, video.state.duration, video.state.manifest, seeking]);

    React.useEffect(() => {
        if (playingOnExternalDevice.current && video.state.paused === false) {
            onPauseRequested();
        } else if (video.state.paused !== null) {
            pausedChanged(video.state.paused);
        }
    }, [video.state.paused]);

    React.useEffect(() => {
        videoParamsChanged(video.state.videoParams);
    }, [video.state.videoParams]);

    React.useEffect(() => {
        if (player.nextVideo !== null && !nextVideoPopupDismissed.current) {
            if (video.state.time !== null && video.state.duration !== null && video.state.time < video.state.duration && (video.state.duration - video.state.time) <= settings.nextVideoNotificationDuration) {
                openNextVideoPopup();
            } else {
                closeNextVideoPopup();
            }
        }
        if (player.nextVideo) {
            // This is a workaround for the fact that when we call onEnded nextVideo from the player is already set to null since core unloads the stream
            // we explicitly set it to a global variable so we can access it in the onEnded function
            // this is not a good solution but it works for now
            window.playerNextVideo = player.nextVideo;
        } else {
            window.playerNextVideo = null;
        }
    }, [player.nextVideo, video.state.time, video.state.duration]);

    // Auto audio track selection
    React.useEffect(() => {
        if (!defaultAudioTrackSelected.current) {
            const savedTrackId = player.streamState?.audioTrack?.id;
            const audioTrack = savedTrackId ?
                findTrackById(video.state.audioTracks, savedTrackId) :
                findTrackByLang(video.state.audioTracks, settings.audioLanguage);

            if (audioTrack && audioTrack.id) {
                video.setAudioTrack(audioTrack.id);
                defaultAudioTrackSelected.current = true;
            }
        }
    }, [video.state.audioTracks, player.streamState]);

    React.useEffect(() => {
        defaultAudioTrackSelected.current = false;
        nextVideoPopupDismissed.current = false;
        playingOnExternalDevice.current = false;
        // we need a timeout here to make sure that previous page unloads and the new one loads
        // avoiding race conditions and flickering
        setTimeout(() => isNavigating.current = false, 1000);
    }, [video.state.stream]);

    React.useEffect(() => {
        if (!Array.isArray(video.state.audioTracks) || video.state.audioTracks.length === 0) {
            closeAudioMenu();
        }
    }, [video.state.audioTracks]);

    React.useEffect(() => {
        if (video.state.playbackSpeed === null) {
            closeSpeedMenu();
        }
    }, [video.state.playbackSpeed]);

    React.useEffect(() => {
        const toastFilter = (item) => item?.dataset?.type === 'CoreEvent';
        toast.addFilter(toastFilter);
        const onCastStateChange = () => {
            setCasting(services.chromecast.active && services.chromecast.transport.getCastState() === cast.framework.CastState.CONNECTED);
        };
        const onChromecastServiceStateChange = () => {
            onCastStateChange();
            if (services.chromecast.active) {
                services.chromecast.transport.on(
                    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                    onCastStateChange
                );
            }
        };
        const onCoreEvent = ({ event }) => {
            if (event === 'PlayingOnDevice') {
                playingOnExternalDevice.current = true;
                onPauseRequested();
            }
        };
        services.chromecast.on('stateChanged', onChromecastServiceStateChange);
        services.core.transport.on('CoreEvent', onCoreEvent);
        onChromecastServiceStateChange();
        return () => {
            toast.removeFilter(toastFilter);
            services.chromecast.off('stateChanged', onChromecastServiceStateChange);
            services.core.transport.off('CoreEvent', onCoreEvent);
            if (services.chromecast.active) {
                services.chromecast.transport.off(
                    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                    onCastStateChange
                );
            }
        };
    }, []);

    React.useEffect(() => {
        if (settings.pauseOnMinimize && (shell.windowClosed || shell.windowHidden)) {
            onPauseRequested();
        }
    }, [settings.pauseOnMinimize, shell.windowClosed, shell.windowHidden]);

    useMediaSession(video.state, player, onPlayRequested, onPauseRequested, onNextVideoRequested);

    React.useEffect(() => {
        const onMediaKey = (action) => {
            switch (action) {
                case 'play-pause':
                    video.state.paused ? onPlayRequested() : onPauseRequested();
                    break;
                case 'next-track':
                    if (player.nextVideo !== null) {
                        video.setTime(0);
                        onNextVideoRequested();
                    }
                    break;
                case 'previous-track':
                    if (video.state.time !== null && video.state.time > 5000) {
                        onSeekRequested(0);
                    }
                    break;
            }
        };
        shell.on('media-key', onMediaKey);
        return () => shell.off('media-key', onMediaKey);
    }, [video.state.paused, video.state.time, player.nextVideo, onPlayRequested, onPauseRequested, onNextVideoRequested, onSeekRequested]);

    onShortcut('seekForward', (combo) => {
        if (video.state.time !== null) {
            const seekDuration = combo === 1 ? settings.seekShortTimeDuration : settings.seekTimeDuration;
            setSeeking(true);
            onSeekRequested(video.state.time + seekDuration);
        }
    }, [video.state.time, onSeekRequested], !menusOpen);

    onShortcut('seekBackward', (combo) => {
        if (video.state.time !== null) {
            const seekDuration = combo === 1 ? settings.seekShortTimeDuration : settings.seekTimeDuration;
            setSeeking(true);
            onSeekRequested(video.state.time - seekDuration);
        }
    }, [video.state.time, onSeekRequested], !menusOpen);

    onShortcut('mute', () => {
        video.state.muted === true ? onUnmuteRequested() : onMuteRequested();
    }, [video.state.muted], !menusOpen);

    onShortcut('volumeUp', () => {
        if (video.state.volume !== null) {
            onVolumeChangeRequested(Math.min(video.state.volume + 5, 200));
        }
    }, [video.state.volume], !menusOpen);

    onShortcut('volumeDown', () => {
        if (video.state.volume !== null) {
            onVolumeChangeRequested(Math.max(video.state.volume - 5, 0));
        }
    }, [video.state.volume], !menusOpen);

    onShortcut('audioMenu', () => {
        closeMenus();
        if (video.state?.audioTracks?.length > 0) {
            toggleAudioMenu();
        }
    }, [video.state.audioTracks, toggleAudioMenu]);

    onShortcut('infoMenu', () => {
        closeMenus();
        if (player.metaItem?.type === 'Ready') {
            toggleSideDrawer();
        }
    }, [player.metaItem, toggleSideDrawer]);

    onShortcut('speedMenu', () => {
        closeMenus();
        if (video.state.playbackSpeed !== null) {
            toggleSpeedMenu();
        }
    }, [video.state.playbackSpeed, toggleSpeedMenu]);

    onShortcut('speedUp', () => {
        if (video.state.playbackSpeed !== null) {
            onPlaybackSpeedChanged(Math.min(video.state.playbackSpeed + 0.25, 2));
        }
    }, [video.state.playbackSpeed, onPlaybackSpeedChanged], !menusOpen);

    onShortcut('speedDown', () => {
        if (video.state.playbackSpeed !== null) {
            onPlaybackSpeedChanged(Math.max(video.state.playbackSpeed - 0.25, 0.25));
        }
    }, [video.state.playbackSpeed, onPlaybackSpeedChanged], !menusOpen);

    onShortcut('statisticsMenu', () => {
        closeMenus();
        const stream = player.selected?.stream;
        if (streamingServer?.statistics?.type !== 'Err' && typeof stream?.infoHash === 'string' && typeof stream?.fileIdx === 'number') {
            toggleStatisticsMenu();
        }
    }, [player.selected, streamingServer.statistics, toggleStatisticsMenu]);

    onShortcut('playNext', () => {
        closeMenus();
        if (window.playerNextVideo !== null) {
            nextVideo();
            const deepLinks = window.playerNextVideo.deepLinks;
            handleNextVideoNavigation(deepLinks, false, false);
        }
    }, []);

    onShortcut('exit', () => {
        closeMenus();
        !settings.escExitFullscreen && window.history.back();
    }, [settings.escExitFullscreen]);

    React.useLayoutEffect(() => {
        if (menusOpen) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
            longPress.current = false;
        }

        const onKeyDown = (e) => {
            if (e.code !== 'Space' || e.repeat) return;
            if (menusOpen) return;

            longPress.current = false;

            pressTimer.current = setTimeout(() => {
                longPress.current = true;
                onPlaybackSpeedChanged(2, true);
            }, HOLD_DELAY);
        };

        const onKeyUp = (e) => {
            if (e.code !== 'Space' && e.code !== 'ArrowRight' && e.code !== 'ArrowLeft') return;

            if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
                setSeeking(false);
                return;
            }
            if (e.code === 'Space') {
                clearTimeout(pressTimer.current);
                pressTimer.current = null;
                if (longPress.current) {
                    onPlaybackSpeedChanged(playbackSpeed.current);
                } else if (!menusOpen && video.state.paused !== null) {
                    if (video.state.paused) {
                        onPlayRequested();
                        setSeeking(false);
                    } else {
                        onPauseRequested();
                    }
                }
                longPress.current = false;
            }
        };

        const onWheel = ({ deltaY }) => {
            if (menusOpen || video.state.volume === null) return;

            if (deltaY > 0) {
                onVolumeChangeRequested(Math.max(video.state.volume - 5, 0));
            } else {
                if (video.state.volume < 100) {
                    onVolumeChangeRequested(Math.min(video.state.volume + 5, 100));
                }
            }
        };

        const onMouseDownHold = (e) => {
            if (e.button !== 0) return; // left mouse button only
            if (menusOpen) return;
            if (controlBarRef.current && controlBarRef.current.contains(e.target)) return;

            longPress.current = false;

            pressTimer.current = setTimeout(() => {
                longPress.current = true;
                onPlaybackSpeedChanged(2, true);
            }, HOLD_DELAY);
        };

        const onMouseUp = (e) => {
            if (e.button !== 0) return;

            clearTimeout(pressTimer.current);

            if (longPress.current) {
                onPlaybackSpeedChanged(playbackSpeed.current);
            }
        };

        const onBlur = () => {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
            if (longPress.current) {
                onPlaybackSpeedChanged(playbackSpeed.current);
                longPress.current = false;
            }
            setSeeking(false);
        };

        if (routeFocused) {
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('wheel', onWheel);
            window.addEventListener('mousedown', onMouseDownHold);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('blur', onBlur);
        }
        return () => {
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('mousedown', onMouseDownHold);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('blur', onBlur);
        };
    }, [routeFocused, menusOpen, video.state.volume, video.state.paused]);

    React.useEffect(() => {
        video.events.on('error', onError);
        video.events.on('ended', onEnded);

        return () => {
            video.events.off('error', onError);
            video.events.off('ended', onEnded);
        };
    }, []);

    React.useLayoutEffect(() => {
        return () => {
            setImmersedDebounced.cancel();
            onPlayRequestedDebounced.cancel();
            onPauseRequestedDebounced.cancel();
        };
    }, []);

    return (
        <div ref={playerRef} className={classnames(styles['player-container'], { [styles['overlayHidden']]: overlayHidden })}
            onMouseDown={onContainerMouseDown}
            onMouseMove={onContainerMouseMove}
            onMouseOver={onContainerMouseMove}
            onMouseLeave={onContainerMouseLeave}>
            <Video
                ref={video.containerRef}
                className={styles['layer']}
                onClick={onVideoClick}
                onDoubleClick={onVideoDoubleClick}
            />
            {
                !video.state.loaded ?
                    <div className={classnames(styles['layer'], styles['background-layer'])}>
                        <img className={styles['image']} src={player?.metaItem?.content?.background} />
                    </div>
                    :
                    null
            }
            {
                (video.state.buffering || !video.state.loaded) && !error ?
                    <BufferingLoader
                        ref={bufferingRef}
                        className={classnames(styles['layer'], styles['buffering-layer'])}
                        logo={player?.metaItem?.content?.logo}
                    />
                    :
                    null
            }
            {
                error !== null ?
                    <Error
                        ref={errorRef}
                        className={classnames(styles['layer'], styles['error-layer'])}
                        stream={video.state.stream}
                        {...error}
                    />
                    :
                    null
            }
            {
                menusOpen ?
                    <div className={styles['layer']} />
                    :
                    null
            }
            {
                video.state.volume !== null && overlayHidden ?
                    <VolumeChangeIndicator
                        muted={video.state.muted}
                        volume={video.state.volume}
                    />
                    :
                    null
            }
            <ContextMenu on={[video.containerRef, bufferingRef, errorRef]} autoClose>
                <OptionsMenu
                    className={classnames(styles['layer'], styles['menu-layer'])}
                    stream={player?.selected?.stream}
                    playbackDevices={playbackDevices}
                    extraSubtitlesTracks={extraSubtitleTracks}
                    selectedExtraSubtitlesTrackId={selectedExtraSubtitleTrackId}
                />
            </ContextMenu>
            <HorizontalNavBar
                className={classnames(styles['layer'], styles['nav-bar-layer'])}
                title={player.title !== null ? player.title : ''}
                backButton={true}
                fullscreenButton={true}
                hdrInfo={video.state.hdrInfo}
                onMouseMove={onBarMouseMove}
                onMouseOver={onBarMouseMove}
            />
            {
                player.metaItem?.type === 'Ready' ?
                    <SideDrawerButton
                        className={classnames(styles['layer'], styles['side-drawer-button-layer'])}
                        onClick={toggleSideDrawer}
                    />
                    :
                    null
            }
            <ControlBar
                ref={controlBarRef}
                className={classnames(styles['layer'], styles['control-bar-layer'])}
                paused={video.state.paused}
                time={video.state.time}
                duration={video.state.duration}
                buffered={video.state.buffered}
                volume={video.state.volume}
                muted={video.state.muted}
                playbackSpeed={video.state.playbackSpeed}
                subtitlesTracks={allSubtitleTracks}
                audioTracks={video.state.audioTracks}
                metaItem={player.metaItem}
                nextVideo={player.nextVideo}
                stream={player.selected !== null ? player.selected.stream : null}
                statistics={statistics}
                onPlayRequested={onPlayRequested}
                onPauseRequested={onPauseRequested}
                onNextVideoRequested={onNextVideoRequested}
                onMuteRequested={onMuteRequested}
                onUnmuteRequested={onUnmuteRequested}
                onVolumeChangeRequested={onVolumeChangeRequested}
                onSeekRequested={onSeekRequested}
                onToggleOptionsMenu={toggleOptionsMenu}
                onToggleSubtitlesMenu={toggleSubtitlesMenu}
                onToggleAudioMenu={toggleAudioMenu}
                onToggleSpeedMenu={toggleSpeedMenu}
                videoScale={video.state.videoScale}
                videoScaleLabel={VIDEO_SCALE_LABELS[video.state.videoScale || 'contain']}
                onVideoScaleChanged={onVideoScaleChanged}
                onToggleStatisticsMenu={toggleStatisticsMenu}
                onToggleSideDrawer={toggleSideDrawer}
                onMouseMove={onBarMouseMove}
                onMouseOver={onBarMouseMove}
                onTouchEnd={onContainerMouseLeave}
            />
            <Indicator
                className={classnames(styles['layer'], styles['indicator-layer'])}
                videoState={video.state}
                disabled={subtitlesMenuOpen}
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
            <Transition when={statisticsMenuOpen} name={'fade'}>
                <StatisticsMenu
                    className={classnames(styles['layer'], styles['menu-layer'])}
                    {...statistics}
                />
            </Transition>
            <Transition when={sideDrawerOpen} name={'slide-left'}>
                <SideDrawer
                    className={classnames(styles['layer'], styles['side-drawer-layer'])}
                    metaItem={player.metaItem?.content}
                    seriesInfo={player.seriesInfo}
                    closeSideDrawer={closeSideDrawer}
                    selected={player.selected?.streamRequest?.path.id}
                />
            </Transition>
            <Transition when={subtitlesMenuOpen} name={'fade'}>
                <SubtitlesMenu
                    className={classnames(styles['layer'], styles['menu-layer'])}
                    {...subtitlesMenuProps}
                />
            </Transition>
            <Transition when={audioMenuOpen} name={'fade'}>
                <AudioMenu
                    className={classnames(styles['layer'], styles['menu-layer'])}
                    audioTracks={video.state.audioTracks}
                    selectedAudioTrackId={video.state.selectedAudioTrackId}
                    onAudioTrackSelected={onAudioTrackSelected}
                />
            </Transition>
            <Transition when={speedMenuOpen} name={'fade'}>
                <SpeedMenu
                    className={classnames(styles['layer'], styles['menu-layer'])}
                    playbackSpeed={video.state.playbackSpeed}
                    onPlaybackSpeedChanged={onPlaybackSpeedChanged}
                />
            </Transition>
            <Transition when={optionsMenuOpen} name={'fade'}>
                <OptionsMenu
                    className={classnames(styles['layer'], styles['menu-layer'])}
                    stream={player.selected?.stream}
                    playbackDevices={playbackDevices}
                    extraSubtitlesTracks={extraSubtitleTracks}
                    selectedExtraSubtitlesTrackId={selectedExtraSubtitleTrackId}
                />
            </Transition>
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
