// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef } from 'react';

type PlayerState = {
    source?: string | null,
    subtitlesSrc?: string | null,
    time?: number,
    paused?: boolean,
};

// The streaming server exposes the stremio-cast protocol on
// /casting/{deviceId}/player: a POST sets any of the player properties and
// returns the full state of the remote player. Setting `source` to null stops
// playback on the device.
const playerUrl = (baseUrl: string, deviceId: string) => new URL(`casting/${deviceId}/player`, baseUrl).toString();

const useCastDevice = (baseUrl: string | null) => {
    const deviceId = useRef<string | null>(null);

    const setPlayerState = useCallback((device: string, state: PlayerState) => {
        if (!baseUrl) {
            return Promise.resolve();
        }

        return fetch(playerUrl(baseUrl, device), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(state),
        }).then(() => undefined).catch((error) => {
            console.error('CastDevice:', error);
        });
    }, [baseUrl]);

    const castStarted = useCallback((device: string) => {
        deviceId.current = device;
    }, []);

    const setSubtitles = useCallback((subtitlesSrc: string | null) => {
        if (deviceId.current === null) {
            return;
        }

        setPlayerState(deviceId.current, { subtitlesSrc });
    }, [setPlayerState]);

    const stopCasting = useCallback(() => {
        const device = deviceId.current;
        if (device === null) {
            return;
        }

        deviceId.current = null;
        setPlayerState(device, { source: null });
    }, [setPlayerState]);

    useEffect(() => {
        return () => {
            stopCasting();
        };
    }, [stopCasting]);

    return { castStarted, setSubtitles, stopCasting };
};

export default useCastDevice;
