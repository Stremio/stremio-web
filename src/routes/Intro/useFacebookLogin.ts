// Copyright (C) 2017-2023 Smart code 203358507

import useSocialLogin from './useSocialLogin';

const STREMIO_URL = 'https://www.strem.io';

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
    return useSocialLogin({
        loginUrl: `${STREMIO_URL}/login-fb`,
        getCredentials,
        interval: 1000,
        errorMessage: 'Failed to authenticate with facebook',
    });
};

module.exports = useFacebookLogin;
