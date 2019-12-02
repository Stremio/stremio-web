const React = require('react');

const useLiveRef = (value, dependencies) => {
    const ref = React.useRef(value);
    React.useLayoutEffect(() => {
        ref.current = value;
    }, dependencies);
    return ref;
};

module.exports = useLiveRef;
