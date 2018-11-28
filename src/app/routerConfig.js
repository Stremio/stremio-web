import { Calendar, Discover, Addons, Settings, Board } from 'stremio-routes';

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
                }
            ]
        }
    ]
};

export default config;
