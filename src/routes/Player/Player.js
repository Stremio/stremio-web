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
            subtitleTracks: [],
            selectedSubtitleTrackId: null,
            subtitleSize: null,
            subtitleDelay: null,
            subtitleDarkBackground: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.paused !== this.state.paused ||
            nextState.time !== this.state.time ||
            nextState.duration !== this.state.duration ||
            nextState.volume !== this.state.volume ||
            nextState.subtitleTracks !== this.state.subtitleTracks ||
            nextState.selectedSubtitleTrackId !== this.state.selectedSubtitleTrackId ||
            nextState.subtitleSize !== this.state.subtitleSize ||
            nextState.subtitleDelay !== this.state.subtitleDelay ||
            nextState.subtitleDarkBackground !== this.state.subtitleDarkBackground;
    }

    componentDidMount() {
        this.addSubtitleTracks([{
            url: 'https://raw.githubusercontent.com/caitp/ng-media/master/example/assets/captions/bunny-en.vtt',
            origin: 'Github',
            label: 'English'
        }]);
        this.setSelectedSubtitleTrackId('https://raw.githubusercontent.com/caitp/ng-media/master/example/assets/captions/bunny-en.vtt');
        this.addSubtitleTracks(require('./subtitles').default);
        this.setSelectedSubtitleTrackId('https://raw.githubusercontent.com/NikolaBorislavovHristov/test-resources/master/1.vtt?token=AFrNArKXTTDZRHR16bqQBFQmJlB8FIUSks5cNgCGwA%3D%3D')
    }

    onEnded = () => {
        alert('ended');
    }

    onError = (error) => {
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

    setSelectedSubtitleTrackId = (selectedSubtitleTrackId) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'selectedSubtitleTrackId', selectedSubtitleTrackId);
    }

    setSubtitleSize = (size) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'subtitleSize', size);
    }

    setSubtitleDelay = (delay) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'subtitleDelay', delay);
    }

    setSubtitleDarkBackground = (value) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'subtitleDarkBackground', value);
    }

    mute = () => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'mute');
    }

    unmute = () => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'unmute');
    }

    addSubtitleTracks = (subtitleTracks) => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'addSubtitleTracks', subtitleTracks);
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
                subtitleTracks={this.state.subtitleTracks}
                selectedSubtitleTrackId={this.state.selectedSubtitleTrackId}
                subtitleSize={this.state.subtitleSize}
                subtitleDelay={this.state.subtitleDelay}
                subtitleDarkBackground={this.state.subtitleDarkBackground}
                play={this.play}
                pause={this.pause}
                setTime={this.setTime}
                setVolume={this.setVolume}
                setSelectedSubtitleTrackId={this.setSelectedSubtitleTrackId}
                setSubtitleSize={this.setSubtitleSize}
                setSubtitleDelay={this.setSubtitleDelay}
                setSubtitleDarkBackground={this.setSubtitleDarkBackground}
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
