// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Button } = require('stremio/common');
const { useServices } = require('stremio/services');
const SeekBar = require('./SeekBar');
const VolumeSlider = require('./VolumeSlider');
const styles = require('./styles');
const { useBinaryState } = require('stremio/common');
const { t } = require('i18next');

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
    ...props
}) => {
    const { chromecast } = useServices();
    const [chromecastServiceActive, setChromecastServiceActive] = React.useState(() => chromecast.active);
    const [buttonsMenuOpen, , , toogleButtonsMenu] = useBinaryState(false);
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
        if (nextVideo !== null && typeof nextVideo.deepLinks === 'object') {
            if (nextVideo.deepLinks.player !== null) {
                window.location.replace(nextVideo.deepLinks.player);
            } else if (nextVideo.deepLinks.metaDetailsStreams !== null) {
                window.location.replace(nextVideo.deepLinks.metaDetailsStreams);
            }
        }
    }, [nextVideo]);
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
    const onSubtitlesButtonClick = React.useCallback(() => {
        if (typeof onToggleSubtitlesMenu === 'function') {
            onToggleSubtitlesMenu();
        }
    }, [onToggleSubtitlesMenu]);
    const onInfoButtonClick = React.useCallback(() => {
        if (typeof onToggleInfoMenu === 'function') {
            onToggleInfoMenu();
        }
    }, [onToggleInfoMenu]);
    const onSpeedButtonClick = React.useCallback(() => {
        if (typeof onToggleSpeedMenu === 'function') {
            onToggleSpeedMenu();
        }
    }, [onToggleSpeedMenu]);
    const onVideosButtonClick = React.useCallback(() => {
        if (typeof onToggleVideosMenu === 'function') {
            onToggleVideosMenu();
        }
    }, [onToggleVideosMenu]);
    const onOptionsButtonClick = React.useCallback(() => {
        if (typeof onToggleOptionsMenu === 'function') {
            onToggleOptionsMenu();
        }
    }, [onToggleOptionsMenu]);
    const onStatisticsButtonClick = React.useCallback(() => {
        if (typeof onToggleStatisticsMenu === 'function') {
            onToggleStatisticsMenu();
        }
    }, [onToggleStatisticsMenu]);
    const onChromecastButtonClick = React.useCallback(() => {
        chromecast.transport.requestSession();
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
            <div className={styles['control-bar-buttons-container']}>
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof paused !== 'boolean' })} title={paused ? t('PLAYER_PLAY') : t('PLAYER_PAUSE')} tabIndex={-1} onClick={onPlayPauseButtonClick}>
                    <Icon className={styles['icon']} icon={typeof paused !== 'boolean' || paused ? 'ic_play' : 'ic_pause'} />
                </Button>
                {
                    nextVideo !== null ?
                        <Button className={classnames(styles['control-bar-button'])} title={t('PLAYER_NEXT_VIDEO')} tabIndex={-1} onClick={onNextVideoButtonClick}>
                            <Icon className={styles['icon']} icon={'ic_play_next'} />
                        </Button>
                        :
                        null
                }
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof muted !== 'boolean' })} title={muted ? t('PLAYER_UNMUTE') : t('PLAYER_MUTE')} tabIndex={-1} onClick={onMuteButtonClick}>
                    <Icon
                        className={styles['icon']}
                        icon={
                            (typeof muted === 'boolean' && muted) ? 'ic_volume0' :
                                (volume === null || isNaN(volume)) ? 'ic_volume3' :
                                    volume < 30 ? 'ic_volume1' :
                                        volume < 70 ? 'ic_volume2' :
                                            'ic_volume3'
                        }
                    />
                </Button>
                <VolumeSlider
                    className={styles['volume-slider']}
                    volume={volume}
                    onVolumeChangeRequested={onVolumeChangeRequested}
                />
                <div className={styles['spacing']} />
                <Button className={styles['control-bar-buttons-menu-button']} onClick={toogleButtonsMenu}>
                    <Icon className={styles['icon']} icon={'ic_more'} />
                </Button>
                <div className={classnames(styles['control-bar-buttons-menu-container'], { 'open': buttonsMenuOpen })}>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': statistics === null || statistics.type === 'Err' || stream === null || typeof stream.infoHash !== 'string' || typeof stream.fileIdx !== 'number' })} tabIndex={-1} onMouseDown={onStatisticsButtonMouseDown} onClick={onStatisticsButtonClick}>
                        <Icon className={styles['icon']} icon={'ic_network'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': playbackSpeed === null })} tabIndex={-1} onMouseDown={onSpeedButtonMouseDown} onClick={onSpeedButtonClick}>
                        <Icon className={styles['icon']} icon={'ic_speedometer'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': metaItem === null || metaItem.type !== 'Ready' })} tabIndex={-1} onMouseDown={onInfoButtonMouseDown} onClick={onInfoButtonClick}>
                        <Icon className={styles['icon']} icon={'ic_info'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': !chromecastServiceActive })} tabIndex={-1} onClick={onChromecastButtonClick}>
                        <Icon className={styles['icon']} icon={'ic_cast'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': (!Array.isArray(subtitlesTracks) || subtitlesTracks.length === 0) && (!Array.isArray(audioTracks) || audioTracks.length === 0) })} tabIndex={-1} onMouseDown={onSubtitlesButtonMouseDown} onClick={onSubtitlesButtonClick}>
                        <Icon className={styles['icon']} icon={'ic_sub'} />
                    </Button>
                    {
                        metaItem?.content?.videos?.length > 0 ?
                            <Button className={styles['control-bar-button']} tabIndex={-1} onMouseDown={onVideosButtonMouseDown} onClick={onVideosButtonClick}>
                                <Icon className={styles['icon']} icon={'ic_videos'} />
                            </Button>
                            :
                            null
                    }
                    <Button className={styles['control-bar-button']} tabIndex={-1} onMouseDown={onOptionsButtonMouseDown} onClick={onOptionsButtonClick}>
                        <Icon className={styles['icon']} icon={'ic_more'} />
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
};

module.exports = ControlBar;
