// Copyright (C) 2017-2025 Smart code 203358507

import { useCallback } from 'react';
import useProfile from './useProfile';
import { useCore } from 'stremio/core';

const useSettings = (): [Settings, (settings: Partial<Settings>) => void] => {
    const core = useCore();
    const profile = useProfile();

    const updateSettings = useCallback((settings: Partial<Settings>) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    ...settings
                }
            }
        });
    }, [profile.settings]);

    return [profile.settings, updateSettings];
};

export default useSettings;
