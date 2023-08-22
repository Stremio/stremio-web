// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useAnimationFrame = () => {
    const animationFrameId = React.useRef(null);
    const cancel = React.useCallback(() => {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
    }, []);
    const request = React.useCallback((cb) => {
        cancel();
        animationFrameId.current = requestAnimationFrame(() => {
            cb();
            animationFrameId.current = null;
        });
    }, []);
    return [request, cancel];
};

module.exports = useAnimationFrame;
