const React = require('react');

const ScrollEventEmitter = (props) => {
    const onScroll = React.useCallback((event) => {
        if (typeof props.onScroll === 'function') {
            props.onScroll(event);
        }

        const reactScrollEvent = new Event('react-scroll');
        reactScrollEvent.nativeEvent = event.nativeEvent;
        window.dispatchEvent(reactScrollEvent);
    }, []);
    return (
        <div {...props} onScroll={onScroll} />
    );
};

module.exports = ScrollEventEmitter;
