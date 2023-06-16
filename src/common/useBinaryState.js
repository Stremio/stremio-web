// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useBinaryState = (initialValue) => {
    const [value, setValue] = React.useState(!!initialValue);
    const on = React.useCallback(() => {
        setValue(true);
    }, []);
    const off = React.useCallback(() => {
        setValue(false);
    }, []);
    const toggle = React.useCallback(() => {
        setValue(!value);
    }, [value]);
    return [value, on, off, toggle];
};

module.exports = useBinaryState;
