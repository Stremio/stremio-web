import { Calendar, Discover, Addons, Settings, Board, Player, Detail, Intro } from 'stremio-routes';

const config = {
    views: [
        {
            routes: [
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
            ]
        },
        {
            routes: [
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
            ]
        },
        {
            routes: [
                {
                    path: '/player',
                    component: Player
                }
            ]
        }
    ]
};

export default config;
