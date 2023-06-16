// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const useFacebookToken = () => {
    const getToken = React.useCallback(() => {
        return new Promise((resolve, reject) => {
            if (typeof FB === 'undefined') {
                reject(new Error('Failed to connect to Facebook'));
                return;
            }

            FB.getLoginStatus((resp) => {
                if (resp && resp.authResponse && typeof resp.authResponse.accessToken === 'string') {
                    resolve(resp.authResponse.accessToken);
                    return;
                }

                FB.login((resp) => {
                    if (!resp || !resp.authResponse || typeof resp.authResponse.accessToken !== 'string') {
                        reject(new Error('Failed to get token from Facebook'));
                        return;
                    }

                    resolve(resp.authResponse.accessToken);
                });
            });
        });
    }, []);
    React.useEffect(() => {
        window.fbAsyncInit = function() {
            FB.init({
                appId: '1537119779906825',
                status: true,
                xfbml: false,
                version: 'v2.7'
            });
        };
        const sdkScriptElement = document.createElement('script');
        sdkScriptElement.src = 'https://connect.facebook.net/en_US/sdk.js';
        sdkScriptElement.async = true;
        sdkScriptElement.defer = true;
        document.body.appendChild(sdkScriptElement);
        return () => {
            document.body.removeChild(sdkScriptElement);
        };
    }, []);
    return getToken;
};

module.exports = useFacebookToken;
