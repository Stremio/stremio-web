const React = require('react');

const ToastContext = React.createContext({
    show: () => { },
    clear: () => { }
});

ToastContext.displayName = 'ToastContext';

module.exports = ToastContext;
