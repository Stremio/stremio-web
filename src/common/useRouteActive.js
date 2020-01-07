const React = require('react');
const UrlUtils = require('url');
const useLocationHash = require('stremio/common/useLocationHash');

const useRouteActive = (routeRegexp) => {
    const locationHash = useLocationHash();
    const active = React.useMemo(() => {
        const { pathname } = UrlUtils.parse(locationHash.slice(1));
        return typeof pathname === 'string' && routeRegexp instanceof RegExp && !!pathname.match(routeRegexp);
    }, [locationHash, routeRegexp]);
    return active;
};

module.exports = useRouteActive;
