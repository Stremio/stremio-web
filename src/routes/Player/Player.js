const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { HorizontalNavBar, useDeepEqualEffect, useFullscreen, useBinaryState, useToast, useProfile } = require('stremio/common');
const BufferingLoader = require('./BufferingLoader');
const ControlBar = require('./ControlBar');
const InfoMenu = require('./InfoMenu');
const SubtitlesMenu = require('./SubtitlesMenu');
const Video = require('./Video');
const useInfo = require('./useInfo');
const usePlayer = require('./usePlayer');
const useSettings = require('./useSettings');
const styles = require('./styles');

const Player = ({ urlParams }) => {
    const { core } = useServices();
    const profile = useProfile();
    const [player, updateLibraryItemState, pushToLibrary] = usePlayer(urlParams);
    const [settings, updateSettings] = useSettings(profile);
    const info = useInfo(player, profile);
    const routeFocused = useRouteFocused();
    const toast = useToast();
    const [, , , toggleFullscreen] = useFullscreen();
    const [immersed, setImmersed] = React.useState(true);
    const setImmersedDebounced = React.useCallback(debounce(setImmersed, 3000), []);
    const [subtitlesMenuOpen, , closeSubtitlesMenu, toggleSubtitlesMenu] = useBinaryState(false);
    const [infoMenuOpen, , closeInfoMenu, toggleInfoMenu] = useBinaryState(false);
    const [error, setError] = React.useState(null);
    const [videoState, setVideoState] = React.useReducer(
        (videoState, nextVideoState) => ({ ...videoState, ...nextVideoState }),
        {
            paused: null,
            time: null,
            duration: null,
            buffering: null,
            volume: null,
            muted: null,
            subtitlesTracks: [],
            selectedSubtitlesTrackId: null,
            subtitlesSize: null,
            subtitlesDelay: null,
            subtitlesOffset: null,
            subtitlesTextColor: null,
            subtitlesBackgroundColor: null,
            subtitlesOutlineColor: null
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
            dispatch({ observedPropName: propName });
        });
        dispatch({ propName: 'subtitlesSize', propValue: settings.subtitles_size });
        dispatch({ propName: 'subtitlesTextColor', propValue: settings.subtitles_text_color });
        dispatch({ propName: 'subtitlesBackgroundColor', propValue: settings.subtitles_background_color });
        dispatch({ propName: 'subtitlesOutlineColor', propValue: settings.subtitles_outline_color });
        dispatch({ propName: 'subtitlesOffset', propValue: settings.subtitles_offset });
    }, [settings.subtitles_size, settings.subtitles_text_color, settings.subtitles_background_color, settings.subtitles_outline_color, settings.subtitles_offset]);
    const onPropChanged = React.useCallback((propName, propValue) => {
        setVideoState({ [propName]: propValue });
    }, []);
    const onEnded = React.useCallback(() => {
        core.dispatch({ action: 'Unload' }, 'player');
        if (player.lib_item !== null) {
            core.dispatch({
                action: 'Ctx',
                args: {
                    action: 'RewindLibraryItem',
                    args: player.lib_item._id
                }
            });
        }
        if (player.next_video !== null) {
            // TODO go to next video
        }
        window.history.back();
    }, [player]);
    const onError = React.useCallback((error) => {
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
    const onSubtitlesTrackLoaded = React.useCallback((track) => {
        toast.show({
            type: 'success',
            title: 'Subtitles loaded',
            message: `Subtitles from ${track.origin} loaded`,
            timeout: 3000
        });
    }, []);
    const onPlayRequested = React.useCallback(() => {
        dispatch({ propName: 'paused', propValue: false });
    }, []);
    const onPlayRequestedDebounced = React.useCallback(debounce(onPlayRequested, 200), []);
    const onPauseRequested = React.useCallback(() => {
        dispatch({ propName: 'paused', propValue: true });
    }, []);
    const onPauseRequestedDebounced = React.useCallback(debounce(onPauseRequested, 200), []);
    const onMuteRequested = React.useCallback(() => {
        dispatch({ propName: 'muted', propValue: true });
    }, []);
    const onUnmuteRequested = React.useCallback(() => {
        dispatch({ propName: 'muted', propValue: false });
    }, []);
    const onVolumeChangeRequested = React.useCallback((volume) => {
        dispatch({ propName: 'volume', propValue: volume });
    }, []);
    const onSeekRequested = React.useCallback((time) => {
        dispatch({ propName: 'time', propValue: time });
    }, []);
    const onSubtitlesTrackSelected = React.useCallback((trackId) => {
        dispatch({ propName: 'selectedSubtitlesTrackId', propValue: trackId });
    }, []);
    const onSubtitlesDelayChanged = React.useCallback((delay) => {
        dispatch({ propName: 'subtitlesDelay', propValue: delay });
    }, []);
    const onSubtitlesSizeChanged = React.useCallback((size) => {
        updateSettings({ subtitles_size: size });
    }, [updateSettings]);
    const onSubtitlesOffsetChanged = React.useCallback((offset) => {
        updateSettings({ subtitles_offset: offset });
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
            dispatch({ commandName: 'stop' });
        } else {
            dispatch({
                commandName: 'load',
                commandArgs: {
                    stream: player.selected.stream,
                    streamingServerUrl: settings.streaming_server_url,
                    autoplay: true,
                    time: player.lib_item !== null && player.selected.video_id !== null && player.lib_item.state.video_id === player.selected.video_id ?
                        player.lib_item.state.timeOffset
                        :
                        0
                }
            });
            if (Array.isArray(player.selected.stream.subtitles)) {
                dispatch({
                    commandName: 'addSubtitlesTracks',
                    commandArgs: {
                        tracks: player.selected.stream.subtitles.map(({ url, lang }) => ({
                            url,
                            lang,
                            origin: 'EMBEDDED IN STREAM'
                        }))
                    }
                });
            }
        }
    }, [player.selected]);
    useDeepEqualEffect(() => {
        dispatch({
            commandName: 'addSubtitlesTracks',
            commandArgs: {
                tracks: player.subtitles_resources
                    .filter((subtitles_resource) => subtitles_resource.content.type === 'Ready')
                    .reduce((tracks, subtitles_resource) => {
                        return tracks.concat(subtitles_resource.content.content.map(({ url, lang }) => ({
                            url,
                            lang,
                            origin: subtitles_resource.addon !== null ? subtitles_resource.addon.manifest.name : subtitles_resource.request.base
                        })));
                    }, [])
            }
        });
    }, [player.selected, player.subtitles_resources]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesSize', propValue: settings.subtitles_size });
    }, [settings.subtitles_size]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesTextColor', propValue: settings.subtitles_text_color });
    }, [settings.subtitles_text_color]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesBackgroundColor', propValue: settings.subtitles_background_color });
    }, [settings.subtitles_background_color]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesOutlineColor', propValue: settings.subtitles_outline_color });
    }, [settings.subtitles_outline_color]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesOffset', propValue: settings.subtitles_offset });
    }, [settings.subtitles_offset]);
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
        if (info === null) {
            closeInfoMenu();
        }
    }, [info]);
    React.useEffect(() => {
        const intervalId = setInterval(pushToLibrary, 30000);
        return () => {
            clearInterval(intervalId);
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
                        onSeekRequested(videoState.time + 15000);
                    }

                    break;
                }
                case 'ArrowLeft': {
                    if (!subtitlesMenuOpen && !infoMenuOpen && videoState.time !== null) {
                        onSeekRequested(videoState.time - 15000);
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
                    if (info !== null) {
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
    }, [routeFocused, subtitlesMenuOpen, infoMenuOpen, info, videoState.paused, videoState.time, videoState.volume, videoState.subtitlesTracks, toggleSubtitlesMenu, toggleInfoMenu]);
    React.useLayoutEffect(() => {
        return () => {
            setImmersedDebounced.cancel();
            onPlayRequestedDebounced.cancel();
            onPauseRequestedDebounced.cancel();
        };
    }, []);
    return (
        <div className={classnames(styles['player-container'], { [styles['immersed']]: immersed && videoState.paused !== null && !videoState.paused && !subtitlesMenuOpen && !infoMenuOpen })}
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
                onImplementationChanged={onImplementationChanged}
            />
            {
                videoState.buffering ?
                    <BufferingLoader className={styles['layer']} />
                    :
                    error !== null ?
                        <div className={classnames(styles['layer'], styles['error-layer'])}>
                            <div className={styles['error-label']}>{error.message}</div>
                        </div>
                        :
                        null
            }
            <div
                className={styles['layer']}
                onClick={onVideoClick}
                onDoubleClick={onVideoDoubleClick}
            />
            {
                subtitlesMenuOpen || infoMenuOpen ?
                    <div className={styles['layer']} />
                    :
                    null
            }
            <HorizontalNavBar
                className={classnames(styles['layer'], styles['nav-bar-layer'])}
                title={info !== null ? info.title : ''}
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
                subtitlesTracks={videoState.subtitlesTracks}
                info={info}
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
                        offset={videoState.subtitlesOffset}
                        size={videoState.subtitlesSize}
                        delay={videoState.subtitlesDelay}
                        textColor={videoState.subtitlesTextColor}
                        backgroundColor={videoState.subtitlesBackgroundColor}
                        outlineColor={videoState.subtitlesOutlineColor}
                        onTrackSelected={onSubtitlesTrackSelected}
                        onDelayChanged={onSubtitlesDelayChanged}
                        onSizeChanged={onSubtitlesSizeChanged}
                        onOffsetChanged={onSubtitlesOffsetChanged}
                    />
                    :
                    null
            }
            {
                infoMenuOpen ?
                    <InfoMenu
                        className={classnames(styles['layer'], styles['menu-layer'])}
                        stream={info !== null ? info.stream : null}
                        addon={info !== null ? info.addon : null}
                        metaItem={info !== null ? info.metaItem : null}
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
    })
};

module.exports = Player;
