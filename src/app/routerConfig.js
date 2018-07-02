import { Calendar, Addons, Board } from 'stremio-routes';

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
