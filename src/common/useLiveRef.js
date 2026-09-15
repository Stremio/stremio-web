// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useLiveRef = (value) => {
    const ref = React.useRef(value);
    React.useLayoutEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
};

module.exports = useLiveRef;
