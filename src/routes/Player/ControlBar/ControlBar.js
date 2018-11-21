import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import Icon from 'stremio-icons/dom';
import { Slider, Popup } from 'stremio-common';
import colors from 'stremio-colors';
import styles from './styles';

class ControlBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: -1,
            volume: -1,
            volumePopupOpen: false,
            sharePopupOpen: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.className !== this.props.className ||
            nextProps.paused !== this.props.paused ||
            nextProps.time !== this.props.time ||
            nextProps.duration !== this.props.duration ||
            nextProps.volume !== this.props.volume ||
            nextState.time !== this.state.time ||
            nextState.volume !== this.state.volume ||
            nextState.volumePopupOpen !== this.state.volumePopupOpen ||
            nextState.sharePopupOpen !== this.state.sharePopupOpen;
    }

    componentWillUnmount() {
        this.resetTime.cancel();
        this.resetVolume.cancel();
    }

    resetTime = debounce(() => {
        this.setState({ time: -1 });
    }, 1500)

    resetVolume = debounce(() => {
        this.setState({ volume: -1 });
    }, 100)

    onTimeSliding = (time) => {
        this.resetTime.cancel();
        this.setState({ time });
    }

    onTimeSlidingCompleted = (time) => {
        this.setState({ time });
        this.props.setTime(time);
        this.resetTime();
    }

    onTimeSlidingAborted = () => {
        this.resetTime.cancel();
        this.setState({ time: -1 });
    }

    onVolumeSliding = (volume) => {
        this.resetVolume.cancel();
        this.setState({ volume });
    }

    onVolumeSlidingCompleted = (volume) => {
        this.setState({ volume });
        this.props.setVolume(volume);
        this.resetVolume();
    }

    onVolumeSlidingAborted = () => {
        this.resetVolume.cancel();
        this.setState({ volume: -1 });
    }

    onPlayPauseButtonClicked = () => {
        this.props.paused ? this.props.play() : this.props.pause();
    }

    onVolumePopupOpen = () => {
        this.setState({ volumePopupOpen: true });
    }

    onVolumePopupClose = () => {
        this.setState({ volumePopupOpen: false });
    }

    onSharePopupOpen = () => {
        this.setState({ sharePopupOpen: true });
    }

    onSharePopupClose = () => {
        this.setState({ sharePopupOpen: false });
    }

    formatTime = (time) => {
        const hours = ('0' + Math.floor((time / (1000 * 60 * 60)) % 24)).slice(-2);
        const minutes = ('0' + Math.floor((time / (1000 * 60)) % 60)).slice(-2);
        const seconds = ('0' + Math.floor((time / 1000) % 60)).slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }

    renderTimeSlider() {
        if (this.props.time === null || this.props.duration === null) {
            return null;
        }

        return (
            <Slider
                containerClassName={styles['time-slider']}
                thumbClassName={styles['time-thumb']}
                value={this.state.time !== -1 ? this.state.time : this.props.time}
                maxValue={this.props.duration}
                minValue={0}
                orientation={'horizontal'}
                onSliding={this.onTimeSliding}
                onSlidingAborted={this.onTimeSlidingAborted}
                onSlidingCompleted={this.onTimeSlidingCompleted}
            />
        );
    }

    renderPlayPauseButton() {
        if (this.props.paused === null) {
            return null;
        }

        return (
            <div className={styles['button']} onClick={this.onPlayPauseButtonClicked}>
                <Icon className={styles['icon']} icon={this.props.paused ? 'ic_play' : 'ic_pause'} />
            </div>
        );
    }

    renderTimeLabel() {
        if (this.props.time === null || this.props.duration === null) {
            return null;
        }

        const currentTime = this.state.time !== -1 ?
            this.formatTime(this.state.time)
            :
            this.formatTime(this.props.time);

        return (
            <div className={styles['time-label']}>{currentTime} / {this.formatTime(this.props.duration)}</div>
        );
    }

    renderVolumeButton() {
        if (this.props.volume === null) {
            return null;
        }

        const volume = this.state.volume !== -1 ? this.state.volume : this.props.volume;
        const volumeIcon = volume === 0 ? 'ic_volume0' :
            volume < 50 ? 'ic_volume1' :
                volume < 100 ? 'ic_volume2' :
                    'ic_volume3';

        return (
            <Popup borderColor={colors.primlight} onOpen={this.onVolumePopupOpen} onClose={this.onVolumePopupClose}>
                <Popup.Label>
                    <div className={classnames(styles['button'], { [styles['active']]: this.state.volumePopupOpen })}>
                        <Icon className={styles['icon']} icon={volumeIcon} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <div className={classnames(styles['popup-container'], styles['volume-popup-container'])}>
                        <Slider
                            containerClassName={styles['volume-slider']}
                            thumbClassName={styles['volume-thumb']}
                            value={volume}
                            maxValue={100}
                            minValue={0}
                            orientation={'vertical'}
                            onSliding={this.onVolumeSliding}
                            onSlidingAborted={this.onVolumeSlidingAborted}
                            onSlidingCompleted={this.onVolumeSlidingCompleted}
                        />
                    </div>
                </Popup.Menu>
            </Popup>
        );
    }

    renderShareButton() {
        return (
            <Popup borderColor={colors.primlight} onOpen={this.onSharePopupOpen} onClose={this.onSharePopupClose}>
                <Popup.Label>
                    <div className={classnames(styles['button'], { [styles['active']]: this.state.sharePopupOpen })}>
                        <Icon className={styles['icon']} icon={'ic_share'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <div className={classnames(styles['popup-container'], styles['share-popup-container'])} />
                </Popup.Menu>
            </Popup>
        );
    }

    render() {
        return (
            <div className={classnames(styles['control-bar-container'], this.props.className)}>
                {this.renderTimeSlider()}
                <div className={styles['buttons-bar-container']}>
                    {this.renderPlayPauseButton()}
                    <div className={styles['separator']} />
                    {this.renderTimeLabel()}
                    <div className={styles['spacing']} />
                    {this.renderVolumeButton()}
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
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    setTime: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired
};

export default ControlBar;
