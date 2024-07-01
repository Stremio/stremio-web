// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useEpisode = (urlParams, queryParams) => {
    const episode = React.useMemo(() => {
        return queryParams.has('episode') && !isNaN(queryParams.get('episode')) ?
            parseInt(queryParams.get('episode'), 10)
            :
            null;
    }, [queryParams]);
    const setEpisode = React.useCallback((episode) => {
        const nextQueryParams = new URLSearchParams(queryParams);
        nextQueryParams.set('episode', episode);
        window.location.replace(`#${urlParams.path}?${nextQueryParams}`);
    }, [urlParams, queryParams]);
    return [episode, setEpisode];
};

module.exports = useEpisode;
