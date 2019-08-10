const React = require('react');

const useFullscreen = () => {
    const [fullscreen, setFullscreen] = React.useState(document.fullscreenElement instanceof HTMLElement);
    const requestFullscreen = React.useCallback(() => {
        document.documentElement.requestFullscreen();
    }, []);
    const exitFullscreen = React.useCallback(() => {
        document.exitFullscreen();
    }, []);
    React.useEffect(() => {
        const onFullscreenChange = () => {
            setFullscreen(document.fullscreenElement instanceof HTMLElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, []);
    return [fullscreen, requestFullscreen, exitFullscreen];
};

module.exports = useFullscreen;
