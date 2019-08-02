const { Addons, Board, Calendar, Detail, Discover, Intro, Library, Player, Search, Settings } = require('stremio/routes');
const { routesRegexp } = require('stremio/common');

const routerViewsConfig = [
    [
        {
            ...routesRegexp.intro,
            component: Intro
        },
        {
            ...routesRegexp.board,
            component: Board
        },
        {
            ...routesRegexp.discover,
            component: Discover
        },
        {
            ...routesRegexp.library,
            component: Library
        },
        {
            ...routesRegexp.calendar,
            component: Calendar
        },
        {
            ...routesRegexp.search,
            component: Search
        }
    ],
    [
        {
            ...routesRegexp.detail,
            component: Detail
        },
        {
            ...routesRegexp.addons,
            component: Addons
        },
        {
            ...routesRegexp.settings,
            component: Settings
        }
    ],
    [
        {
            ...routesRegexp.player,
            component: Player
        }
    ]
];

module.exports = routerViewsConfig;
