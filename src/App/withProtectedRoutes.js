// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { Intro } = require('stremio/routes');
const { useProfile } = require('stremio/common');

const withProtectedRoutes = (Component) => {
    return function withProtectedRoutes(props) {
        const profile = useProfile();
        const previousAuthRef = React.useRef(profile.auth);
        React.useEffect(() => {
            if (previousAuthRef.current !== null && profile.auth === null) {
                window.location = '#/intro';
            }
            previousAuthRef.current = profile.auth;
        }, [profile]);
        const onRouteChange = React.useCallback((routeConfig) => {
            if (profile.auth !== null && routeConfig.component === Intro) {
                window.location.replace('#/');
                return true;
            }
        }, [profile]);
        return (
            <Component {...props} onRouteChange={onRouteChange} />
        );
    };
};

module.exports = withProtectedRoutes;
