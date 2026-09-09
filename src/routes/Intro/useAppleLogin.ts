// Copyright (C) 2017-2025 Smart code 203358507

import useSocialLogin from './useSocialLogin';

type AppleLoginResponse = {
    token: string;
    sub: string;
    email: string;
    name: string;
};

const STREMIO_URL = 'https://www.strem.io';

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
    return useSocialLogin({
        loginUrl: `${STREMIO_URL}/login-apple`,
        getCredentials,
        interval: 2000,
        errorMessage: 'Failed to authenticate with Apple',
    });
};

export default useAppleLogin;
