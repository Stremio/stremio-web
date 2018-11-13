import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import ReactHTMLVideo from './stremio-video/ReactHTMLVideo';
import ControlBar from './ControlBar';
import styles from './styles';

class Player extends Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();

        this.state = {
            videoComponent: null,
            paused: null,
            time: null,
            duration: null,
            volume: null
        };
    }

    componentDidMount() {
        this.prepareStream()
            .then(({ source, videoComponent }) => {
                this.setState({ videoComponent }, () => {
                    this.videoRef.current.dispatch('command', 'load', {
                        source: source
                    });
                });
            })
            .catch((error) => {
                this.onError(error);
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.videoComponent !== this.state.videoComponent ||
            nextState.paused !== this.state.paused ||
            nextState.time !== this.state.time ||
            nextState.duration !== this.state.duration ||
            nextState.volume !== this.state.volume;
    }

    prepareStream = () => {
        return Promise.resolve({
            source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            videoComponent: ReactHTMLVideo
        });
    }

    onEnded = () => {
        alert('ended');
    }

    onError = (error) => {
        if (error.critical) {
            this.videoRef.current && this.videoRef.current.dispatch('command', 'stop');
            this.setState({
                paused: null,
                time: null,
                duration: null,
                volume: null
            });
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

    seek = (time) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'time', time);
    }

    renderVideo() {
        if (this.state.videoComponent === null) {
            return null;
        }

        return (
            <Fragment>
                <this.state.videoComponent
                    ref={this.videoRef}
                    className={classnames(styles['layer'], styles['video'])}
                    onEnded={this.onEnded}
                    onError={this.onError}
                    onPropValue={this.onPropValue}
                    onPropChanged={this.onPropChanged}
                    observedProps={['paused', 'time', 'duration', 'volume']}
                />
                <div className={styles['layer']} />
            </Fragment>
        );
    }

    renderControlBar() {
        if (['paused', 'time', 'duration', 'volume'].every(propName => this.state[propName] === null)) {
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
