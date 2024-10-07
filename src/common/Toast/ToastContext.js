// Copyright (C) 2017-2023 Smart code 203358507

/* eslint-disable @typescript-eslint/no-empty-function */

const React = require('react');

const ToastContext = React.createContext({
    show: () => { },
    clear: () => { }
});

ToastContext.displayName = 'ToastContext';

module.exports = ToastContext;
