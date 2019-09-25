const React = require('react');
const UrlUtils = require('url');
const useLocationHash = require('stremio/common/useLocationHash');

const useRouteActive = (routeRegexp) => {
    const locationHash = useLocationHash();
    const active = React.useMemo(() => {
        const { pathname: locationPathname } = UrlUtils.parse(locationHash.slice(1));
        return routeRegexp instanceof RegExp && !!locationPathname.match(routeRegexp);
    }, [locationHash, routeRegexp]);
    return active;
};

module.exports = useRouteActive;
