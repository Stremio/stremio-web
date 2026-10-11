// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const useSeason = (): [number | null, (season: number) => void] => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const season = useMemo(() => {
        const value = searchParams.get('season');
        return value !== null && value !== '' && !Number.isNaN(Number(value)) ?
            parseInt(value, 10)
            :
            null;
    }, [searchParams]);

    const setSeason = useCallback((season: number) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set('season', String(season));
        const pathname = location.pathname.replace(/\/$/, '');
        navigate(`${pathname}?${nextSearchParams}`, { replace: true });
    }, [location.pathname, searchParams, navigate]);

    return [season, setSeason];
};

export default useSeason;
