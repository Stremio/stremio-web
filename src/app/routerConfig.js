import { Calendar, Addons, Board } from 'stremio-routes';

const config = {
    views: [
        {
            routes: [
                {
                    path: '/calendar',
                    component: Calendar
                },
                {
                    path: '/board',
                    component: Board
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
