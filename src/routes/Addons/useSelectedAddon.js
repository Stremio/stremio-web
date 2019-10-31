const React = require('react');
const UrlUtils = require('url');
const { routesRegexp, useLocationHash, useRouteActive } = require('stremio/common');

const useSelectedAddon = (transportUrl) => {
    const [addon, setAddon] = React.useState(null);
    const locationHash = useLocationHash();
    const active = useRouteActive(routesRegexp.addons.regexp);
    React.useEffect(() => {
        if (typeof transportUrl !== 'string') {
            setAddon(null);
            return;
        }

        fetch(transportUrl) // TODO
            .then((resp) => resp.json())
            .then((manifest) => setAddon({ manifest, transportUrl, flags: {} }));
    }, [transportUrl]);
    const clear = React.useCallback(() => {
        if (active) {
            const { pathname, search } = UrlUtils.parse(locationHash.slice(1));
            const queryParams = new URLSearchParams(search || '');
            queryParams.delete('addon');
            if ([...queryParams].length !== 0) {
                window.location.replace(`#${pathname}?${queryParams.toString()}`);
            } else {
                window.location.replace(`#${pathname}`);
            }
            setAddon(null);
        }
    }, [active, locationHash]);
    return [addon, clear, setAddon];
};

module.exports = useSelectedAddon;
