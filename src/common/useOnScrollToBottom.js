// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useOnScrollToBottom = (cb, threshold = 0) => {
    const triggeredRef = React.useRef(false);
    const onScroll = React.useCallback((event) => {
        if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - threshold) {
            if (!triggeredRef.current) {
                triggeredRef.current = true;
                if (typeof cb === 'function') {
                    cb(event);
                }
            }
        } else {
            triggeredRef.current = false;
        }
    }, [cb]);
    return onScroll;
};

module.exports = useOnScrollToBottom;
