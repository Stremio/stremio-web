const React = require('react');
const FocusedRouteContext = require('./FocusedRouteContext');

const useFocusedRoute = () => {
    return React.useContext(FocusedRouteContext);
};

module.exports = useFocusedRoute;
