import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Video from './Video';
import BufferingLoader from './BufferingLoader';
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
            buffering: null,
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
            nextState.buffering !== this.state.buffering ||
            nextState.volume !== this.state.volume ||
            nextState.subtitleTracks !== this.state.subtitleTracks ||
            nextState.selectedSubtitleTrackId !== this.state.selectedSubtitleTrackId ||
            nextState.subtitleSize !== this.state.subtitleSize ||
            nextState.subtitleDelay !== this.state.subtitleDelay ||
            nextState.subtitleDarkBackground !== this.state.subtitleDarkBackground;
    }

    componentDidMount() {
        this.dispatch('command', 'load', this.props.stream, {
            ipc: window.shell
        });
        this.dispatch('setProp', 'subtitleOffset', 18);
        this.dispatch('command', 'addSubtitleTracks', [{
            url: 'https://raw.githubusercontent.com/caitp/ng-media/master/example/assets/captions/bunny-en.vtt',
            origin: 'Github',
            label: 'English'
        }]);
        this.dispatch('setProp', 'selectedSubtitleTrackId', 'https://raw.githubusercontent.com/caitp/ng-media/master/example/assets/captions/bunny-en.vtt');
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

    onImplementationChanged = (manifest) => {
        manifest.props.forEach((propName) => {
            this.dispatch('observeProp', propName);
        });
    }

    dispatch = (...args) => {
        this.videoRef.current && this.videoRef.current.dispatch(...args);
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
                    onImplementationChanged={this.onImplementationChanged}
                />
                <div className={styles['layer']} />
            </Fragment>
        );
    }

    renderBufferingLoader() {
        return (
            <BufferingLoader
                className={styles['layer']}
                buffering={this.state.buffering}
            />
        );
    }

    renderControlBar() {
        return (
            <ControlBar
                className={classnames(styles['layer'], styles['control-bar-layer'])}
                popupClassName={styles['control-bar-popup-container']}
                paused={this.state.paused}
                time={this.state.time}
                duration={this.state.duration}
                volume={this.state.volume}
                subtitleTracks={this.state.subtitleTracks}
                selectedSubtitleTrackId={this.state.selectedSubtitleTrackId}
                subtitleSize={this.state.subtitleSize}
                subtitleDelay={this.state.subtitleDelay}
                subtitleDarkBackground={this.state.subtitleDarkBackground}
                dispatch={this.dispatch}
            />
        );
    }

    render() {
        return (
            <div className={styles['player-container']}>
                {this.renderVideo()}
                {this.renderBufferingLoader()}
                {this.renderControlBar()}
            </div>
        );
    }
}

Player.propTypes = {
    stream: PropTypes.object.isRequired
};
Player.defaultProps = {
    stream: Object.freeze({
        // ytId: 'E4A0bcCQke0',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    })
};

export default Player;
