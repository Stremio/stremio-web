import React, { Component } from 'react';
import ReactHTMLVideo from './stremio-video/ReactHTMLVideo';
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

    renderVideo() {
        if (this.state.videoComponent === null) {
            return null;
        }

        return (
            <this.state.videoComponent
                ref={this.assignVideo}
                className={styles['layer']}
                onPropChanged={this.onPropChanged}
                onPropValue={this.onPropValue}
                onEnded={this.onEnded}
                onError={this.onError}
                observedProps={['time', 'volume', 'duration', 'paused']}
            />
        );
    }

    render() {
        return (
            <div className={styles['root-container']}>
                {this.renderVideo()}
            </div>
        );
    }
}

export default Player;
