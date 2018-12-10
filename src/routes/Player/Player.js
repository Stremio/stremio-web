import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Video from './Video';
import ControlBar from './ControlBar';
import styles from './styles';

class Player extends Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();

        this.state = {
            paused: null,
            time: null,
            duration: null,
            volume: null,
            subtitles: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.paused !== this.state.paused ||
            nextState.time !== this.state.time ||
            nextState.duration !== this.state.duration ||
            nextState.volume !== this.state.volume ||
            nextState.subtitles !== this.state.subtitles;
    }

    componentDidMount() {
        this.addExtraSubtitles([
            {
                id: 'id1',
                url: 'https://raw.githubusercontent.com/amzn/web-app-starter-kit-for-fire-tv/master/out/mrss/assets/sample_video-en.vtt',
                label: 'English (Github)',
                language: 'en'
            }
        ]);
    }

    onEnded = () => {
        alert('ended');
    }

    onError = (error) => {
        if (error.critical) {
            this.stop();
        }

        alert(error.message);
    }

    onPropValue = (propName, propValue) => {
        this.setState({ [propName]: propValue });
    }

    onPropChanged = (propName, propValue) => {
        this.setState({ [propName]: propValue });
    }

    play = () => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'paused', false);
    }

    pause = () => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'paused', true);
    }

    setTime = (time) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'time', time);
    }

    setVolume = (volume) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'volume', volume);
    }

    mute = () => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'mute');
    }

    unmute = () => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'unmute');
    }

    addExtraSubtitles = (subtitles) => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'addExtraSubtitles', subtitles);
    }

    stop = () => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'stop');
    }

    renderVideo() {
        return (
            <Fragment>
                <Video
                    ref={this.videoRef}
                    className={styles['layer']}
                    stream={this.props.stream}
                    onEnded={this.onEnded}
                    onError={this.onError}
                    onPropValue={this.onPropValue}
                    onPropChanged={this.onPropChanged}
                />
                <div className={styles['layer']} />
            </Fragment>
        );
    }

    renderControlBar() {
        return (
            <ControlBar
                className={styles['layer']}
                paused={this.state.paused}
                time={this.state.time}
                duration={this.state.duration}
                volume={this.state.volume}
                subtitles={this.state.subtitles}
                play={this.play}
                pause={this.pause}
                setTime={this.setTime}
                setVolume={this.setVolume}
                mute={this.mute}
                unmute={this.unmute}
            />
        );
    }

    render() {
        return (
            <div className={styles['player-container']}>
                {this.renderVideo()}
                {this.renderControlBar()}
            </div>
        );
    }
}

Player.propTypes = {
    stream: PropTypes.object.isRequired
};
Player.defaultProps = {
    stream: {
        // ytId: 'E4A0bcCQke0',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
};

export default Player;
