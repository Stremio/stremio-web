// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import getBackFallback from './getBackFallback';

const useGoBack = (originPath?: string) => {
    const location = useLocation();
    const navigate = useNavigate();

    return useCallback(() => {
        if (originPath) {
            navigate(originPath, { replace: true });
        } else if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            // Browser history can lead outside Stremio when a route was opened directly.
            navigate(getBackFallback(location), { replace: true });
        }
    }, [location, navigate, originPath]);
};

export default useGoBack;
