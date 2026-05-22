// Copyright (C) 2017-2025 Smart code 203358507

import React from 'react';
import { Routes as RRoutes, Route as RRoute, useLocation, useNavigate, matchPath } from 'react-router';
import type { Location } from 'react-router';
import { routerPaths } from 'stremio/common/routerPaths';
import Route from '../Route/Route';
import { useProfile } from 'stremio/common';

type RouterPath = typeof routerPaths[number];
type CachedView = {
    key: string,
    location: Location,
    route: RouterPath,
};

const VIEW_COUNT = Math.max(...routerPaths.map((route) => route.view)) + 1;

const getRouteForLocation = (location: Location) => {
    return routerPaths.find((route) => matchPath({ path: route.path, end: true }, location.pathname));
};

const getNextViews = (currentViews: (CachedView | null)[], location: Location) => {
    const route = getRouteForLocation(location);
    if (!route) {
        return currentViews;
    }

    return Array.from({ length: VIEW_COUNT }, (_, index) => {
        if (index < route.view) {
            return currentViews[index] || null;
        }

        if (index === route.view) {
            return {
                key: `${route.view}:${route.path}`,
                location,
                route,
            };
        }

        return null;
    });
};

const Routes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const profile = useProfile();
    const previousAuthRef = React.useRef(profile.auth);
    const [views, setViews] = React.useState<(CachedView | null)[]>(() => getNextViews([], location));

    /**
     * Replaced onRouteChange with following useEffect:
     */
    React.useEffect(() => {
        // Handle redirect if user logs out
        if (previousAuthRef.current !== null && profile.auth === null) {
            previousAuthRef.current = profile.auth;
            navigate('/intro', { replace: true });
        }

        // Handle redirect if user is logged in on intro screen
        if (profile.auth !== null && location.pathname === '/intro') {
            navigate('/', { replace: true });
        }
        previousAuthRef.current = profile.auth;
    }, [location.pathname, profile.auth]);

    React.useLayoutEffect(() => {
        setViews((currentViews) => getNextViews(currentViews, location));
    }, [location]);

    const visibleViews = views.filter((view): view is CachedView => view !== null);

    return <>
        {
            visibleViews.map((view, index) => (
                <RRoutes key={view.key} location={view.location}>
                    <RRoute
                        path={view.route.path}
                        element={<Route component={view.route.element} focused={index === visibleViews.length - 1} />}
                    />
                </RRoutes>
            ))
        }
    </>;
};

export default Routes;
