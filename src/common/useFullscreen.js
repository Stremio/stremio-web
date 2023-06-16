// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useFullscreen = () => {
    const [fullscreen, setFullscreen] = React.useState(document.fullscreenElement === document.documentElement);
    const requestFullscreen = React.useCallback(() => {
        document.documentElement.requestFullscreen();
    }, []);
    const exitFullscreen = React.useCallback(() => {
        document.exitFullscreen();
    }, []);
    const toggleFullscreen = React.useCallback(() => {
        if (fullscreen) {
            exitFullscreen();
        } else {
            requestFullscreen();
        }
    }, [fullscreen]);
    React.useEffect(() => {
        const onFullscreenChange = () => {
            setFullscreen(document.fullscreenElement === document.documentElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, []);
    return [fullscreen, requestFullscreen, exitFullscreen, toggleFullscreen];
};

module.exports = useFullscreen;
