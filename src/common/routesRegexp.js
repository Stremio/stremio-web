const routesRegexp = {
    intro: {
        regexp: /^\/intro$/,
        urlParamsNames: []
    },
    board: {
        regexp: /^\/$/,
        urlParamsNames: []
    },
    discover: {
        regexp: /^\/discover(?:\/([^\/]*)\/([^\/]*)\/([^\/]*))?$/,
        urlParamsNames: ['addonTransportUrl', 'type', 'catalogId']
    },
    library: {
        regexp: /^\/library(?:\/([^\/]*))?$/,
        urlParamsNames: ['type']
    },
    search: {
        regexp: /^\/search$/,
        urlParamsNames: []
    },
    metadetails: {
        regexp: /^\/metadetails\/([^\/]*)\/([^\/]*)(?:\/([^\/]*))?$/,
        urlParamsNames: ['type', 'id', 'videoId']
    },
    addons: {
        regexp: /^\/addons(?:\/([^\/]*)\/([^\/]*)\/([^\/]*))?$/,
        urlParamsNames: ['addonTransportUrl', 'catalogId', 'type']
    },
    settings: {
        regexp: /^\/settings$/,
        urlParamsNames: []
    },
    player: {
        regexp: /^\/player\/([^\/]*)\/([^\/]*)\/([^\/]*)\/([^\/]*)$/,
        urlParamsNames: ['type', 'id', 'videoId', 'stream']
    }
};

module.exports = routesRegexp;
