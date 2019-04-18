const { Calendar, Discover, Addons, Settings, Board, Player, Detail, Intro } = require('stremio-routes');

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
            path: '/discover/:type?/:sort?/:genre?',
            component: Discover
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
