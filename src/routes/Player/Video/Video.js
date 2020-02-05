const React = require('react');
const PropTypes = require('prop-types');
const hat = require('hat');
const selectVideoImplementation = require('./selectVideoImplementation');

const Video = React.forwardRef(({ className, ...props }, ref) => {
    const [onEnded, onError, onPropValue, onPropChanged, onImplementationChanged] = React.useMemo(() => [
        props.onEnded,
        props.onError,
        props.onPropValue,
        props.onPropChanged,
        props.onImplementationChanged
    ], []);
    const containerElementRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const id = React.useMemo(() => `video-${hat()}`, []);
    const dispatch = React.useCallback((args) => {
        if (args && args.commandName === 'load' && args.commandArgs) {
            const Video = selectVideoImplementation(args.commandArgs.shell, args.commandArgs.stream);
            if (typeof Video !== 'function') {
                videoRef.current = null;
            } else if (videoRef.current === null || videoRef.current.constructor !== Video) {
                dispatch({ commandName: 'destroy' });
                videoRef.current = new Video({
                    id: id,
                    containerElement: containerElementRef.current,
                    shell: args.commandArgs.shell
                });
                videoRef.current.on('ended', onEnded);
                videoRef.current.on('error', onError);
                videoRef.current.on('propValue', onPropValue);
                videoRef.current.on('propChanged', onPropChanged);
                onImplementationChanged(videoRef.current.constructor.manifest);
            }
        }

        if (videoRef.current !== null) {
            try {
                videoRef.current.dispatch(args);
            } catch (e) {
                console.error(videoRef.current.constructor.manifest.name, e);
            }
        }
    }, []);
    React.useImperativeHandle(ref, () => ({ dispatch }));
    React.useEffect(() => {
        return () => {
            dispatch({ commandName: 'destroy' });
        };
    }, []);
    return (
        <div ref={containerElementRef} id={id} className={className} />
    );
});

Video.displayName = 'Video';

Video.propTypes = {
    className: PropTypes.string,
    onEnded: PropTypes.func,
    onError: PropTypes.func,
    onPropValue: PropTypes.func,
    onPropChanged: PropTypes.func,
    onImplementationChanged: PropTypes.func
};

module.exports = Video;
