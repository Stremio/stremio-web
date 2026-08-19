// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef } from 'react';
import { useCore } from 'stremio/core';

const useCastDevice = () => {
    const core = useCore();
    const deviceId = useRef<string | null>(null);

    const castStarted = useCallback((device: string) => {
        deviceId.current = device;
    }, []);

    const setSubtitles = useCallback((subtitlesSrc: string | null) => {
        if (deviceId.current === null) {
            return;
        }

        core.transport.dispatch({
            action: 'StreamingServer',
            args: {
                action: 'SetDeviceSubtitles',
                args: {
                    device: deviceId.current,
                    subtitlesSrc,
                },
            },
        });
    }, []);

    const stopCasting = useCallback(() => {
        const device = deviceId.current;
        if (device === null) {
            return;
        }

        deviceId.current = null;
        core.transport.dispatch({
            action: 'StreamingServer',
            args: {
                action: 'StopOnDevice',
                args: {
                    device,
                },
            },
        });
    }, []);

    useEffect(() => {
        return () => {
            stopCasting();
        };
    }, [stopCasting]);

    return { castStarted, setSubtitles, stopCasting };
};

export default useCastDevice;
