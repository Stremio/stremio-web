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
        regexp: /^\/discover(?:\/([^\/]*)\/([^\/]*)\/([^\/]*))?\/?$/i,
        urlParamsNames: ['addonTransportUrl', 'type', 'catalogId']
    },
    library: {
        regexp: /^\/library(?:\/([^\/]*))?\/?$/i,
        urlParamsNames: ['type']
    },
    search: {
        regexp: /^\/search\/?$/i,
        urlParamsNames: []
    },
    metadetails: {
        regexp: /^\/metadetails\/(?:([^\/]*))\/(?:([^\/]*))(?:\/([^\/]*)\/?)?$/i,
        urlParamsNames: ['type', 'id', 'videoId']
    },
    addons: {
        regexp: /^\/addons(?:\/([^\/]*?))?(?:\/([^\/]*?))?\/?$/i, // TODO both are required or none
        urlParamsNames: ['category', 'type']
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
