const React = require('react');

const FocusableContext = React.createContext(false);

FocusableContext.displayName = 'FocusableContext';

module.exports = FocusableContext;
