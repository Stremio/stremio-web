const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { HorizontalNavBar, useDeepEqualEffect, useDeepEqualMemo, useFullscreen, useBinaryState, useToast } = require('stremio/common');
const BufferingLoader = require('./BufferingLoader');
const ControlBar = require('./ControlBar');
const SubtitlesPicker = require('./SubtitlesPicker');
const Video = require('./Video');
const usePlayer = require('./usePlayer');
const useSettings = require('./useSettings');
const styles = require('./styles');

const Player = ({ urlParams }) => {
    const { core } = useServices();
    const player = usePlayer(urlParams);
    const [settings, updateSettings] = useSettings();
    const routeFocused = useRouteFocused();
    const toast = useToast();
    const [, , , toggleFullscreen] = useFullscreen();
    const [immersed, setImmersed] = React.useState(true);
    const setImmersedDebounced = React.useCallback(debounce(setImmersed, 3000), []);
    const [subtitlesPickerOpen, , closeSubtitlesPicker, toggleSubtitlesPicker] = useBinaryState(false);
    const [metaPreviewOpen, , closeMetaPreview, toggleMetaPreview] = useBinaryState(false);
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
    const onEnded = useDeepEqualMemo(() => () => {
        core.dispatch({ action: 'Unload' }, 'Player');
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
    }, [player.next_video, player.lib_item]);
    const onError = React.useCallback((error) => {
        if (error.critical) {
            setError(error);
        } else {
            toast.show({
                type: 'error',
                title: 'Error',
                message: error.message,
                icon: 'ic_warning',
                timeout: 10000
            });
        }
    }, []);
    const onPlayRequested = React.useCallback(() => {
        dispatch({ propName: 'paused', propValue: false });
    }, []);
    const onPauseRequested = React.useCallback(() => {
        dispatch({ propName: 'paused', propValue: true });
    }, []);
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
                onPlayRequested();
            } else {
                onPauseRequested();
            }
        }
    }, [videoState.paused]);
    const onContainerMouseDown = React.useCallback((event) => {
        if (!event.nativeEvent.subtitlesPickerClosePrevented) {
            closeSubtitlesPicker();
        }
        if (!event.nativeEvent.metaPreviewClosePrevented) {
            closeMetaPreview();
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
            dispatch({
                commandName: 'addSubtitlesTracks',
                commandArgs: {
                    tracks: player.selected.stream.subtitles
                }
            });
        }
    }, [player.selected]);
    useDeepEqualEffect(() => {
        dispatch({
            commandName: 'addSubtitlesTracks',
            commandArgs: {
                tracks: player.subtitles_resources
                    .filter((subtitles_resource) => subtitles_resource.content.type === 'Ready')
                    .reduce((tracks, subtitles_resource) => {
                        return tracks.concat(subtitles_resource.content.content);
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
            core.dispatch({
                action: 'Player',
                args: {
                    action: 'UpdateLibraryItemState',
                    args: {
                        time: videoState.time,
                        duration: videoState.duration
                    }
                }
            });
        }
    }, [videoState.time, videoState.duration]);
    React.useLayoutEffect(() => {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'Space': {
                    if (!subtitlesPickerOpen && !metaPreviewOpen && videoState.paused !== null) {
                        if (videoState.paused) {
                            onPlayRequested();
                        } else {
                            onPauseRequested();
                        }
                    }

                    break;
                }
                case 'ArrowRight': {
                    if (!subtitlesPickerOpen && !metaPreviewOpen && videoState.time !== null) {
                        onSeekRequested(videoState.time + 15000);
                    }

                    break;
                }
                case 'ArrowLeft': {
                    if (!subtitlesPickerOpen && !metaPreviewOpen && videoState.time !== null) {
                        onSeekRequested(videoState.time - 15000);
                    }

                    break;
                }
                case 'ArrowUp': {
                    if (!subtitlesPickerOpen && !metaPreviewOpen && videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume + 5);
                    }

                    break;
                }
                case 'ArrowDown': {
                    if (!subtitlesPickerOpen && !metaPreviewOpen && videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume - 5);
                    }

                    break;
                }
                case 'KeyS': {
                    closeMetaPreview();
                    toggleSubtitlesPicker();
                    break;
                }
                case 'KeyM': {
                    closeSubtitlesPicker();
                    toggleMetaPreview();
                    break;
                }
                case 'Escape': {
                    closeSubtitlesPicker();
                    closeMetaPreview();
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
    }, [routeFocused, subtitlesPickerOpen, metaPreviewOpen, videoState.paused, videoState.time, videoState.volume, toggleSubtitlesPicker, toggleMetaPreview]);
    React.useLayoutEffect(() => {
        return () => {
            setImmersedDebounced.cancel();
        };
    }, []);
    return (
        <div className={classnames(styles['player-container'], { [styles['immersed']]: immersed && videoState.paused !== null && !videoState.paused && !subtitlesPickerOpen && !metaPreviewOpen })}
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
                onDoubleClick={toggleFullscreen}
            />
            <HorizontalNavBar
                className={classnames(styles['layer'], styles['nav-bar-layer'])}
                title={
                    // TODO consider use video.title and fallback to stream.title
                    player.meta_resource !== null && player.meta_resource.content.type === 'Ready' ?
                        player.meta_resource.content.content.name
                        :
                        null
                }
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
                metaResource={null}
                onPlayRequested={onPlayRequested}
                onPauseRequested={onPauseRequested}
                onMuteRequested={onMuteRequested}
                onUnmuteRequested={onUnmuteRequested}
                onVolumeChangeRequested={onVolumeChangeRequested}
                onSeekRequested={onSeekRequested}
                onToggleSubtitlesPicker={toggleSubtitlesPicker}
                onToggleMetaPreview={toggleMetaPreview}
                onMouseMove={onBarMouseMove}
                onMouseOver={onBarMouseMove}
            />
            {
                subtitlesPickerOpen ?
                    <SubtitlesPicker
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
            {/* {
                metaPreviewOpen ?
                    <div className={classnames(styles['layer'], styles['menu-layer'])} onMouseDown={(event) => event.nativeEvent.metaPreviewClosePrevented = true}>
                        <div style={{ width: 300, height: 800, background: 'red' }} />
                    </div>
                    :
                    null
            } */}
        </div>
    );
};

Player.propTypes = {
    urlParams: PropTypes.exact({
        stream: PropTypes.string,
        streamTransportUrl: PropTypes.string,
        metaTransportUrl: PropTypes.string,
        type: PropTypes.string,
        id: PropTypes.string,
        videoId: PropTypes.string
    })
};

module.exports = Player;
