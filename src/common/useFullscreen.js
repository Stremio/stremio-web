// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');

const useFullscreen = () => {
    const [fullscreen, setFullscreen] = React.useState(document.fullscreenElement === document.documentElement);
    const requestFullscreen = React.useCallback(async () => {
        if (window.shell !== null) {
            window.shell.invoke('set_fullscreen', true);
        } else {
            document.documentElement.requestFullscreen();
        }
    }, []);
    const exitFullscreen = React.useCallback(() => {
        if (window.shell !== null) {
            window.shell.invoke('set_fullscreen', false);
        } else {
            document.exitFullscreen();
        }
    }, []);
    const toggleFullscreen = React.useCallback(() => {
        if (fullscreen) {
            exitFullscreen();
        } else {
            requestFullscreen();
        }
    }, [fullscreen]);
    React.useEffect(() => {
        const onFullscreenChange = (response) => {
            if (typeof response === 'object' && typeof response.payload === 'boolean') {
                setFullscreen(response.payload);
            } else {
                setFullscreen(document.fullscreenElement === document.documentElement);
            }
        };
        if (window.shell !== null) {
            window.shell.addEventListener('fullscreenchange', onFullscreenChange);
        }
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, []);
    return [fullscreen, requestFullscreen, exitFullscreen, toggleFullscreen];
};

module.exports = useFullscreen;
