const React = require('react');
const { Intro } = require('stremio/routes');
const { useProfile } = require('stremio/common');

const withProtectedRoutes = (Component) => {
    return function withProtectedRoutes(props) {
        const profile = useProfile();
        const onRouteChange = React.useCallback((routeConfig) => {
            if (profile.auth !== null && routeConfig.component === Intro) {
                window.location.replace('#/');
                return true;
            }
        }, [profile]);
        return (
            <Component {...props} onRouteChange={onRouteChange} />
        );
    }
};

module.exports = withProtectedRoutes;
