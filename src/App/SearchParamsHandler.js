// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { deepEqual } = require('fast-equals');
const { useCore } = require('stremio/core');
const { withCoreSuspender, useProfile, useToast } = require('stremio/common');
const { default: StreamingServerUrlModal } = require('./StreamingServerUrlModal');

const isValidStreamingServerUrl = (url) => {
    try {
        const { protocol } = new URL(url);
        return protocol === 'http:' || protocol === 'https:';
    } catch (_) {
        return false;
    }
};

const SearchParamsHandler = () => {
    const core = useCore();
    const profile = useProfile();
    const toast = useToast();

    const [searchParams, setSearchParams] = React.useState({});
    const [requestedStreamingServerUrl, setRequestedStreamingServerUrl] = React.useState(null);

    const onLocationChange = () => {
        const { origin, hash, search } = window.location;
        const { searchParams } = new URL(`${origin}${hash.replace('#', '')}${search}`);

        setSearchParams((previousSearchParams) => {
            const currentSearchParams = Object.fromEntries(searchParams.entries());
            return deepEqual(previousSearchParams, currentSearchParams) ? previousSearchParams : currentSearchParams;
        });
    };

    const onStreamingServerUrlConfirm = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    streamingServerUrl: requestedStreamingServerUrl,
                },
            },
        });
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddServerUrl',
                args: requestedStreamingServerUrl,
            },
        });
        toast.show({
            type: 'success',
            title: `Using streaming server at ${requestedStreamingServerUrl}`,
            timeout: 4000,
        });
        setRequestedStreamingServerUrl(null);
    }, [requestedStreamingServerUrl, profile.settings]);

    const onStreamingServerUrlCancel = React.useCallback(() => {
        setRequestedStreamingServerUrl(null);
    }, []);

    React.useEffect(() => {
        const { streamingServerUrl } = searchParams;

        if (streamingServerUrl && isValidStreamingServerUrl(streamingServerUrl)) {
            setRequestedStreamingServerUrl(streamingServerUrl);
        }
    }, [searchParams]);

    React.useEffect(() => {
        onLocationChange();
        window.addEventListener('hashchange', onLocationChange);
        return () => window.removeEventListener('hashchange', onLocationChange);
    }, []);

    return requestedStreamingServerUrl !== null ?
        <StreamingServerUrlModal
            url={requestedStreamingServerUrl}
            onConfirm={onStreamingServerUrlConfirm}
            onCancel={onStreamingServerUrlCancel}
        />
        :
        null;
};

module.exports = withCoreSuspender(SearchParamsHandler);
