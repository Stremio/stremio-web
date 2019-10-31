const React = require('react');

const useAnimationFrame = () => {
    const animationFrameId = React.useRef(null);
    const request = React.useCallback((cb) => {
        if (animationFrameId.current === null) {
            animationFrameId.current = requestAnimationFrame(() => {
                cb();
                animationFrameId.current = null;
            });
        }
    }, []);
    const cancel = React.useCallback(() => {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
    }, []);
    return [request, cancel];
};

module.exports = useAnimationFrame;
