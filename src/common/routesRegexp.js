const PathToRegexp = require('path-to-regexp');

const compilePath = (path, options) => {
    const keys = [];
    const regexp = PathToRegexp(path, keys, { ...options });
    return { keys, regexp };
};

const routesRegexp = {
    intro: compilePath('/intro'),
    board: compilePath('/'),
    discover: compilePath('/discover/(:type?)/(:catalog?)/(:category?)'),
    library: compilePath('/library/(:type?)/(:sort?)'),
    calendar: compilePath('/calendar'),
    search: compilePath('/search'),
    detail: compilePath('/detail'),
    addons: compilePath('/addons'),
    settings: compilePath('/settings'),
    player: compilePath('/player')
};

module.exports = routesRegexp;
