const { Addons, Board, Calendar, Detail, Discover, Intro, Library, Player, Search, Settings } = require('stremio-routes');

const homePath = '/';
const views = [
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
        },
        {
            path: '/search',
            component: Search
        }
    ],
    [
        {
            path: '/player',
            component: Player
        }
    ]
];
const onPathNotMatch = () => {
    window.history.back();
};

module.exports = {
    homePath,
    views,
    onPathNotMatch
};
