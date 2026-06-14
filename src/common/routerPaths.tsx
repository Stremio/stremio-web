// Copyright (C) 2017-2025 Smart code 203358507

import React from 'react';
import routes from 'stremio/routes';

export const routerPaths = [
    {
        path: '/intro',
        view: 1,
        element: <routes.Intro />,
    },
    {
        path: '/discover/:transportUrl?/:type?/:catalogId?',
        view: 1,
        element: <routes.Discover />,
    },
    {
        path: '/library/:type?',
        view: 1,
        element: <routes.Library />,
    },
    {
        path: '/calendar/:year?/:month?',
        view: 1,
        element: <routes.Calendar />,
    },
    {
        path: '/continuewatching/:type?',
        view: 1,
        element: <routes.Library />,
    },
    {
        path: '/search',
        view: 1,
        element: <routes.Search />,
    },
    {
        path: '/metadetails/:type?/:id?/:videoId?',
        view: 2,
        element: <routes.MetaDetails />,
    },
    {
        path: '/detail/:type?/:id?/:videoId?',
        view: 2,
        element: <routes.MetaDetails />,
    },
    {
        path: '/addons/:type?/:transportUrl?/:catalogId?',
        view: 3,
        element: <routes.Addons />,
    },
    {
        path: '/settings',
        view: 3,
        element: <routes.Settings />,
    },
    {
        path: '/player/:stream/:streamTransportUrl?/:metaTransportUrl?/:type?/:id?/:videoId?',
        view: 4,
        element: <routes.Player />,
    },
    {
        path: '/',
        view: 0,
        element: <routes.Board />,
    },
    {
        path: '*',
        view: 1,
        element: <routes.NotFound />,
    },
];
