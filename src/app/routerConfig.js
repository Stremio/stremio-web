import { Calendar, Discover, Addons, Board } from 'stremio-routes';

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
                }
            ]
        }
    ]
};

export default config;
