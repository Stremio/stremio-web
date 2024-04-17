// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useFullscreen = (videoElementRef) => {
    const getVideoElement = React.useCallback(() => {
        if (videoElementRef && videoElementRef.current) {
            if (videoElementRef.current instanceof HTMLVideoElement)
                return videoElementRef.current;
            else
                return videoElementRef.current.querySelector('video');
        }

        return null;
    }, [videoElementRef]);

    const videoElement = getVideoElement();
    const [fullscreen, setFullscreen] = React.useState(document.fullscreenElement === document.documentElement || (videoElement && videoElement.webkitDisplayingFullscreen));
    const requestFullscreen = React.useCallback(() => {
        if (document.documentElement.requestFullscreen)
            document.documentElement.requestFullscreen();
        else {
            const videoElement = getVideoElement();
            if (videoElement && videoElement.webkitEnterFullscreen)
                videoElement.webkitEnterFullscreen();
        }
    }, [videoElementRef]);
    const exitFullscreen = React.useCallback(() => {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else {
            const videoElement = getVideoElement();
            if (videoElement && videoElement.webkitEnterFullscreen)
                videoElement.webkitExitFullscreen();
        }
    }, [videoElementRef]);
    const toggleFullscreen = React.useCallback(() => {
        if (fullscreen) {
            exitFullscreen();
        } else {
            requestFullscreen();
        }
    }, [fullscreen, exitFullscreen, requestFullscreen]);
    React.useEffect(() => {
        const videoElement = getVideoElement();

        const onFullscreenChange = () => {
            setFullscreen(document.fullscreenElement === document.documentElement || (videoElement && videoElement.webkitDisplayingFullscreen));
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);

        if (videoElement && videoElement.addEventListener) {
            videoElement.addEventListener('webkitenterfullscreen', onFullscreenChange);
            videoElement.addEventListener('webkitendfullscreen', onFullscreenChange);
        }

        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);

            if (videoElement && videoElement.addEventListener) {
                videoElement.removeEventListener('webkitenterfullscreen', onFullscreenChange);
                videoElement.removeEventListener('webkitendfullscreen', onFullscreenChange);
            }
        };
    }, []);
    return [fullscreen, requestFullscreen, exitFullscreen, toggleFullscreen];
};

module.exports = useFullscreen;
