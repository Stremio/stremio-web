const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Video = require('./Video');
const BufferingLoader = require('./BufferingLoader');
const ControlBar = require('./ControlBar');
const styles = require('./styles');

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();

        this.state = {
            paused: null,
            time: null,
            duration: null,
            buffering: null,
            volume: null,
            muted: null,
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
            nextState.muted !== this.state.muted ||
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

    render() {
        return (
            <div className={styles['player-container']}>
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
                <BufferingLoader
                    className={styles['layer']}
                    buffering={this.state.buffering}
                />
                <ControlBar
                    className={classnames(styles['layer'], styles['control-bar-layer'])}
                    popupContainerClassName={styles['control-bar-popup-container']}
                    paused={this.state.paused}
                    time={this.state.time}
                    duration={this.state.duration}
                    volume={this.state.volume}
                    muted={this.state.muted}
                    subtitleTracks={this.state.subtitleTracks}
                    selectedSubtitleTrackId={this.state.selectedSubtitleTrackId}
                    subtitleSize={this.state.subtitleSize}
                    subtitleDelay={this.state.subtitleDelay}
                    subtitleDarkBackground={this.state.subtitleDarkBackground}
                    dispatch={this.dispatch}
                />
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

module.exports = Player;
