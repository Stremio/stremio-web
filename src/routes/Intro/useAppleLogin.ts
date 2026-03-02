// Copyright (C) 2017-2025 Smart code 203358507

import { useCallback, useEffect, useRef } from 'react';
import { usePlatform } from 'stremio/common';
import hat from 'hat';

type AppleLoginResponse = {
    token: string;
    sub: string;
    email: string;
    name: string;
};

const STREMIO_URL = 'https://www.strem.io';
const MAX_TRIES = 25;

const getCredentials = async (state: string): Promise<AppleLoginResponse> => {
    try {
        const response = await fetch(`${STREMIO_URL}/login-apple-get-acc/${state}`);
        const { user } = await response.json();

        return Promise.resolve({
            token: user.token,
            sub: user.sub,
            email: user.email,
            // We might not receive a name from Apple, so we use an empty string as a fallback
            name: user.name ?? '',
        });
    } catch (e) {
        console.error('Failed to get credentials from Apple auth', e);
        return Promise.reject(e);
    }
};

const useAppleLogin = (): [() => Promise<AppleLoginResponse>, () => void] => {
    const platform = usePlatform();
    const started = useRef(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => new Promise<AppleLoginResponse>((resolve, reject) => {
        started.current = true;
        const state = hat(128);
        let tries = 0;

        platform.openExternal(`${STREMIO_URL}/login-apple/${state}`);

        const waitForCredentials = () => {
            if (started.current) {
                timeout.current && clearTimeout(timeout.current);
                timeout.current = setTimeout(() => {
                    if (tries >= MAX_TRIES)
                        return reject(new Error('Failed to authenticate with Apple', { cause: 'Number of allowed tries exceeded!' }));

                    tries++;

                    getCredentials(state)
                        .then(resolve)
                        .catch(waitForCredentials);
                }, 2000);
            }
        };

        waitForCredentials();
    }), []);

    const stop = useCallback(() => {
        started.current = false;
        timeout.current && clearTimeout(timeout.current);
    }, []);

    useEffect(() => {
        return () => stop();
    }, []);

    return [
        start,
        stop,
    ];
};

export default useAppleLogin;
