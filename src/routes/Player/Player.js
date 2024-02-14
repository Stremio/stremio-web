// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const langs = require('langs');
const { useTranslation } = require('react-i18next');
const { useServices } = require('stremio/services');
const { HorizontalNavBar, useFullscreen, useBinaryState, useToast, useStreamingServer, useKeyboardEvent, useMouseEvent, withCoreSuspender } = require('stremio/common');
const BufferingLoader = require('./BufferingLoader');
const VolumeChangeIndicator = require('./VolumeChangeIndicator');
const Error = require('./Error');
const ControlBar = require('./ControlBar');
const NextVideoPopup = require('./NextVideoPopup');
const usePlayer = require('./usePlayer');
const useSettings = require('./useSettings');
const useVideo = require('./useVideo');
const styles = require('./styles');
const Video = require('./Video');

const Player = ({ urlParams, queryParams }) => {
    const { t } = useTranslation();
    const { chromecast, shell, core } = useServices();
    const forceTranscoding = React.useMemo(() => {
        return queryParams.has('forceTranscoding');
    }, [queryParams]);

    const [player, videoParamsChanged, timeChanged, pausedChanged, ended, nextVideo] = usePlayer(urlParams);
    const [settings, updateSettings] = useSettings();
    const streamingServer = useStreamingServer();
    const video = useVideo();
    const toast = useToast();

    const [casting, setCasting] = React.useState(() => {
        return chromecast.active && chromecast.transport.getCastState() === cast.framework.CastState.CONNECTED;
    });

    const [immersed, setImmersed] = React.useState(true);
    const setImmersedDebounced = React.useCallback(debounce(setImmersed, 3000), []);
    const [,,, toggleFullscreen] = useFullscreen();

    const [areMenusOpen, setMenusState] = React.useState(false);
    const [nextVideoPopupOpen, openNextVideoPopup, closeNextVideoPopup] = useBinaryState(false);

    const ignoreShortcuts = React.useMemo(() => {
        return areMenusOpen || nextVideoPopupOpen;
    }, [areMenusOpen, nextVideoPopupOpen]);

    const overlayHidden = React.useMemo(() => {
        return immersed && !casting && video.state.paused !== null && !video.state.paused && !areMenusOpen && !nextVideoPopupOpen;
    }, [immersed, casting, video.state.paused, areMenusOpen, nextVideoPopupOpen]);

    const nextVideoPopupDismissed = React.useRef(false);
    const defaultSubtitlesSelected = React.useRef(false);
    const defaultAudioTrackSelected = React.useRef(false);
    const [error, setError] = React.useState(null);

    const onImplementationChanged = React.useCallback(() => {
        video.setProp('subtitlesSize', settings.subtitlesSize);
        video.setProp('subtitlesOffset', settings.subtitlesOffset);
        video.setProp('subtitlesTextColor', settings.subtitlesTextColor);
        video.setProp('subtitlesBackgroundColor', settings.subtitlesBackgroundColor);
        video.setProp('subtitlesOutlineColor', settings.subtitlesOutlineColor);
        video.setProp('extraSubtitlesSize', settings.subtitlesSize);
        video.setProp('extraSubtitlesOffset', settings.subtitlesOffset);
        video.setProp('extraSubtitlesTextColor', settings.subtitlesTextColor);
        video.setProp('extraSubtitlesBackgroundColor', settings.subtitlesBackgroundColor);
        video.setProp('extraSubtitlesOutlineColor', settings.subtitlesOutlineColor);
    }, [settings.subtitlesSize, settings.subtitlesOffset, settings.subtitlesTextColor, settings.subtitlesBackgroundColor, settings.subtitlesOutlineColor]);

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
        video.setProp('paused', false);
    }, []);

    const onPlayRequestedDebounced = React.useCallback(debounce(onPlayRequested, 200), []);

    const onPauseRequested = React.useCallback(() => {
        video.setProp('paused', true);
    }, []);

    const onPauseRequestedDebounced = React.useCallback(debounce(onPauseRequested, 200), []);

    const onPlayPauseRequested = React.useCallback(() => {
        video.state.paused ? onPlayRequested() : onPauseRequested();
    }, [video.state.paused]);

    const onMuteRequested = React.useCallback(() => {
        video.setProp('muted', true);
    }, []);

    const onUnmuteRequested = React.useCallback(() => {
        video.setProp('muted', false);
    }, []);

    const onVolumeChangeRequested = React.useCallback((volume) => {
        video.setProp('volume', volume);
    }, []);

    const onVolumeIncreaseRequested = React.useCallback(() => {
        video.state.volume !== null && onVolumeChangeRequested(video.state.volume + 5);
    }, [video.state.volume]);

    const onVolumeDereaseRequested = React.useCallback(() => {
        video.state.volume !== null && onVolumeChangeRequested(video.state.volume - 5);
    }, [video.state.volume]);

    const onSeekRequested = React.useCallback((time) => {
        video.setProp('time', time);
    }, []);

    const onSeekForwardRequested = React.useCallback((short) => {
        const duration = short ? settings.seekShortTimeDuration : settings.seekTimeDuration;
        video.state.time !== null && onSeekRequested(video.state.time + duration);
    }, [video.state.time]);

    const onSeekBackwardRequested = React.useCallback((short) => {
        const duration = short ? settings.seekShortTimeDuration : settings.seekTimeDuration;
        video.state.time !== null && onSeekRequested(video.state.time - duration);
    }, [video.state.time]);

    const onPlaybackSpeedChangeRequested = React.useCallback((rate) => {
        video.setProp('playbackSpeed', rate);
    }, []);

    const onSubtitlesTrackSelected = React.useCallback((id) => {
        video.setProp('selectedSubtitlesTrackId', id);
        video.setProp('selectedExtraSubtitlesTrackId', null);
    }, []);

    const onExtraSubtitlesTrackSelected = React.useCallback((id) => {
        video.setProp('selectedSubtitlesTrackId', null);
        video.setProp('selectedExtraSubtitlesTrackId', id);
    }, []);

    const onAudioTrackSelected = React.useCallback((id) => {
        video.setProp('selectedAudioTrackId', id);
    }, []);

    const onExtraSubtitlesDelayChanged = React.useCallback((delay) => {
        video.setProp('extraSubtitlesDelay', delay);
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
            nextVideo();

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
        if (video.state.paused !== null) {
            if (video.state.paused) {
                onPlayRequestedDebounced();
            } else {
                onPauseRequestedDebounced();
            }
        }
    }, [video.state.paused]);

    const onVideoDoubleClick = React.useCallback(() => {
        onPlayRequestedDebounced.cancel();
        onPauseRequestedDebounced.cancel();
        toggleFullscreen();
    }, [toggleFullscreen]);

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
            video.unload();
        } else if (player.selected.metaRequest === null || (player.metaItem !== null && player.metaItem.type !== 'Loading')) {
            video.load({
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
                maxAudioChannels: settings.surroundSound ? 32 : 2,
                streamingServerURL: streamingServer.baseUrl ?
                    casting ?
                        streamingServer.baseUrl
                        :
                        streamingServer.selected.transportUrl
                    :
                    null,
                seriesInfo: player.seriesInfo
            }, {
                chromecastTransport: chromecast.active ? chromecast.transport : null,
                shellTransport: shell.active ? shell.transport : null,
            });
        }
    }, [streamingServer.baseUrl, player.selected, player.metaItem, forceTranscoding, casting]);
    React.useEffect(() => {
        if (video.state.stream !== null) {
            const tracks = player.subtitles.map((subtitles) => ({
                ...subtitles,
                label: subtitles.url
            }));
            video.addExtraSubtitlesTracks(tracks);
        }
    }, [player.subtitles, video.state.stream]);

    React.useEffect(() => {
        video.setProp('subtitlesSize', settings.subtitlesSize);
        video.setProp('extraSubtitlesSize', settings.subtitlesSize);
    }, [settings.subtitlesSize]);

    React.useEffect(() => {
        video.setProp('subtitlesOffset', settings.subtitlesOffset);
        video.setProp('extraSubtitlesOffset', settings.subtitlesOffset);
    }, [settings.subtitlesOffset]);

    React.useEffect(() => {
        video.setProp('subtitlesTextColor', settings.subtitlesTextColor);
        video.setProp('extraSubtitlesTextColor', settings.subtitlesTextColor);
    }, [settings.subtitlesTextColor]);

    React.useEffect(() => {
        video.setProp('subtitlesBackgroundColor', settings.subtitlesBackgroundColor);
        video.setProp('extraSubtitlesBackgroundColor', settings.subtitlesBackgroundColor);
    }, [settings.subtitlesBackgroundColor]);

    React.useEffect(() => {
        video.setProp('subtitlesOutlineColor', settings.subtitlesOutlineColor);
        video.setProp('extraSubtitlesOutlineColor', settings.subtitlesOutlineColor);
    }, [settings.subtitlesOutlineColor]);

    React.useEffect(() => {
        if (video.state.time !== null && !isNaN(video.state.time) &&
            video.state.duration !== null && !isNaN(video.state.duration) &&
            video.state.manifest !== null && typeof video.state.manifest.name === 'string') {
            timeChanged(video.state.time, video.state.duration, video.state.manifest.name);
        }
    }, [video.state.time, video.state.duration, video.state.manifest]);

    React.useEffect(() => {
        if (video.state.paused !== null) {
            pausedChanged(video.state.paused);
        }
    }, [video.state.paused]);

    React.useEffect(() => {
        videoParamsChanged(video.state.videoParams);
    }, [video.state.videoParams]);

    React.useEffect(() => {
        if (!!settings.bingeWatching && player.nextVideo !== null && !nextVideoPopupDismissed.current) {
            if (video.state.time !== null && video.state.duration !== null && video.state.time < video.state.duration && (video.state.duration - video.state.time) <= settings.nextVideoNotificationDuration) {
                openNextVideoPopup();
            } else {
                closeNextVideoPopup();
            }
        }
    }, [player.nextVideo, video.state.time, video.state.duration]);

    React.useEffect(() => {
        if (!defaultSubtitlesSelected.current) {
            const findTrackByLang = (tracks, lang) => tracks.find((track) => track.lang === lang || langs.where('1', track.lang)?.[2] === lang);

            const subtitlesTrack = findTrackByLang(video.state.subtitlesTracks, settings.subtitlesLanguage);
            const extraSubtitlesTrack = findTrackByLang(video.state.extraSubtitlesTracks, settings.subtitlesLanguage);

            if (subtitlesTrack && subtitlesTrack.id) {
                onSubtitlesTrackSelected(subtitlesTrack.id);
                defaultSubtitlesSelected.current = true;
            } else if (extraSubtitlesTrack && extraSubtitlesTrack.id) {
                onExtraSubtitlesTrackSelected(extraSubtitlesTrack.id);
                defaultSubtitlesSelected.current = true;
            }
        }
    }, [video.state.subtitlesTracks, video.state.extraSubtitlesTracks]);

    React.useEffect(() => {
        if (!defaultAudioTrackSelected.current) {
            const findTrackByLang = (tracks, lang) => tracks.find((track) => track.lang === lang || langs.where('1', track.lang)?.[2] === lang);
            const audioTrack = findTrackByLang(video.state.audioTracks, settings.audioLanguage);

            if (audioTrack && audioTrack.id) {
                onAudioTrackSelected(audioTrack.id);
                defaultAudioTrackSelected.current = true;
            }
        }
    }, [video.state.audioTracks]);

    React.useEffect(() => {
        defaultSubtitlesSelected.current = false;
        defaultAudioTrackSelected.current = false;
        nextVideoPopupDismissed.current = false;
    }, [video.state.stream]);

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

    useKeyboardEvent('Space', onPlayPauseRequested, ignoreShortcuts);
    useKeyboardEvent('ArrowRight', onSeekForwardRequested, ignoreShortcuts);
    useKeyboardEvent('ArrowLeft', onSeekBackwardRequested, ignoreShortcuts);
    useKeyboardEvent('ArrowUp', onVolumeIncreaseRequested, ignoreShortcuts);
    useKeyboardEvent('ArrowDown', onVolumeDereaseRequested, ignoreShortcuts);
    useMouseEvent('ScrollUp', onVolumeIncreaseRequested, ignoreShortcuts);
    useMouseEvent('ScrollDown', onVolumeDereaseRequested, ignoreShortcuts);

    React.useEffect(() => {
        video.events.on('error', onError);
        video.events.on('ended', onEnded);
        video.events.on('subtitlesTrackLoaded', onSubtitlesTrackLoaded);
        video.events.on('extraSubtitlesTrackLoaded', onExtraSubtitlesTrackLoaded);
        video.events.on('implementationChanged', onImplementationChanged);

        return () => {
            video.events.off('error', onError);
            video.events.off('ended', onEnded);
            video.events.off('subtitlesTrackLoaded', onSubtitlesTrackLoaded);
            video.events.off('extraSubtitlesTrackLoaded', onExtraSubtitlesTrackLoaded);
            video.events.off('implementationChanged', onImplementationChanged);
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
        <div className={classnames(styles['player-container'], { [styles['overlayHidden']]: overlayHidden })}
            onMouseMove={onContainerMouseMove}
            onMouseOver={onContainerMouseMove}
            onMouseLeave={onContainerMouseLeave}
        >
            <Video
                ref={video.containerElement}
                className={styles['layer']}
                onClick={onVideoClick}
                onDoubleClick={onVideoDoubleClick}
            />
            {
                video.state.buffering ?
                    <BufferingLoader className={styles['layer']} logo={player?.metaItem?.content?.logo} />
                    :
                    null
            }
            {
                error !== null ?
                    <Error
                        className={styles['layer']}
                        stream={video.state.stream}
                        {...error}
                    />
                    :
                    null
            }
            {
                areMenusOpen ?
                    <div className={styles['layer']} />
                    :
                    null
            }
            {
                video.state.volume !== null && overlayHidden ?
                    <VolumeChangeIndicator
                        muted={video.state.muted}
                        volume={video.state.volume}
                        onVolumeChangeRequested={onVolumeChangeRequested}
                    />
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
                video={video}
                player={player}
                streamingServer={streamingServer}
                onPlayPauseRequested={onPlayPauseRequested}
                onNextVideoRequested={onNextVideoRequested}
                onMuteRequested={onMuteRequested}
                onUnmuteRequested={onUnmuteRequested}
                onVolumeChangeRequested={onVolumeChangeRequested}
                onSeekRequested={onSeekRequested}
                onPlaybackSpeedChangeRequested={onPlaybackSpeedChangeRequested}
                onSubtitlesTrackSelected={onSubtitlesTrackSelected}
                onExtraSubtitlesTrackSelected={onExtraSubtitlesTrackSelected}
                onAudioTrackSelected={onAudioTrackSelected}
                onSubtitlesOffsetChanged={onSubtitlesOffsetChanged}
                onSubtitlesSizeChanged={onSubtitlesSizeChanged}
                onExtraSubtitlesDelayChanged={onExtraSubtitlesDelayChanged}
                onMenuChange={setMenusState}
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
