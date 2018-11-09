import React, { Component } from 'react';
import classnames from 'classnames';
import ReactHTMLVideo from './stremio-video/ReactHTMLVideo';
import ControlBar from './ControlBar';
import styles from './styles';

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: null,
            volume: null,
            duration: null,
            paused: null,
            videoComponent: null
        };
    }

    componentDidMount() {
        this.prepareStream()
            .then(({ source, videoComponent }) => {
                this.setState({ videoComponent }, () => {
                    this.video.dispatch('command', 'load', {
                        source: source
                    });
                });
            })
            .catch((error) => {
                this.onError(error);
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.time !== this.state.time ||
            nextState.volume !== this.state.volume ||
            nextState.duration !== this.state.duration ||
            nextState.paused !== this.state.paused ||
            nextState.videoComponent !== this.state.videoComponent;
    }

    assignVideo = (video) => {
        this.video = video;
    }

    prepareStream = () => {
        return Promise.resolve({
            source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            videoComponent: ReactHTMLVideo
        });
    }

    onPropChanged = (propName, propValue) => {
        this.setState({ [propName]: propValue });
    }

    onPropValue = (propName, propValue) => {
        this.setState({ [propName]: propValue });
    }

    onEnded = () => {
        alert('ended');
    }

    onError = (error) => {
        alert(error.message);
    }

    play = () => {
        this.video.dispatch('setProp', 'paused', false);
    }

    pause = () => {
        this.video.dispatch('setProp', 'paused', true);
    }

    seek = (time) => {
        this.video.dispatch('setProp', 'time', time);
    }

    renderVideo() {
        if (this.state.videoComponent === null) {
            return null;
        }

        return (
            <this.state.videoComponent
                ref={this.assignVideo}
                className={classnames(styles['layer'], styles['video'])}
                onPropChanged={this.onPropChanged}
                onPropValue={this.onPropValue}
                onEnded={this.onEnded}
                onError={this.onError}
                observedProps={['time', 'volume', 'duration', 'paused']}
            />
        );
    }

    renderControlBar() {
        if (this.state.videoComponent === null) {
            return null;
        }

        return (
            <ControlBar
                className={styles['layer']}
                paused={this.state.paused}
                time={this.state.time}
                duration={this.state.duration}
                volume={this.state.volume}
                play={this.play}
                pause={this.pause}
                seek={this.seek}
            />
        );
    }

    render() {
        return (
            <div className={styles['root-container']}>
                {this.renderVideo()}
                {this.renderControlBar()}
            </div>
        );
    }
}

export default Player;
