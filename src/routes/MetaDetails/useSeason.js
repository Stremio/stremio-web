// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useLocation, useNavigate, useSearchParams } = require('react-router-dom');

const useSeason = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();
    const season = React.useMemo(() => {
        return queryParams.has('season') && !isNaN(queryParams.get('season')) ?
            parseInt(queryParams.get('season'), 10)
            :
            null;
    }, [queryParams]);
    const setSeason = React.useCallback((season) => {
        const nextQueryParams = new URLSearchParams(queryParams);
        nextQueryParams.set('season', season);
        const path = location.pathname.endsWith('/') ?
            location.pathname.slice(0, -1) :
            location.pathname;
        navigate(`${path}?${nextQueryParams}`, { replace: true });
    }, [location.pathname, queryParams, navigate]);
    return [season, setSeason];
};

module.exports = useSeason;
