// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef } from 'react';
import { useCore } from 'stremio/core';
import { usePlatform } from 'stremio/common/Platform';
import { INTERFACE_SCALES } from 'stremio/common/CONSTANTS';
import { normalizeInterfaceScale, setInterfaceScale } from 'stremio/common/interfaceScale';

type ScaleAction = 'decrease' | 'increase' | 'reset';

const useInterfaceScale = (profile: Profile) => {
    const core = useCore();
    const { shell } = usePlatform();
    const settingsRef = useRef(profile.settings);
    const scale = normalizeInterfaceScale(profile.settings?.interfaceScale);

    useEffect(() => {
        settingsRef.current = profile.settings;
    }, [profile.settings]);

    const changeInterfaceScale = useCallback((action: ScaleAction) => {
        const settings = settingsRef.current;
        if (!settings) return;

        const current = normalizeInterfaceScale(settings.interfaceScale);
        const index = INTERFACE_SCALES.indexOf(current);
        const next = action === 'reset' ? 100 : INTERFACE_SCALES[
            Math.max(0, Math.min(INTERFACE_SCALES.length - 1, index + (action === 'increase' ? 1 : -1)))
        ];
        if (next === settings.interfaceScale) return;

        settingsRef.current = { ...settings, interfaceScale: next };
        core.transport.dispatch({
            action: 'Ctx',
            args: { action: 'UpdateSettings', args: settingsRef.current }
        });
    }, []);

    useEffect(() => {
        if (shell.active && !shell.state.initialized) return;

        if (shell.capabilities.nativeInterfaceScale) {
            setInterfaceScale(1);
            shell.send('win-set-interface-scale', { scale });
        } else {
            setInterfaceScale(scale / 100);
        }
    }, [scale, shell.state.initialized, shell.capabilities.nativeInterfaceScale]);

    useEffect(() => {
        const onScale = (action: string) => {
            if (action === 'increase' || action === 'decrease' || action === 'reset') {
                changeInterfaceScale(action);
            }
        };
        shell.on('interface-scale', onScale);
        return () => { shell.off('interface-scale', onScale); };
    }, [changeInterfaceScale]);

    return changeInterfaceScale;
};

export default useInterfaceScale;
