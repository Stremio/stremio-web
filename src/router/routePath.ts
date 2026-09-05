// Copyright (C) 2017-2026 Smart code 203358507

import type { Location, NavigateFunction } from 'react-router-dom';

const decodePathname = (pathname: string): string => {
    try {
        return decodeURIComponent(pathname);
    } catch {
        return pathname;
    }
};

const normalizeRoutePathname = (pathname: string): string => {
    return decodePathname(pathname)
        .replace(/^\/metadetails(?=\/|$)/, '/detail');
};

const getPathname = (path: string): string => path.split(/[?#]/)[0];

const getSearch = (path: string): string => {
    const searchIndex = path.indexOf('?');
    return searchIndex !== -1 ? path.slice(searchIndex) : '';
};

const sameRoutePathname = (location: Location, path: string): boolean => {
    return normalizeRoutePathname(location.pathname) === normalizeRoutePathname(getPathname(path));
};

const sameRouteLocation = (location: Location, path: string): boolean => {
    return sameRoutePathname(location, path) && location.search === getSearch(path);
};

const navigateToRoute = (navigate: NavigateFunction, location: Location, path: string): void => {
    if (!sameRouteLocation(location, path)) {
        navigate(path, {
            replace: sameRoutePathname(location, path)
        });
    }
};

export default navigateToRoute;
