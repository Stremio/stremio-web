const React = require('react');
const ToastContext = require('./ToastContext');

const useToast = () => {
    return React.useContext(ToastContext);
};

module.exports = useToast;
