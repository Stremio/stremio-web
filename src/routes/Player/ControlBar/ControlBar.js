import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import SeekBar from './SeekBar';
import PlayPauseButton from './PlayPauseButton';
import VolumeBar from './VolumeBar';
import SubtitlesPicker from './SubtitlesPicker';
import styles from './styles';

class ControlBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sharePopupOpen: false,
            subtitlesPopupOpen: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.className !== this.props.className ||
            nextProps.popupClassName !== this.props.popupClassName ||
            nextProps.paused !== this.props.paused ||
            nextProps.time !== this.props.time ||
            nextProps.duration !== this.props.duration ||
            nextProps.volume !== this.props.volume ||
            nextProps.subtitleTracks !== this.props.subtitleTracks ||
            nextProps.selectedSubtitleTrackId !== this.props.selectedSubtitleTrackId ||
            nextProps.subtitleSize !== this.props.subtitleSize ||
            nextProps.subtitleDelay !== this.props.subtitleDelay ||
            nextProps.subtitleDarkBackground !== this.props.subtitleDarkBackground ||
            nextState.sharePopupOpen !== this.state.sharePopupOpen ||
            nextState.subtitlesPopupOpen !== this.state.subtitlesPopupOpen;
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

    onSubtitlesPopupOpen = () => {
        this.setState({ subtitlesPopupOpen: true });
    }

    onSubtitlesPopupClose = () => {
        this.setState({ subtitlesPopupOpen: false });
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
                        dispatch={this.dispatch}
                    />
                    <div className={styles['spacing']} />
                    <Popup className={classnames(styles['popup-container'], this.props.popupClassName)} border={true} onOpen={this.onSubtitlesPopupOpen} onClose={this.onSubtitlesPopupClose}>
                        <Popup.Label>
                            <div className={classnames(styles['control-bar-button'], { 'active': this.state.subtitlesPopupOpen }, { 'disabled': this.props.subtitleTracks.length === 0 })}>
                                <Icon className={'icon'} icon={'ic_sub'} />
                            </div>
                        </Popup.Label>
                        <Popup.Menu>
                            <SubtitlesPicker
                                className={classnames(styles['popup-content'], styles['subtitles-popup-content'])}
                                subtitleTracks={this.props.subtitleTracks}
                                selectedSubtitleTrackId={this.props.selectedSubtitleTrackId}
                                subtitleSize={this.props.subtitleSize}
                                subtitleDelay={this.props.subtitleDelay}
                                subtitleDarkBackground={this.props.subtitleDarkBackground}
                                dispatch={this.dispatch}
                            />
                        </Popup.Menu>
                    </Popup>
                    <Popup className={classnames(styles['popup-container'], this.props.popupClassName)} border={true} onOpen={this.onSharePopupOpen} onClose={this.onSharePopupClose}>
                        <Popup.Label>
                            <div className={classnames(styles['control-bar-button'], { 'active': this.state.sharePopupOpen })}>
                                <Icon className={'icon'} icon={'ic_share'} />
                            </div>
                        </Popup.Label>
                        <Popup.Menu>
                            <div className={classnames(styles['popup-content'], styles['share-popup-content'])} />
                        </Popup.Menu>
                    </Popup>
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
