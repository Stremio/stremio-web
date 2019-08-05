const React = require('react');
const FocusableContext = require('./FocusableContext');

const useFocusable = () => {
    return React.useContext(FocusableContext);
};

module.exports = useFocusable;
