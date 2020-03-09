const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const MuteButton = require('./MuteButton');
const PlayPauseButton = require('./PlayPauseButton');
const SeekBar = require('./SeekBar');
const ShareButton = require('./ShareButton');
const SubtitlesButton = require('./SubtitlesButton');
const VolumeSlider = require('./VolumeSlider');
const styles = require('./styles');

const ControlBar = (props) => {
    return (
        <div className={classnames(props.className, styles['control-bar-container'])}>
            <SeekBar
                className={styles['seek-bar']}
                time={props.time}
                duration={props.duration}
                onSeekRequested={props.onSeekRequested}
            />
            <div className={styles['control-bar-buttons-container']}>
                <PlayPauseButton
                    className={styles['control-bar-button']}
                    paused={props.paused}
                    onPlayRequested={props.onPlayRequested}
                    onPauseRequested={props.onPauseRequested}
                />
                <MuteButton
                    className={styles['control-bar-button']}
                    volume={props.volume}
                    muted={props.muted}
                    onMuteRequested={props.onMuteRequested}
                    onUnmuteRequested={props.onUnmuteRequested}
                />
                <VolumeSlider
                    className={styles['volume-slider']}
                    volume={props.volume}
                    onVolumeChangeRequested={props.onVolumeChangeRequested}
                />
                <div className={styles['spacing']} />
                <SubtitlesButton
                    className={styles['control-bar-button']}
                    subtitlesTracks={props.subtitlesTracks}
                    onToggleSubtitlesPicker={props.onToggleSubtitlesPicker}
                />
                <ShareButton className={styles['control-bar-button']} />
            </div>
        </div>
    );
};

ControlBar.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.any,
    time: PropTypes.any,
    duration: PropTypes.any,
    volume: PropTypes.any,
    muted: PropTypes.any,
    subtitlesTracks: PropTypes.any,
    onPlayRequested: PropTypes.any,
    onPauseRequested: PropTypes.any,
    onMuteRequested: PropTypes.any,
    onUnmuteRequested: PropTypes.any,
    onVolumeChangeRequested: PropTypes.any,
    onSeekRequested: PropTypes.any,
    onToggleSubtitlesPicker: PropTypes.any
};

module.exports = ControlBar;
