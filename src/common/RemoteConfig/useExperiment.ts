// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect } from 'react';
import useRemoteConfig from './useRemoteConfig';

const useExperiment = (id: string) => {
    const { remoteConfig, experimentExposed, experimentEvent } = useRemoteConfig();
    const assignment = remoteConfig.experiments[id];
    const variant = assignment?.variant ?? null;
    const payload = assignment?.payload ?? null;

    useEffect(() => {
        if (variant !== null) {
            experimentExposed(id);
        }
    }, [id, variant, experimentExposed]);

    const track = useCallback((event: string) => {
        experimentEvent(id, event);
    }, [id, experimentEvent]);

    return { variant, payload, track };
};

export default useExperiment;
