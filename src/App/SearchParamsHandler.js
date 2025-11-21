// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const isEqual = require('lodash.isequal');
const { withCoreSuspender, useProfile, useToast } = require('stremio/common');
const { useServices } = require('stremio/services');

const SearchParamsHandler = () => {
    const { core } = useServices();
    const profile = useProfile();
    const toast = useToast();

    const [searchParams, setSearchParams] = React.useState({});

    const onLocationChange = () => {
        const { origin, hash, search } = window.location;
        const { searchParams } = new URL(`${origin}${hash.replace('#', '')}${search}`);

        setSearchParams((previousSearchParams) => {
            const currentSearchParams = Object.fromEntries(searchParams.entries());
            return isEqual(previousSearchParams, currentSearchParams) ? previousSearchParams : currentSearchParams;
        });
    };

    React.useEffect(() => {
        const { streamingServerUrl } = searchParams;

        if (streamingServerUrl) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        streamingServerUrl,
                    },
                },
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'AddServerUrl',
                    args: streamingServerUrl,
                },
            });
            toast.show({
                type: 'success',
                title: `Using streaming server at ${streamingServerUrl}`,
                timeout: 4000,
            });
        }
    }, [searchParams]);

    React.useEffect(() => {
        onLocationChange();
        window.addEventListener('hashchange', onLocationChange);
        return () => window.removeEventListener('hashchange', onLocationChange);
    }, []);

    return null;
};

module.exports = withCoreSuspender(SearchParamsHandler);
