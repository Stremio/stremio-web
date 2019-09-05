const routes = require('stremio/routes');
const { routesRegexp } = require('stremio/common');

const routerViewsConfig = [
    [
        {
            ...routesRegexp.intro,
            component: routes.Intro
        },
        {
            ...routesRegexp.board,
            component: routes.Board
        },
        {
            ...routesRegexp.discover,
            component: routes.Discover
        },
        {
            ...routesRegexp.library,
            component: routes.Library
        },
        {
            ...routesRegexp.calendar,
            component: routes.Calendar
        },
        {
            ...routesRegexp.search,
            component: routes.Search
        }
    ],
    [
        {
            ...routesRegexp.detail,
            component: routes.Detail
        },
        {
            ...routesRegexp.addons,
            component: routes.Addons
        },
        {
            ...routesRegexp.settings,
            component: routes.Settings
        }
    ],
    [
        {
            ...routesRegexp.player,
            component: routes.Player
        }
    ]
];

module.exports = routerViewsConfig;
