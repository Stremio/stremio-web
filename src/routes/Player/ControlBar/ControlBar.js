import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import TimeSlider from './TimeSlider';
import VolumeSlider from './VolumeSlider';
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
            nextProps.paused !== this.props.paused ||
            nextProps.time !== this.props.time ||
            nextProps.duration !== this.props.duration ||
            nextProps.volume !== this.props.volume ||
            nextState.sharePopupOpen !== this.state.sharePopupOpen;
    }

    setTime = (time) => {
        this.props.setTime(time);
    }

    setVolume = (volume) => {
        this.props.setVolume(volume);
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

    renderVolumeButton() {
        if (this.props.volume === null) {
            return null;
        }

        const icon = this.props.volume === 0 ? 'ic_volume0' :
            this.props.volume < 50 ? 'ic_volume1' :
                this.props.volume < 100 ? 'ic_volume2' :
                    'ic_volume3';
        return (
            <div className={styles['control-bar-button']}>
                <Icon className={styles['icon']} icon={icon} />
            </div>
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

    render() {
        if (['paused', 'time', 'duration', 'volume', 'subtitles'].every(propName => this.props[propName] === null)) {
            return null;
        }

        return (
            <div className={classnames(styles['control-bar-container'], this.props.className)}>
                <TimeSlider
                    className={styles['time-slider']}
                    time={this.props.time}
                    duration={this.props.duration}
                    setTime={this.setTime}
                />
                <div className={styles['control-bar-buttons-container']}>
                    {this.renderPlayPauseButton()}
                    {this.renderVolumeButton()}
                    <VolumeSlider
                        className={styles['volume-slider']}
                        volume={this.props.volume}
                        setVolume={this.setVolume}
                    />
                    <div className={styles['flex-spacing']} />
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
    subtitles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired
    })),
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    setTime: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired
};

export default ControlBar;
