// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const ToastContext = require('./ToastContext');

const useToast = () => {
    return React.useContext(ToastContext);
};

module.exports = useToast;
