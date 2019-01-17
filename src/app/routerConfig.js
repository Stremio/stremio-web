import { Calendar, Discover, Addons, Settings, Board, Player, Detail } from 'stremio-routes';

const config = {
    views: [
        {
            routes: [
                {
                    path: '/',
                    component: Board
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
