// Copyright (C) 2017-2026 Smart code 203358507

const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const FORWARDED_KEYS = ['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyM', 'Minus', 'Equal', 'KeyG', 'KeyH', 'BracketLeft', 'BracketRight', 'KeyV', 'KeyC', 'KeyN'];

const PictureInPictureWindow = ({ className, videoClassName, pictureInPictureWindow, videoRef, onVideoClick }) => {
    const videoSlotRef = React.useRef(null);

    React.useLayoutEffect(() => {
        pictureInPictureWindow.document.body.className = classnames(className, styles['picture-in-picture']);
    }, [pictureInPictureWindow, className]);

    React.useLayoutEffect(() => {
        const videoElement = videoRef.current;
        const videoParent = videoElement.parentElement;
        const restoreVideo = () => videoElement.parentElement !== videoParent && videoParent.appendChild(videoElement);
        videoSlotRef.current.appendChild(videoElement);
        pictureInPictureWindow.addEventListener('pagehide', restoreVideo);
        return () => {
            pictureInPictureWindow.removeEventListener('pagehide', restoreVideo);
            restoreVideo();
        };
    }, [pictureInPictureWindow, videoRef]);

    React.useEffect(() => {
        const forwardKeyboardEvent = (event) => {
            if (FORWARDED_KEYS.includes(event.code) && !document.dispatchEvent(new KeyboardEvent(event.type, event))) {
                event.preventDefault();
            }
        };
        pictureInPictureWindow.addEventListener('keydown', forwardKeyboardEvent, true);
        pictureInPictureWindow.addEventListener('keyup', forwardKeyboardEvent, true);
        return () => {
            pictureInPictureWindow.removeEventListener('keydown', forwardKeyboardEvent, true);
            pictureInPictureWindow.removeEventListener('keyup', forwardKeyboardEvent, true);
        };
    }, [pictureInPictureWindow]);

    return ReactDOM.createPortal(
        <div ref={videoSlotRef} className={classnames(videoClassName, styles['video-slot'])} onClick={onVideoClick} />,
        pictureInPictureWindow.document.body
    );
};

PictureInPictureWindow.propTypes = {
    className: PropTypes.string,
    videoClassName: PropTypes.string,
    pictureInPictureWindow: PropTypes.object.isRequired,
    videoRef: PropTypes.object.isRequired,
    onVideoClick: PropTypes.func,
};

module.exports = PictureInPictureWindow;
