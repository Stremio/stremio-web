// Copyright (C) 2017-2026 Smart code 203358507

import { matchRoutes } from 'react-router';
import type { Location } from 'react-router';

export const PLAYER_PATH = '/player/:stream/:streamTransportUrl?/:metaTransportUrl?/:type?/:id?/:videoId?';
export const META_DETAILS_PATH = '/metadetails/:type?/:id?/:videoId?';
export const LEGACY_META_DETAILS_PATH = '/detail/:type?/:id?/:videoId?';

const routes = [PLAYER_PATH, META_DETAILS_PATH, LEGACY_META_DETAILS_PATH].map((path) => ({ path }));

const getBackFallback = (location: Location): string => {
    const match = matchRoutes(routes, location)?.[0];
    if (match) {
        const { type, id, videoId } = match.params;
        const isPlayer = match.route.path === PLAYER_PATH;
        if (type && id && (isPlayer || videoId)) {
            return `/metadetails/${encodeURIComponent(type)}/${encodeURIComponent(id)}${isPlayer ? '' : location.search}`;
        }
    }

    return '/';
};

export default getBackFallback;
