// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useSeason = (urlParams, queryParams) => {
    const season = React.useMemo(() => {
        return queryParams.has('season') && !isNaN(queryParams.get('season')) ?
            parseInt(queryParams.get('season'), 10)
            :
            null;
    }, [queryParams]);
    const setSeason = React.useCallback((season) => {
        const nextQueryParams = new URLSearchParams(queryParams);
        nextQueryParams.set('season', season);
        const path = urlParams.path.endsWith('/') ?
            urlParams.path.slice(0, -1):
            urlParams.path;

        window.location.replace(`#${path}?${nextQueryParams}`);
    }, [urlParams, queryParams]);
    return [season, setSeason];
};

module.exports = useSeason;
