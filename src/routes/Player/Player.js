const React = require('react');
const classnames = require('classnames');
const { useSpreadState } = require('stremio/common');
const Video = require('./Video');
const BufferingLoader = require('./BufferingLoader');
const ControlBar = require('./ControlBar');
const styles = require('./styles');

const Player = ({ urlParams }) => {
    const videoRef = React.useRef(null);
    const stream = React.useMemo(() => {
        return {
            // ytId: 'E4A0bcCQke0',
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        };
    }, [urlParams.stream]);
    const [state, setState] = useSpreadState({
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
    });
    const dispatch = React.useCallback((args) => {
        if (videoRef.current !== null) {
            videoRef.current.dispatch(args);
        }
    }, []);
    const onImplementationChanged = React.useCallback((manifest) => {
        manifest.props.forEach((propName) => {
            dispatch({ observedPropName: propName });
        });
    }, []);
    const onEnded = React.useCallback(() => {
        alert('ended');
    }, []);
    const onError = React.useCallback((error) => {
        alert(error.message);
        console.error(error);
    }, []);
    const onPropChanged = React.useCallback((propName, propValue) => {
        setState({ [propName]: propValue });
    }, []);
    React.useEffect(() => {
        dispatch({
            commandName: 'load',
            commandArgs: { stream }
        });
        dispatch({
            propName: 'subtitlesOffset',
            propValue: 18
        });
        dispatch({
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
        dispatch({
            propName: 'selectedSubtitlesTrackId',
            propValue: 'https://raw.githubusercontent.com/caitp/ng-media/master/example/assets/captions/bunny-en.vtt'
        });
    }, [stream]);
    return (
        <div className={styles['player-container']}>
            <Video
                ref={videoRef}
                className={styles['layer']}
                onEnded={onEnded}
                onError={onError}
                onPropValue={onPropChanged}
                onPropChanged={onPropChanged}
                onImplementationChanged={onImplementationChanged}
            />
            <div className={styles['layer']} />
            {
                state.buffering ?
                    <BufferingLoader className={styles['layer']} />
                    :
                    null
            }
            <ControlBar
                className={classnames(styles['layer'], styles['control-bar-layer'])}
                paused={state.paused}
                time={state.time}
                duration={state.duration}
                volume={state.volume}
                muted={state.muted}
                subtitlesTracks={state.subtitlesTracks}
                selectedSubtitlesTrackId={state.selectedSubtitlesTrackId}
                subtitlesSize={state.subtitlesSize}
                subtitlesDelay={state.subtitlesDelay}
                subtitlesTextColor={state.subtitlesTextColor}
                subtitlesBackgroundColor={state.subtitlesBackgroundColor}
                subtitlesOutlineColor={state.subtitlesOutlineColor}
                dispatch={dispatch}
            />
        </div>
    );
};

module.exports = Player;
