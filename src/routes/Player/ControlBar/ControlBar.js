const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const SeekBar = require('./SeekBar');
const PlayPauseButton = require('./PlayPauseButton');
const MuteButton = require('./MuteButton');
const VolumeSlider = require('./VolumeSlider');
const SubtitlesButton = require('./SubtitlesButton');
const ShareButton = require('./ShareButton');
const styles = require('./styles');

const ControlBar = (props) => (
    <div className={classnames(props.className, styles['control-bar-container'])}>
        <SeekBar
            className={styles['seek-bar']}
            time={props.time}
            duration={props.duration}
            dispatch={props.dispatch}
        />
        <div className={styles['control-bar-buttons-container']}>
            <PlayPauseButton
                className={styles['control-bar-button']}
                paused={props.paused}
                dispatch={props.dispatch}
            />
            <MuteButton
                className={styles['control-bar-button']}
                volume={props.volume}
                muted={props.muted}
                dispatch={props.dispatch}
            />
            <VolumeSlider
                className={styles['volume-slider']}
                volume={props.volume}
                dispatch={props.dispatch}
            />
            <div className={styles['spacing']} />
            <SubtitlesButton
                className={styles['control-bar-button']}
                popupContainerClassName={classnames(styles['popup-container'], props.popupClassName)}
                popupContentClassName={styles['popup-content']}
                subtitleTracks={props.subtitleTracks}
                selectedSubtitleTrackId={props.selectedSubtitleTrackId}
                subtitleSize={props.subtitleSize}
                subtitleDelay={props.subtitleDelay}
                subtitleDarkBackground={props.subtitleDarkBackground}
                dispatch={props.dispatch}
            />
            <ShareButton
                className={styles['control-bar-button']}
                popupContainerClassName={classnames(styles['popup-container'], props.popupClassName)}
                popupContentClassName={styles['popup-content']}
            />
        </div>
    </div>
);

ControlBar.propTypes = {
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    paused: PropTypes.bool,
    time: PropTypes.number,
    duration: PropTypes.number,
    volume: PropTypes.number,
    muted: PropTypes.bool,
    subtitleTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })).isRequired,
    selectedSubtitleTrackId: PropTypes.string,
    subtitleSize: PropTypes.number,
    subtitleDelay: PropTypes.number,
    subtitleDarkBackground: PropTypes.bool,
    dispatch: PropTypes.func
};

ControlBar.defaultProps = {
    subtitleTracks: Object.freeze([])
};

module.exports = ControlBar;
