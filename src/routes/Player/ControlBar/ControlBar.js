import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import SeekBar from './SeekBar';
import VolumeBar from './VolumeBar';
import SubtitlesPicker from './SubtitlesPicker';
import styles from './styles';

//TODO move this in separate file
const ControlBarButton = React.forwardRef(({ active, icon, onClick }, ref) => (
    <div ref={ref} className={classnames(styles['control-bar-button'], { 'active': active })} onClick={onClick}>
        <Icon className={styles['icon']} icon={icon} />
    </div>
));

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
            nextProps.subtitleSize !== this.props.subtitleSize ||
            nextProps.subtitleDelay !== this.props.subtitleDelay ||
            nextProps.subtitleDarkBackground !== this.props.subtitleDarkBackground ||
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

    setSubtitleSize = (size) => {
        this.props.setSubtitleSize(size);
    }

    setSubtitleDelay = (delay) => {
        this.props.setSubtitleDelay(delay);
    }

    setSubtitleDarkBackground = (value) => {
        this.props.setSubtitleDarkBackground(value);
    }

    mute = () => {
        this.props.mute();
    }

    unmute = () => {
        this.props.unmute();
    }

    togglePaused = () => {
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
            <ControlBarButton
                icon={icon}
                onClick={this.togglePaused}
            />
        );
    }

    renderVolumeBar() {
        return (
            <VolumeBar
                className={styles['volume-bar']}
                toggleButtonComponent={ControlBarButton}
                volume={this.props.volume}
                setVolume={this.setVolume}
                mute={this.mute}
                unmute={this.unmute}
            />
        );
    }

    renderShareButton() {
        return (
            <Popup className={'player-popup-container'} border={true} onOpen={this.onSharePopupOpen} onClose={this.onSharePopupClose}>
                <Popup.Label>
                    <ControlBarButton active={this.state.sharePopupOpen} icon={'ic_share'} />
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
            <Popup className={'player-popup-container'} border={true} onOpen={this.onSubtitlesPopupOpen} onClose={this.onSubtitlesPopupClose}>
                <Popup.Label>
                    <ControlBarButton active={this.state.subtitlesPopupOpen} icon={'ic_sub'} />
                </Popup.Label>
                <Popup.Menu>
                    <SubtitlesPicker
                        className={classnames(styles['popup-content'], styles['subtitles-popup-content'])}
                        subtitleTracks={this.props.subtitleTracks}
                        subtitleSize={this.props.subtitleSize}
                        subtitleDelay={this.props.subtitleDelay}
                        subtitleDarkBackground={this.props.subtitleDarkBackground}
                        selectedSubtitleTrackId={this.props.selectedSubtitleTrackId}
                        setSelectedSubtitleTrackId={this.setSelectedSubtitleTrackId}
                        setSubtitleSize={this.setSubtitleSize}
                        setSubtitleDelay={this.setSubtitleDelay}
                        setSubtitleDarkBackground={this.setSubtitleDarkBackground}
                    />
                </Popup.Menu>
            </Popup >
        );
    }

    render() {
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
    subtitleSize: PropTypes.number,
    subtitleDelay: PropTypes.number,
    subtitleDarkBackground: PropTypes.bool,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    setTime: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
    setSelectedSubtitleTrackId: PropTypes.func.isRequired,
    setSubtitleSize: PropTypes.func.isRequired,
    setSubtitleDelay: PropTypes.func.isRequired,
    setSubtitleDarkBackground: PropTypes.func.isRequired,
    mute: PropTypes.func.isRequired,
    unmute: PropTypes.func.isRequired
};

export default ControlBar;
