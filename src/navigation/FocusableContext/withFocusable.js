const React = require('react');
const useFocusable = require('./useFocusable');

const withFocusable = (Component) => {
    return (props) => {
        const focusable = useFocusable();
        return (
            <Component {...props} focusable={focusable} />
        );
    };
};

module.exports = withFocusable;
