// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useSearchParams } = require('react-router-dom');

const useAddonDetailsTransportUrl = (urlParams) => {
    const [queryParams, setQueryParams] = useSearchParams();
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

        setQueryParams(nextQueryParams);
    }, [urlParams, queryParams]);
    return [transportUrl, setTransportUrl];
};

module.exports = useAddonDetailsTransportUrl;
