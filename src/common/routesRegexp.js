const routesRegexp = {
    intro: {
        regexp: /^\/intro$/,
        urlParamsNames: []
    },
    board: {
        regexp: /^\/?$/,
        urlParamsNames: []
    },
    discover: {
        regexp: /^\/discover(?:\/([^/]*)\/([^/]*)\/([^/]*))?$/,
        urlParamsNames: ['transportUrl', 'type', 'catalogId']
    },
    library: {
        regexp: /^\/library(?:\/([^/]*))?$/,
        urlParamsNames: ['type']
    },
    continuewatching: {
        regexp: /^\/continuewatching(?:\/([^/]*))?$/,
        urlParamsNames: ['type']
    },
    search: {
        regexp: /^\/search$/,
        urlParamsNames: []
    },
    metadetails: {
        regexp: /^\/metadetails\/([^/]*)\/([^/]*)(?:\/([^/]*))?$/,
        urlParamsNames: ['type', 'id', 'videoId']
    },
    addons: {
        regexp: /^\/addons(?:\/([^/]*)\/([^/]*)\/([^/]*))?$/,
        urlParamsNames: ['transportUrl', 'catalogId', 'type']
    },
    settings: {
        regexp: /^\/settings$/,
        urlParamsNames: []
    },
    player: {
        regexp: /^\/player\/([^/]*)(?:\/([^/]*)\/([^/]*)\/([^/]*)\/([^/]*)\/([^/]*))?$/,
        urlParamsNames: ['stream', 'streamTransportUrl', 'metaTransportUrl', 'type', 'id', 'videoId']
    }
};

module.exports = routesRegexp;
