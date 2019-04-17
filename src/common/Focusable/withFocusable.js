const React = require('react');
const FocusableContext = require('./FocusableContext');

const withFocusable = (Component) => {
    return function withFocusable(props) {
        return (
            <FocusableContext.Consumer>
                {focusable => <Component {...props} focusable={focusable} />}
            </FocusableContext.Consumer>
        );
    };
};

module.exports = withFocusable;
