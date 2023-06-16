// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useAddonDetailsTransportUrl = (urlParams, queryParams) => {
    const transportUrl = React.useMemo(() => {
        return queryParams.get('addon');
    }, [queryParams]);
    const setTransportUrl = React.useCallback((transportUrl) => {
        const nextQueryParams = new URLSearchParams(queryParams);
        if (typeof transportUrl === 'string') {
            nextQueryParams.set('addon', transportUrl);
        } else {
            nextQueryParams.delete('addon');
        }

        window.location.replace(`#${urlParams.path}?${nextQueryParams}`);
    }, [urlParams, queryParams]);
    return [transportUrl, setTransportUrl];
};

module.exports = useAddonDetailsTransportUrl;
