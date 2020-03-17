const React = require('react');
const PropTypes = require('prop-types');
const hat = require('hat');
const { useLiveRef } = require('stremio/common');
const selectVideoImplementation = require('./selectVideoImplementation');

const Video = React.forwardRef(({ className, ...props }, ref) => {
    const onEndedRef = useLiveRef(props.onEnded);
    const onErrorRef = useLiveRef(props.onError);
    const onPropValueRef = useLiveRef(props.onPropValue);
    const onPropChangedRef = useLiveRef(props.onPropChanged);
    const onImplementationChangedRef = useLiveRef(props.onImplementationChanged);
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
                videoRef.current.on('ended', onEndedRef.current);
                videoRef.current.on('error', onErrorRef.current);
                videoRef.current.on('propValue', onPropValueRef.current);
                videoRef.current.on('propChanged', onPropChangedRef.current);
                if (typeof onImplementationChangedRef.current === 'function') {
                    onImplementationChangedRef.current(videoRef.current.constructor.manifest);
                }
            }
        }

        if (videoRef.current !== null) {
            try {
                videoRef.current.dispatch(args);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(videoRef.current.constructor.manifest.name, e);
            }
        }
    }, []);
    React.useImperativeHandle(ref, () => ({ dispatch }), []);
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
