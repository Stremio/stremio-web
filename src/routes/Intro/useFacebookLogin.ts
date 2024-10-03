// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useEffect, useRef } from 'react';
import hat from 'hat';
import { usePlatform } from 'stremio/common';

const STREMIO_URL = 'https://www.strem.io';
const MAX_TRIES = 10;

const getCredentials = async (state: string) => {
    try {
        const response = await fetch(`${STREMIO_URL}/login-fb-get-acc/${state}`);
        const { user } = await response.json();

        return Promise.resolve({
            email: user.email,
            password: user.fbLoginToken,
        });
    } catch (e) {
        console.error('Failed to get credentials from facebook auth', e);
        return Promise.reject(e);
    }
};

const useFacebookLogin = () => {
    const platform = usePlatform();
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const startFacebookLogin = useCallback(() => {
        return new Promise((resolve, reject) => {
            const state = hat(128);
            let tries = 0;

            platform.openExternal(`${STREMIO_URL}/login-fb/${state}`);

            const waitForCredentials = () => {
                timeout.current && clearTimeout(timeout.current);
                timeout.current = setTimeout(() => {
                    if (tries >= MAX_TRIES)
                        return reject(new Error('Failed to authenticate with facebook'));

                    tries++;

                    getCredentials(state)
                        .then(resolve)
                        .catch(waitForCredentials);
                }, 1000);
            };

            waitForCredentials();
        });
    }, []);

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
        };
    }, []);

    return startFacebookLogin;
};

module.exports = useFacebookLogin;
