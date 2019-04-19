const { Addons, Board, Calendar, Detail, Discover, Intro, Library, Player, Search, Settings } = require('stremio-routes');

const routerConfig = {
    defaultPath: '/',
    views: [
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
    ]
};

module.exports = routerConfig;
