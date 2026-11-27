// Copyright (C) 2017-2026 Smart code 203358507

import React, { MouseEvent, RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './styles.less';

const FORWARDED_KEYS = ['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyM', 'Minus', 'Equal', 'KeyG', 'KeyH', 'BracketLeft', 'BracketRight', 'KeyV', 'KeyC', 'KeyN'];

type Props = {
    className?: string,
    videoClassName?: string,
    pictureInPictureWindow: Window,
    videoRef: RefObject<HTMLElement>,
    onVideoClick?: (event: MouseEvent<HTMLDivElement>) => void,
};

const PictureInPictureWindow = ({ className, videoClassName, pictureInPictureWindow, videoRef, onVideoClick }: Props) => {
    const videoSlotRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        pictureInPictureWindow.document.body.className = classNames(className, styles['picture-in-picture']);
    }, [pictureInPictureWindow, className]);

    useLayoutEffect(() => {
        const videoElement = videoRef.current;
        const videoParent = videoElement?.parentElement;
        if (!videoElement || !videoParent || !videoSlotRef.current) {
            return;
        }

        const restoreVideo = () => {
            if (videoElement.parentElement !== videoParent) {
                videoParent.appendChild(videoElement);
            }
        };
        videoSlotRef.current.appendChild(videoElement);
        pictureInPictureWindow.addEventListener('pagehide', restoreVideo);
        return () => {
            pictureInPictureWindow.removeEventListener('pagehide', restoreVideo);
            restoreVideo();
        };
    }, [pictureInPictureWindow, videoRef]);

    useEffect(() => {
        const forwardKeyboardEvent = (event: KeyboardEvent) => {
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

    return createPortal(
        <div ref={videoSlotRef} className={classNames(videoClassName, styles['video-slot'])} onClick={onVideoClick} />,
        pictureInPictureWindow.document.body
    );
};

export default PictureInPictureWindow;
