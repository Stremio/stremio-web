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
            subtitlesTracks: [],
            selectedSubtitlesTrackId: null,
            subtitlesSize: null,
            subtitlesDelay: null,
            subtitlesTextColor: null,
            subtitlesBackgroundColor: null,
            subtitlesOutlineColor: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.paused !== this.state.paused ||
            nextState.time !== this.state.time ||
            nextState.duration !== this.state.duration ||
            nextState.buffering !== this.state.buffering ||
            nextState.volume !== this.state.volume ||
            nextState.muted !== this.state.muted ||
            nextState.subtitlesTracks !== this.state.subtitlesTracks ||
            nextState.selectedSubtitlesTrackId !== this.state.selectedSubtitlesTrackId ||
            nextState.subtitlesSize !== this.state.subtitlesSize ||
            nextState.subtitlesDelay !== this.state.subtitlesDelay ||
            nextState.subtitlesTextColor !== this.state.subtitlesTextColor ||
            nextState.subtitlesBackgroundColor !== this.state.subtitlesBackgroundColor ||
            nextState.subtitlesOutlineColor !== this.state.subtitlesOutlineColor;
    }

    componentDidMount() {
        this.dispatch({
            commandName: 'load',
            commandArgs: {
                stream: this.props.stream,
                ipc: window.shell
            }
        });
        this.dispatch({
            propName: 'subtitlesOffset',
            propValue: 18
        });
        this.dispatch({
            commandName: 'addSubtitlesTracks',
            commandArgs: {
                tracks: [
                    {
                        url: 'https://raw.githubusercontent.com/caitp/ng-media/master/example/assets/captions/bunny-en.vtt',
                        origin: 'Github',
                        label: 'English'
                    }
                ]
            }
        });
        this.dispatch({
            propName: 'selectedSubtitlesTrackId',
            propValue: 'https://raw.githubusercontent.com/caitp/ng-media/master/example/assets/captions/bunny-en.vtt'
        });
    }

    onEnded = () => {
        alert('ended');
    }

    onError = (error) => {
        alert(error.message);
        console.error(error);
    }

    onPropValue = (propName, propValue) => {
        this.setState({ [propName]: propValue });
    }

    onPropChanged = (propName, propValue) => {
        this.setState({ [propName]: propValue });
    }

    onImplementationChanged = (manifest) => {
        manifest.props.forEach((propName) => {
            this.dispatch({ observedPropName: propName });
        });
    }

    dispatch = (args) => {
        this.videoRef.current && this.videoRef.current.dispatch(args);
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
                    subtitlesTracks={this.state.subtitlesTracks}
                    selectedSubtitlesTrackId={this.state.selectedSubtitlesTrackId}
                    subtitlesSize={this.state.subtitlesSize}
                    subtitlesDelay={this.state.subtitlesDelay}
                    subtitlesTextColor={this.state.subtitlesTextColor}
                    subtitlesBackgroundColor={this.state.subtitlesBackgroundColor}
                    subtitlesOutlineColor={this.state.subtitlesOutlineColor}
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
