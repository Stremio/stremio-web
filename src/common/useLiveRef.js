const React = require('react');

const useLiveRef = (value) => {
    const ref = React.useRef();
    ref.current = value;
    return ref;
};

module.exports = useLiveRef;
