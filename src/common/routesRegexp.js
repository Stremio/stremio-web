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
        urlParamsNames: ['sort']
    },
    calendar: {
        regexp: /^\/calendar\/?$/i,
        urlParamsNames: []
    },
    search: {
        regexp: /^\/search\/?$/i,
        urlParamsNames: []
    },
    detail: {
        regexp: /^\/detail\/(?:([^\/]+?))\/(?:([^\/]+?))(?:\/([^\/]*?))?\/?$/i,
        urlParamsNames: []
    },
    addons: {
        regexp: /^\/addons\/?$/i,
        urlParamsNames: []
    },
    settings: {
        regexp: /^\/settings\/?$/i,
        urlParamsNames: []
    },
    player: {
        regexp: /^\/player\/?$/i,
        urlParamsNames: []
    }
};

module.exports = routesRegexp;
