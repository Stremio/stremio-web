// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/common');
const { useServices } = require('stremio/services');
const SeekBar = require('./SeekBar');
const VolumeSlider = require('./VolumeSlider');
const styles = require('./styles');
const { useBinaryState, platform } = require('stremio/common');
const { t } = require('i18next');
const useSupportsVideoVolume = require('./useSupportsVideoVolume');
const AirplayIconSVG = require('./icons/AirplayIconSVG');

const isMobile = platform.isMobile();
const browserSupportsAirplay = !!window.WebKitPlaybackTargetAvailabilityEvent;

const ControlBar = ({
    className,
    paused,
    time,
    duration,
    buffered,
    volume,
    muted,
    playbackSpeed,
    subtitlesTracks,
    audioTracks,
    metaItem,
    nextVideo,
    stream,
    statistics,
    onPlayRequested,
    onPauseRequested,
    onNextVideoRequested,
    onMuteRequested,
    onUnmuteRequested,
    onVolumeChangeRequested,
    onSeekRequested,
    onToggleSubtitlesMenu,
    onToggleInfoMenu,
    onToggleSpeedMenu,
    onToggleVideosMenu,
    onToggleOptionsMenu,
    onToggleStatisticsMenu,
    videoContainerElementRef,
    setAirplayActive,
    ...props
}) => {
    const { chromecast } = useServices();
    const supportsVideoVolume = useSupportsVideoVolume();
    const [chromecastServiceActive, setChromecastServiceActive] = React.useState(() => chromecast.active);
    const [airplayAvailable, setAirplayAvailable] = React.useState(false);
    const [buttonsMenuOpen, , , toogleButtonsMenu] = useBinaryState(false);

    const setAirplayActiveRef = React.useRef();
    setAirplayActiveRef.current = setAirplayActive;

    const getVideoElement = React.useCallback(() => {
        if (videoContainerElementRef && videoContainerElementRef.current) {
            if (videoContainerElementRef.current instanceof HTMLVideoElement)
                return videoContainerElementRef.current;
            else
                return videoContainerElementRef.current.querySelector('video');
        }

        return null;
    }, [videoContainerElementRef]);
    React.useLayoutEffect(() => {
        const videoTag = getVideoElement();
        if (!videoTag)
            return;

        let updateAirplayStatusTimeout = null;

        function enableRemoteVideoPlayback() {
            videoTag.webkitWirelessVideoPlaybackDisabled = false;
            videoTag.setAttribute('x-webkit-airplay', 'allow');
        }

        function onAirplayAvailabilityChanged(event) {
            switch (event.availability) {
                case 'available':
                    setAirplayAvailable(true);
                    break;
                case 'not-available':
                    setAirplayAvailable(false);
                    break;
            }
        }

        function updateAirplayActive() {
            clearTimeout(updateAirplayStatusTimeout);

            if (videoTag.webkitCurrentPlaybackTargetIsWireless) {
                if (setAirplayActiveRef.current)
                    setAirplayActiveRef.current(true);

                enableRemoteVideoPlayback();
            } else {
                updateAirplayStatusTimeout = setTimeout(() => {
                    clearTimeout(updateAirplayStatusTimeout);

                    if (typeof paused !== 'boolean' || paused || videoTag.paused)
                        return;

                    if (setAirplayActiveRef.current)
                        setAirplayActiveRef.current(!!videoTag.webkitCurrentPlaybackTargetIsWireless);
                }, 1000 * 5);
            }
        }

        function airplayActiveChanged() {
            updateAirplayActive();
        }

        function onPlay() {
            updateAirplayActive();
        }

        function onPause() {
            clearTimeout(updateAirplayStatusTimeout);
        }

        if (window.WebKitPlaybackTargetAvailabilityEvent) {
            videoTag.addEventListener('webkitplaybacktargetavailabilitychanged', onAirplayAvailabilityChanged);
            videoTag.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', airplayActiveChanged);
            videoTag.addEventListener('play', onPlay);
            videoTag.addEventListener('pause', onPause);

            enableRemoteVideoPlayback();
            setAirplayAvailable(!!videoTag.webkitWirelessVideoPlaybackDisabled);
            updateAirplayActive();
        }

        return () => {
            clearTimeout(updateAirplayStatusTimeout);
            if (window.WebKitPlaybackTargetAvailabilityEvent) {
                videoTag.removeEventListener('webkitplaybacktargetavailabilitychanged', onAirplayAvailabilityChanged);
                videoTag.removeEventListener('webkitcurrentplaybacktargetiswirelesschanged', airplayActiveChanged);
                videoTag.removeEventListener('play', onPlay);
                videoTag.removeEventListener('pause', onPause);
            }
        };
    }, [getVideoElement(), paused]);
    const onSubtitlesButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.subtitlesMenuClosePrevented = true;
    }, []);
    const onInfoButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.infoMenuClosePrevented = true;
    }, []);
    const onSpeedButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.speedMenuClosePrevented = true;
    }, []);
    const onVideosButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.videosMenuClosePrevented = true;
    }, []);
    const onOptionsButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.optionsMenuClosePrevented = true;
    }, []);
    const onStatisticsButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.statisticsMenuClosePrevented = true;
    }, []);
    const onPlayPauseButtonClick = React.useCallback(() => {
        if (paused) {
            if (typeof onPlayRequested === 'function') {
                onPlayRequested();
            }
        } else {
            if (typeof onPauseRequested === 'function') {
                onPauseRequested();
            }
        }
    }, [paused, onPlayRequested, onPauseRequested]);
    const onNextVideoButtonClick = React.useCallback(() => {
        if (nextVideo !== null && typeof onNextVideoRequested === 'function') {
            onNextVideoRequested();
        }
    }, [nextVideo, onNextVideoRequested]);
    const onMuteButtonClick = React.useCallback(() => {
        if (muted) {
            if (typeof onUnmuteRequested === 'function') {
                onUnmuteRequested();
            }
        } else {
            if (typeof onMuteRequested === 'function') {
                onMuteRequested();
            }
        }
    }, [muted, onMuteRequested, onUnmuteRequested]);
    const onChromecastButtonClick = React.useCallback(() => {
        chromecast.transport.requestSession();
    }, []);
    const onAirplayButtonClick = React.useCallback(() => {
        const videoTag = getVideoElement();
        if (!videoTag)
            return;

        videoTag.webkitShowPlaybackTargetPicker();
    }, []);
    React.useEffect(() => {
        const onStateChanged = () => {
            setChromecastServiceActive(chromecast.active);
        };
        chromecast.on('stateChanged', onStateChanged);
        return () => {
            chromecast.off('stateChanged', onStateChanged);
        };
    }, []);
    return (
        <div {...props} className={classnames(className, styles['control-bar-container'])}>
            <SeekBar
                className={styles['seek-bar']}
                time={time}
                duration={duration}
                buffered={buffered}
                onSeekRequested={onSeekRequested}
            />
            <div className={classnames(styles['control-bar-buttons-container'], {[styles['mobile']]: isMobile})}>
                {
                    !isMobile &&
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof paused !== 'boolean' })} title={paused ? t('PLAYER_PLAY') : t('PLAYER_PAUSE')} tabIndex={-1} onClick={onPlayPauseButtonClick}>
                        <Icon className={styles['icon']} name={typeof paused !== 'boolean' || paused ? 'play' : 'pause'} />
                    </Button>
                }
                {
                    nextVideo !== null ?
                        <Button className={classnames(styles['control-bar-button'])} title={t('PLAYER_NEXT_VIDEO')} tabIndex={-1} onClick={onNextVideoButtonClick}>
                            <Icon className={styles['icon']} name={'next'} />
                        </Button>
                        :
                        null
                }
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof muted !== 'boolean' })} title={muted ? t('PLAYER_UNMUTE') : t('PLAYER_MUTE')} tabIndex={-1} onClick={onMuteButtonClick}>
                    <Icon
                        className={styles['icon']}
                        name={
                            (typeof muted === 'boolean' && muted) ? 'volume-mute' :
                                (volume === null || isNaN(volume)) ? 'volume-off' :
                                    volume < 30 ? 'volume-low' :
                                        volume < 70 ? 'volume-medium' :
                                            'volume-high'
                        }
                    />
                </Button>
                {
                    supportsVideoVolume &&
                    <VolumeSlider
                        className={styles['volume-slider']}
                        volume={volume}
                        onVolumeChangeRequested={onVolumeChangeRequested}
                    />
                }
                <div className={styles['spacing']} />
                <Button className={styles['control-bar-buttons-menu-button']} onClick={toogleButtonsMenu}>
                    <Icon className={styles['icon']} name={'more-vertical'} />
                </Button>
                <div className={classnames(styles['control-bar-buttons-menu-container'], { 'open': buttonsMenuOpen })}>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': statistics === null || statistics.type === 'Err' || stream === null || typeof stream.infoHash !== 'string' || typeof stream.fileIdx !== 'number' })} tabIndex={-1} onMouseDown={onStatisticsButtonMouseDown} onClick={onToggleStatisticsMenu}>
                        <Icon className={styles['icon']} name={'network'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': playbackSpeed === null })} tabIndex={-1} onMouseDown={onSpeedButtonMouseDown} onClick={onToggleSpeedMenu}>
                        <Icon className={styles['icon']} name={'speed'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': metaItem === null || metaItem.type !== 'Ready' })} tabIndex={-1} onMouseDown={onInfoButtonMouseDown} onClick={onToggleInfoMenu}>
                        <Icon className={styles['icon']} name={'about'} />
                    </Button>
                    {
                        (!browserSupportsAirplay || chromecastServiceActive) &&
                        <Button className={classnames(styles['control-bar-button'], { 'disabled': !chromecastServiceActive })} tabIndex={-1} onClick={onChromecastButtonClick}>
                            <Icon className={styles['icon']} name={'cast'} />
                        </Button>
                    }
                    {
                        (browserSupportsAirplay || airplayAvailable) &&
                        <Button className={classnames(styles['control-bar-button'], { 'disabled': !airplayAvailable })} tabIndex={-1} onClick={onAirplayButtonClick}>
                            <AirplayIconSVG className={styles['icon']} />
                        </Button>
                    }
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': (!Array.isArray(subtitlesTracks) || subtitlesTracks.length === 0) && (!Array.isArray(audioTracks) || audioTracks.length === 0) })} tabIndex={-1} onMouseDown={onSubtitlesButtonMouseDown} onClick={onToggleSubtitlesMenu}>
                        <Icon className={styles['icon']} name={'subtitles'} />
                    </Button>
                    {
                        metaItem?.content?.videos?.length > 0 ?
                            <Button className={styles['control-bar-button']} tabIndex={-1} onMouseDown={onVideosButtonMouseDown} onClick={onToggleVideosMenu}>
                                <Icon className={styles['icon']} name={'episodes'} />
                            </Button>
                            :
                            null
                    }
                    <Button className={styles['control-bar-button']} tabIndex={-1} onMouseDown={onOptionsButtonMouseDown} onClick={onToggleOptionsMenu}>
                        <Icon className={styles['icon']} name={'more-horizontal'} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

ControlBar.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    time: PropTypes.number,
    duration: PropTypes.number,
    buffered: PropTypes.number,
    volume: PropTypes.number,
    muted: PropTypes.bool,
    playbackSpeed: PropTypes.number,
    subtitlesTracks: PropTypes.array,
    audioTracks: PropTypes.array,
    metaItem: PropTypes.object,
    nextVideo: PropTypes.object,
    stream: PropTypes.object,
    statistics: PropTypes.object,
    onPlayRequested: PropTypes.func,
    onPauseRequested: PropTypes.func,
    onNextVideoRequested: PropTypes.func,
    onMuteRequested: PropTypes.func,
    onUnmuteRequested: PropTypes.func,
    onVolumeChangeRequested: PropTypes.func,
    onSeekRequested: PropTypes.func,
    onToggleSubtitlesMenu: PropTypes.func,
    onToggleInfoMenu: PropTypes.func,
    onToggleSpeedMenu: PropTypes.func,
    onToggleVideosMenu: PropTypes.func,
    onToggleOptionsMenu: PropTypes.func,
    onToggleStatisticsMenu: PropTypes.func,
    videoContainerElementRef: PropTypes.object,
    setAirplayActive: PropTypes.func,
};

module.exports = ControlBar;
