const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');
const SeekBar = require('./SeekBar');
const VolumeSlider = require('./VolumeSlider');
const styles = require('./styles');

const ControlBar = ({
    className,
    paused,
    time,
    duration,
    volume,
    muted,
    subtitlesTracks,
    info,
    onPlayRequested,
    onPauseRequested,
    onMuteRequested,
    onUnmuteRequested,
    onVolumeChangeRequested,
    onSeekRequested,
    onToggleSubtitlesMenu,
    onToggleInfoMenu,
    ...props
}) => {
    const onSubtitlesButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.subtitlesMenuClosePrevented = true;
    }, []);
    const onInfoButtonMouseDown = React.useCallback((event) => {
        event.nativeEvent.infoMenuClosePrevented = true;
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
    return (
        <div {...props} className={classnames(className, styles['control-bar-container'])}>
            <SeekBar
                className={styles['seek-bar']}
                time={time}
                duration={duration}
                onSeekRequested={onSeekRequested}
            />
            <div className={styles['control-bar-buttons-container']}>
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof paused !== 'boolean' })} title={paused ? 'Play' : 'Pause'} tabIndex={-1} onClick={onPlayPauseButtonClick}>
                    <Icon className={styles['icon']} icon={typeof paused !== 'boolean' || paused ? 'ic_play' : 'ic_pause'} />
                </Button>
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof muted !== 'boolean' })} title={muted ? 'Unmute' : 'Mute'} tabIndex={-1} onClick={onMuteButtonClick}>
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
                <Button className={classnames(styles['control-bar-button'], 'disabled')} tabIndex={-1}>
                    <Icon className={styles['icon']} icon={'ic_network'} />
                </Button>
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof info !== 'object' || info === null })} tabIndex={-1} onMouseDown={onInfoButtonMouseDown} onClick={onInfoButtonClick}>
                    <Icon className={styles['icon']} icon={'ic_info'} />
                </Button>
                <Button className={classnames(styles['control-bar-button'], 'disabled')} tabIndex={-1}>
                    <Icon className={styles['icon']} icon={'ic_cast'} />
                </Button>
                <Button className={classnames(styles['control-bar-button'], { 'disabled': !Array.isArray(subtitlesTracks) || subtitlesTracks.length === 0 })} tabIndex={-1} onMouseDown={onSubtitlesButtonMouseDown} onClick={onSubtitlesButtonClick}>
                    <Icon className={styles['icon']} icon={'ic_sub'} />
                </Button>
                <Button className={classnames(styles['control-bar-button'], 'disabled')} tabIndex={-1}>
                    <Icon className={styles['icon']} icon={'ic_videos'} />
                </Button>
            </div>
        </div>
    );
};

ControlBar.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    time: PropTypes.number,
    duration: PropTypes.number,
    volume: PropTypes.number,
    muted: PropTypes.bool,
    subtitlesTracks: PropTypes.array,
    info: PropTypes.object,
    onPlayRequested: PropTypes.func,
    onPauseRequested: PropTypes.func,
    onMuteRequested: PropTypes.func,
    onUnmuteRequested: PropTypes.func,
    onVolumeChangeRequested: PropTypes.func,
    onSeekRequested: PropTypes.func,
    onToggleSubtitlesMenu: PropTypes.func,
    onToggleInfoMenu: PropTypes.func
};

module.exports = ControlBar;
