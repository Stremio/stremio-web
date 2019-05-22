const { Addons, Board, Calendar, Detail, Discover, Intro, Library, Player, Search, Settings } = require('stremio-routes');

const routerViewsConfig = [
    [
        {
            path: '/',
            component: Board
        },
        {
            path: '/intro',
            component: Intro
        },
        {
            path: '/calendar',
            component: Calendar
        },
        {
            path: '/discover/:type?/:catalog?/:category?',
            component: Discover
        },
        {
            path: '/library/:type?/:sort?',
            component: Library
        },
        {
            path: '/search',
            component: Search
        }
    ],
    [
        {
            path: '/addons',
            component: Addons
        },
        {
            path: '/settings',
            component: Settings
        },
        {
            path: '/detail',
            component: Detail
        }
    ],
    [
        {
            path: '/player',
            component: Player
        }
    ]
];

module.exports = routerViewsConfig;
