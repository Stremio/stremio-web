const routesRegexp = {
    intro: {
        regexp: /^\/intro\/?$/i,
        urlParamsNames: []
    },
    board: {
        regexp: /^\/?$/i,
        urlParamsNames: []
    },
    discover: {
        regexp: /^\/discover(?:\/([^\/]*?))?(?:\/([^\/]*?))?\/?$/i,
        urlParamsNames: ['type', 'catalog']
    },
    library: {
        regexp: /^\/library(?:\/([^\/]*?))?\/?$/i,
        urlParamsNames: ['type']
    },
    search: {
        regexp: /^\/search\/?$/i,
        urlParamsNames: []
    },
    detail: {
        regexp: /^\/detail\/(?:([^\/]+?))\/(?:([^\/]+?))(?:\/([^\/]*?))?\/?$/i,
        urlParamsNames: ['type', 'id', 'videoId']
    },
    addons: {
        regexp: /^\/addons(?:\/([^\/]*?))?(?:\/([^\/]*?))?\/?$/i,
        urlParamsNames: ['type', 'category']
    },
    settings: {
        regexp: /^\/settings\/?$/i,
        urlParamsNames: []
    },
    player: {
        regexp: /^\/player\/(?:([^\/]+?))\/(?:([^\/]+?))\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i,
        urlParamsNames: ['type', 'id', 'videoId', 'stream']
    }
};

module.exports = routesRegexp;
