const React = require('react');

const RouteFocusedContext = React.createContext(false);

RouteFocusedContext.displayName = 'RouteFocusedContext';

module.exports = RouteFocusedContext;
