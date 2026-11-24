// Copyright (C) 2017-2026 Smart code 203358507

const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const PictureInPictureWindow = ({ className, videoClassName, pictureInPictureWindow, videoRef, onVideoClick, children }) => {
    const videoSlotRef = React.useRef(null);

    React.useLayoutEffect(() => {
        const videoElement = videoRef.current;
        const videoSlot = videoSlotRef.current;
        if (!videoElement || !videoSlot) {
            return;
        }

        const videoParent = videoElement.parentElement;
        const restoreVideo = () => {
            if (videoElement.parentElement !== videoParent) {
                videoParent.appendChild(videoElement);
            }
        };
        videoSlot.appendChild(videoElement);
        pictureInPictureWindow.addEventListener('pagehide', restoreVideo);
        return () => {
            pictureInPictureWindow.removeEventListener('pagehide', restoreVideo);
            restoreVideo();
        };
    }, [pictureInPictureWindow, videoRef]);

    React.useEffect(() => {
        const forwardKeyboardEvent = (event) => {
            if (event.key === 'Escape') {
                return;
            }

            const forwardedEvent = new KeyboardEvent(event.type, {
                key: event.key,
                code: event.code,
                repeat: event.repeat,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                bubbles: true,
                cancelable: true,
            });
            if (!document.dispatchEvent(forwardedEvent)) {
                event.preventDefault();
            }
        };
        pictureInPictureWindow.addEventListener('keydown', forwardKeyboardEvent);
        pictureInPictureWindow.addEventListener('keyup', forwardKeyboardEvent);
        return () => {
            pictureInPictureWindow.removeEventListener('keydown', forwardKeyboardEvent);
            pictureInPictureWindow.removeEventListener('keyup', forwardKeyboardEvent);
        };
    }, [pictureInPictureWindow]);

    return ReactDOM.createPortal(
        <div className={classnames(className, styles['picture-in-picture'])}>
            <div ref={videoSlotRef} className={videoClassName} onClick={onVideoClick} />
            {children}
        </div>,
        pictureInPictureWindow.document.body
    );
};

PictureInPictureWindow.propTypes = {
    className: PropTypes.string,
    videoClassName: PropTypes.string,
    pictureInPictureWindow: PropTypes.object.isRequired,
    videoRef: PropTypes.object.isRequired,
    onVideoClick: PropTypes.func,
    children: PropTypes.node,
};

module.exports = PictureInPictureWindow;
