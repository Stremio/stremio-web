const React = require('react');

const FocusedRouteContext = React.createContext(false);

FocusedRouteContext.displayName = 'FocusedRouteContext';

module.exports = FocusedRouteContext;
