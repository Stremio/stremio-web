import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SeekBar from './SeekBar';
import PlayPauseButton from './PlayPauseButton';
import VolumeBar from './VolumeBar';
import SubtitlesButton from './SubtitlesButton';
import ShareButton from './ShareButton';
import styles from './styles';

class ControlBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sharePopupOpen: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.className !== this.props.className ||
            nextProps.popupClassName !== this.props.popupClassName ||
            nextProps.paused !== this.props.paused ||
            nextProps.time !== this.props.time ||
            nextProps.duration !== this.props.duration ||
            nextProps.volume !== this.props.volume ||
            nextProps.muted !== this.props.muted ||
            nextProps.subtitleTracks !== this.props.subtitleTracks ||
            nextProps.selectedSubtitleTrackId !== this.props.selectedSubtitleTrackId ||
            nextProps.subtitleSize !== this.props.subtitleSize ||
            nextProps.subtitleDelay !== this.props.subtitleDelay ||
            nextProps.subtitleDarkBackground !== this.props.subtitleDarkBackground ||
            nextState.sharePopupOpen !== this.state.sharePopupOpen;
    }

    dispatch = (...args) => {
        this.props.dispatch(...args);
    }

    onSharePopupOpen = () => {
        this.setState({ sharePopupOpen: true });
    }

    onSharePopupClose = () => {
        this.setState({ sharePopupOpen: false });
    }

    render() {
        return (
            <div className={classnames(styles['control-bar-container'], this.props.className)}>
                <SeekBar
                    className={styles['seek-bar']}
                    time={this.props.time}
                    duration={this.props.duration}
                    dispatch={this.dispatch}
                />
                <div className={styles['control-bar-buttons-container']}>
                    <PlayPauseButton
                        className={styles['control-bar-button']}
                        paused={this.props.paused}
                        dispatch={this.dispatch}
                    />
                    <VolumeBar
                        className={styles['volume-bar']}
                        buttonClassName={styles['control-bar-button']}
                        volume={this.props.volume}
                        muted={this.props.muted}
                        dispatch={this.dispatch}
                    />
                    <div className={styles['spacing']} />
                    <SubtitlesButton
                        className={styles['control-bar-button']}
                        popupContainerClassName={classnames(styles['popup-container'], this.props.popupClassName)}
                        popupContentClassName={styles['popup-content']}
                        subtitleTracks={this.props.subtitleTracks}
                        selectedSubtitleTrackId={this.props.selectedSubtitleTrackId}
                        subtitleSize={this.props.subtitleSize}
                        subtitleDelay={this.props.subtitleDelay}
                        subtitleDarkBackground={this.props.subtitleDarkBackground}
                        dispatch={this.dispatch}
                    />
                    <ShareButton
                        className={styles['control-bar-button']}
                        popupContainerClassName={classnames(styles['popup-container'], this.props.popupClassName)}
                        popupContentClassName={styles['popup-content']}
                    />
                </div>
            </div>
        );
    }
}

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
    dispatch: PropTypes.func.isRequired
};

export default ControlBar;
