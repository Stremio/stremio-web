const PathToRegexp = require('path-to-regexp');

const compilePath = (path, options) => {
    const keys = [];
    const regexp = PathToRegexp(path, keys, { ...options });
    return {
        regexp,
        urlParamsNames: keys.map(({ name }) => name)
    };
};

const routesRegexp = {
    intro: compilePath('/intro'),
    board: compilePath('/'),
    discover: compilePath('/discover(?:/(:type|)(?:/(:catalog|))?)?'),
    library: compilePath('/library(?:/(:type|)(?:/(:sort|))?)?'),
    calendar: compilePath('/calendar'),
    search: compilePath('/search'),
    detail: compilePath('/detail/:type/:id/:videoId'),
    addons: compilePath('/addons'),
    settings: compilePath('/settings'),
    player: compilePath('/player')
};

module.exports = routesRegexp;
