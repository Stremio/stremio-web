const React = require('react');

const useLiveRef = (value, dependencies) => {
    const ref = React.useRef(value);
    React.useEffect(() => {
        ref.current = value;
    }, dependencies);
    return ref;
};

module.exports = useLiveRef;
