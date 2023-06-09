// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const StremioVideo = require('@stremio/stremio-video');
const { useLiveRef } = require('stremio/common');
const styles = require('./styles');

const Video = React.forwardRef(({ className, ...props }, ref) => {
    const onEndedRef = useLiveRef(props.onEnded);
    const onErrorRef = useLiveRef(props.onError);
    const onPropValueRef = useLiveRef(props.onPropValue);
    const onPropChangedRef = useLiveRef(props.onPropChanged);
    const onSubtitlesTrackLoadedRef = useLiveRef(props.onSubtitlesTrackLoaded);
    const onExtraSubtitlesTrackLoadedRef = useLiveRef(props.onExtraSubtitlesTrackLoaded);
    const onImplementationChangedRef = useLiveRef(props.onImplementationChanged);
    const videoElementRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const dispatch = React.useCallback((action, options = {}) => {
        if (videoRef.current !== null) {
            try {
                videoRef.current.dispatch(action, {
                    ...options,
                    containerElement: videoElementRef.current
                });
            } catch (error) {
                console.error('Video', error);
            }
        }
    }, []);
    React.useImperativeHandle(ref, () => ({ dispatch }), []);
    React.useEffect(() => {
        if (videoElementRef.current !== null) {
            videoRef.current = new StremioVideo();
            videoRef.current.on('ended', () => {
                if (typeof onEndedRef.current === 'function') {
                    onEndedRef.current();
                }
            });
            videoRef.current.on('error', (args) => {
                if (typeof onErrorRef.current === 'function') {
                    onErrorRef.current(args);
                }
            });
            videoRef.current.on('propValue', (propName, propValue) => {
                if (typeof onPropValueRef.current === 'function') {
                    onPropValueRef.current(propName, propValue);
                }
            });
            videoRef.current.on('propChanged', (propName, propValue) => {
                if (typeof onPropChangedRef.current === 'function') {
                    onPropChangedRef.current(propName, propValue);
                }
            });
            videoRef.current.on('subtitlesTrackLoaded', (track) => {
                if (typeof onSubtitlesTrackLoadedRef.current === 'function') {
                    onSubtitlesTrackLoadedRef.current(track);
                }
            });
            videoRef.current.on('extraSubtitlesTrackLoaded', (track) => {
                if (typeof onExtraSubtitlesTrackLoadedRef.current === 'function') {
                    onExtraSubtitlesTrackLoadedRef.current(track);
                }
            });
            videoRef.current.on('implementationChanged', (manifest) => {
                if (typeof onImplementationChangedRef.current === 'function') {
                    onImplementationChangedRef.current(manifest);
                }
            });
        }
        return () => {
            videoRef.current.destroy();
        };
    }, []);
    return (
        <div className={classnames(className, styles['video-container'])}>
            <div ref={videoElementRef} className={styles['video']} />
        </div>
    );
});

Video.displayName = 'Video';

Video.propTypes = {
    className: PropTypes.string,
    onEnded: PropTypes.func,
    onError: PropTypes.func,
    onPropValue: PropTypes.func,
    onPropChanged: PropTypes.func,
    onSubtitlesTrackLoaded: PropTypes.func,
    onExtraSubtitlesTrackLoaded: PropTypes.func,
    onImplementationChanged: PropTypes.func
};

module.exports = Video;
