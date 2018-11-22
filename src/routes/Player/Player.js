import React, { Component, Fragment } from 'react';
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
            volume: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.paused !== this.state.paused ||
            nextState.time !== this.state.time ||
            nextState.duration !== this.state.duration ||
            nextState.volume !== this.state.volume;
    }

    onEnded = () => {
        alert('ended');
    }

    onError = (error) => {
        if (error.critical) {
            this.stop();
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

    stop = () => {
        this.videoRef.current && this.videoRef.current.dispatch('command', 'stop');
    }

    setTime = (time) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'time', time);
    }

    setVolume = (volume) => {
        this.videoRef.current && this.videoRef.current.dispatch('setProp', 'volume', volume);
    }

    renderVideo() {
        return (
            <Fragment>
                <Video
                    ref={this.videoRef}
                    className={styles['layer']}
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
                play={this.play}
                pause={this.pause}
                setTime={this.setTime}
                setVolume={this.setVolume}
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

export default Player;
