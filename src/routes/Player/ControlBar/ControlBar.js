import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import SeekBar from './SeekBar';
import VolumeSlider from './VolumeSlider';
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
            nextProps.paused !== this.props.paused ||
            nextProps.time !== this.props.time ||
            nextProps.duration !== this.props.duration ||
            nextProps.volume !== this.props.volume ||
            nextProps.subtitleTracks !== this.props.subtitleTracks ||
            nextProps.selectedSubtitleTrackId !== this.props.selectedSubtitleTrackId ||
            nextState.sharePopupOpen !== this.state.sharePopupOpen ||
            nextState.subtitlesPopupOpen !== this.state.subtitlesPopupOpen;
    }

    setTime = (time) => {
        this.props.setTime(time);
    }

    setVolume = (volume) => {
        this.props.setVolume(volume);
    }

    setSelectedSubtitleTrackId = (selectedSubtitleTrackId) => {
        this.props.setSelectedSubtitleTrackId(selectedSubtitleTrackId);
    }

    toogleVolumeMute = () => {
        this.props.volume === 0 ? this.props.unmute() : this.props.mute();
    }

    onPlayPauseButtonClick = () => {
        this.props.paused ? this.props.play() : this.props.pause();
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

    renderSeekBar() {
        return (
            <SeekBar
                className={styles['seek-bar']}
                time={this.props.time}
                duration={this.props.duration}
                setTime={this.setTime}
            />
        );
    }

    renderPlayPauseButton() {
        if (this.props.paused === null) {
            return null;
        }

        const icon = this.props.paused ? 'ic_play' : 'ic_pause';
        return (
            <div className={styles['control-bar-button']} onClick={this.onPlayPauseButtonClick}>
                <Icon className={styles['icon']} icon={icon} />
            </div>
        );
    }

    renderVolumeBar() {
        if (this.props.volume === null) {
            return null;
        }

        const icon = this.props.volume === 0 ? 'ic_volume0' :
            this.props.volume < 50 ? 'ic_volume1' :
                this.props.volume < 100 ? 'ic_volume2' :
                    'ic_volume3';
        return (
            <Fragment>
                <div className={styles['control-bar-button']} onClick={this.toogleVolumeMute}>
                    <Icon className={styles['icon']} icon={icon} />
                </div>
                <VolumeSlider
                    className={styles['volume-slider']}
                    volume={this.props.volume}
                    setVolume={this.setVolume}
                />
            </Fragment>
        );
    }

    renderShareButton() {
        return (
            <Popup className={styles['popup-container']} border={true} onOpen={this.onSharePopupOpen} onClose={this.onSharePopupClose}>
                <Popup.Label>
                    <div className={classnames(styles['control-bar-button'], { [styles['active']]: this.state.sharePopupOpen })}>
                        <Icon className={styles['icon']} icon={'ic_share'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <div className={classnames(styles['popup-content'], styles['share-popup-content'])} />
                </Popup.Menu>
            </Popup>
        );
    }

    renderSubtitlesButton() {
        if (this.props.subtitleTracks.length === 0) {
            return null;
        }

        return (
            <Popup className={styles['popup-container']} border={true} onOpen={this.onSubtitlesPopupOpen} onClose={this.onSubtitlesPopupClose}>
                <Popup.Label>
                    <div className={classnames(styles['control-bar-button'], { [styles['active']]: this.state.subtitlesPopupOpen })}>
                        <Icon className={styles['icon']} icon={'ic_sub'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <SubtitlesPicker
                        className={classnames(styles['popup-content'], styles['subtitles-popup-content'])}
                        subtitleTracks={this.props.subtitleTracks}
                        selectedSubtitleTrackId={this.props.selectedSubtitleTrackId}
                        setSelectedSubtitleTrackId={this.setSelectedSubtitleTrackId}
                    />
                </Popup.Menu>
            </Popup >
        );
    }

    render() {
        if (['paused', 'time', 'duration', 'volume', 'subtitleTracks'].every(propName => this.props[propName] === null)) {
            return null;
        }

        return (
            <div className={classnames(styles['control-bar-container'], this.props.className)}>
                {this.renderSeekBar()}
                <div className={styles['control-bar-buttons-container']}>
                    {this.renderPlayPauseButton()}
                    {this.renderVolumeBar()}
                    <div className={styles['flex-spacing']} />
                    {this.renderSubtitlesButton()}
                    {this.renderShareButton()}
                </div>
            </div>
        );
    }
}

ControlBar.propTypes = {
    className: PropTypes.string,
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
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    setTime: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
    setSelectedSubtitleTrackId: PropTypes.func.isRequired,
    mute: PropTypes.func.isRequired,
    unmute: PropTypes.func.isRequired
};

export default ControlBar;
