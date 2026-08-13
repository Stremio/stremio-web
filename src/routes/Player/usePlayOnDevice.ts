// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useMemo } from 'react';
import { useCore } from 'stremio/core';

type Stream = {
    deepLinks?: {
        externalPlayer?: {
            streaming?: string | null,
        },
    },
} | null;

const usePlayOnDevice = (stream: Stream) => {
    const core = useCore();
    const streamingUrl = useMemo(() => {
        return stream?.deepLinks?.externalPlayer?.streaming ?? null;
    }, [stream]);
    const playOnDevice = useCallback((deviceId: string, time: number | null = 0) => {
        if (streamingUrl) {
            core.transport.dispatch({
                action: 'StreamingServer',
                args: {
                    action: 'PlayOnDevice',
                    args: {
                        device: deviceId,
                        source: streamingUrl,
                        // Start-position seeking requires a server version that accepts the time property.
                        time: Math.max(0, Math.round(time ?? 0)),
                    }
                }
            });
        }
    }, [streamingUrl]);
    return { streamingUrl, playOnDevice };
};

export default usePlayOnDevice;
