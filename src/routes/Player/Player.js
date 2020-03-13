const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { HorizontalNavBar, useDeepEqualEffect, useBinaryState } = require('stremio/common');
const BufferingLoader = require('./BufferingLoader');
const ControlBar = require('./ControlBar');
const SubtitlesPicker = require('./SubtitlesPicker');
const Video = require('./Video');
const usePlayer = require('./usePlayer');
const useSubtitlesSettings = require('./useSubtitlesSettings');
const styles = require('./styles');

const INITIAL_VIDEO_STATE = {
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
};

const Player = ({ urlParams }) => {
    const player = usePlayer(urlParams);
    const [subtitlesSettings, updateSubtitlesSettings] = useSubtitlesSettings();
    const routeFocused = useRouteFocused();
    const [immersed, setImmersed] = React.useState(true);
    const setImmersedDebounced = React.useCallback(debounce(setImmersed, 3000), []);
    const [subtitlesPickerOpen, , closeSubtitlesPicker, toggleSubtitlesPicker] = useBinaryState(false);
    const [videoState, setVideoState] = React.useReducer((videoState, nextVideoState) => ({
        ...videoState,
        ...nextVideoState
    }), INITIAL_VIDEO_STATE);
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
        dispatch({ propName: 'subtitlesSize', propValue: subtitlesSettings.size });
        dispatch({ propName: 'subtitlesTextColor', propValue: subtitlesSettings.text_color });
        dispatch({ propName: 'subtitlesBackgroundColor', propValue: subtitlesSettings.background_color });
        dispatch({ propName: 'subtitlesOutlineColor', propValue: subtitlesSettings.outline_color });
        dispatch({ propName: 'subtitlesOffset', propValue: subtitlesSettings.offset });
    }, [subtitlesSettings.size, subtitlesSettings.text_color, subtitlesSettings.background_color, subtitlesSettings.outline_color]);
    const onPropChanged = React.useCallback((propName, propValue) => {
        setVideoState({ [propName]: propValue });
    }, []);
    const onEnded = React.useCallback(() => {
        // console.log('ended');
    }, []);
    const onError = React.useCallback(() => {
        // console.error(error);
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
        updateSubtitlesSettings({ subtitles_size: size });
    }, []);
    const onSubtitlesOffsetChanged = React.useCallback((offset) => {
        updateSubtitlesSettings({ subtitles_offset: offset });
    }, []);
    const onContainerMouseDown = React.useCallback((event) => {
        if (!event.nativeEvent.subtitlesPickerClosePrevented) {
            closeSubtitlesPicker();
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
    const onBarMouseMove = React.useCallback((event) => {
        event.nativeEvent.immersePrevented = true;
    }, []);
    const onVideoClick = React.useCallback(() => {
        if (videoState.paused !== null) {
            if (videoState.paused) {
                onPlayRequested();
            } else {
                onPauseRequested();
            }
        }
    }, [videoState.paused]);
    useDeepEqualEffect(() => {
        if (player.selected === null || player.selected.stream === null) {
            dispatch({ commandName: 'stop' });
        } else {
            dispatch({
                commandName: 'load',
                commandArgs: {
                    stream: player.selected.stream
                }
            });
        }
    }, [player.selected && player.selected.stream]);
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
    }, [player.subtitles_resources]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesSize', propValue: subtitlesSettings.size });
    }, [subtitlesSettings.size]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesTextColor', propValue: subtitlesSettings.text_color });
    }, [subtitlesSettings.text_color]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesBackgroundColor', propValue: subtitlesSettings.background_color });
    }, [subtitlesSettings.background_color]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesOutlineColor', propValue: subtitlesSettings.outline_color });
    }, [subtitlesSettings.outline_color]);
    React.useEffect(() => {
        dispatch({ propName: 'subtitlesOffset', propValue: subtitlesSettings.offset });
    }, [subtitlesSettings.offset]);
    React.useEffect(() => {
        const onKeyDown = (event) => {
            switch (event.key) {
                case ' ': {
                    if (videoState.paused !== null) {
                        if (videoState.paused) {
                            onPlayRequested();
                        } else {
                            onPauseRequested();
                        }
                    }

                    break;
                }
                case 'ArrowRight': {
                    if (videoState.time !== null) {
                        onSeekRequested(videoState.time + 15000);
                    }

                    break;
                }
                case 'ArrowLeft': {
                    if (videoState.time !== null) {
                        onSeekRequested(videoState.time - 15000);
                    }

                    break;
                }
                case 'ArrowUp': {
                    if (videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume + 5);
                    }

                    break;
                }
                case 'ArrowDown': {
                    if (videoState.volume !== null) {
                        onVolumeChangeRequested(videoState.volume - 5);
                    }

                    break;
                }
            }
        };
        if (routeFocused && !subtitlesPickerOpen) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [routeFocused, subtitlesPickerOpen, videoState.paused, videoState.time, videoState.volume]);
    return (
        <div className={classnames(styles['player-container'], { [styles['immersed']]: immersed && videoState.paused !== null && !videoState.paused && !subtitlesPickerOpen })}
            onMouseDown={onContainerMouseDown}
            onMouseMove={onContainerMouseMove}
            onMouseOver={onContainerMouseMove}
            onMouseLeave={onContainerMouseMove}>
            <Video
                ref={videoRef}
                className={styles['layer']}
                onEnded={onEnded}
                onError={onError}
                onPropValue={onPropChanged}
                onPropChanged={onPropChanged}
                onImplementationChanged={onImplementationChanged}
            />
            <div className={styles['layer']} onClick={onVideoClick} />
            {
                videoState.buffering ?
                    <BufferingLoader className={styles['layer']} />
                    :
                    null
            }
            <HorizontalNavBar
                className={classnames(styles['layer'], styles['nav-bar-layer'])}
                title={
                    player.meta_resource !== null && player.meta_resource.content.type === 'Ready' ?
                        player.meta_resource.content.content.name
                        :
                        null
                }
                backButton={true}
                fullscreenButton={true}
            />
            <ControlBar
                className={classnames(styles['layer'], styles['control-bar-layer'])}
                paused={videoState.paused}
                time={videoState.time}
                duration={videoState.duration}
                volume={videoState.volume}
                muted={videoState.muted}
                subtitlesTracks={videoState.subtitlesTracks}
                onPlayRequested={onPlayRequested}
                onPauseRequested={onPauseRequested}
                onMuteRequested={onMuteRequested}
                onUnmuteRequested={onUnmuteRequested}
                onVolumeChangeRequested={onVolumeChangeRequested}
                onSeekRequested={onSeekRequested}
                onToggleSubtitlesPicker={toggleSubtitlesPicker}
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
        </div>
    );
};

Player.propTypes = {
    urlParams: PropTypes.exact({
        stream: PropTypes.string,
        transportUrl: PropTypes.string,
        type: PropTypes.string,
        id: PropTypes.string,
        videoId: PropTypes.string
    })
};

module.exports = Player;
