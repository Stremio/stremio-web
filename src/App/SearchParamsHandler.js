// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { deepEqual } = require('fast-equals');
const { useCore } = require('stremio/core');
const { CONSTANTS, withCoreSuspender, useModelState, useProfile, useToast } = require('stremio/common');
const { default: StreamingServerUrlModal } = require('./StreamingServerUrlModal');

const DEFAULT_STREAMING_SERVER_URLS = new Set([
    new URL(CONSTANTS.DEFAULT_STREAMING_SERVER_URL).href,
    new URL('http://localhost:11470').href,
]);
const LOOPBACK_HOSTNAMES = new Set(['127.0.0.1', 'localhost']);

const parse = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
    } catch (_) {
        return null;
    }
};

const normalize = (value) => parse(value)?.href ?? null;
const loopback = (url) => url.protocol === 'http:' && LOOPBACK_HOSTNAMES.has(url.hostname);
const map = ({ streamingServerUrls }) => ({ streamingServerUrls });

const SearchParamsHandler = () => {
    const core = useCore();
    const profile = useProfile();
    const toast = useToast();
    const { streamingServerUrls } = useModelState({ model: 'ctx', map: map });

    const [searchParams, setSearchParams] = React.useState({});
    const [requested, set] = React.useState(null);
    const handledStreamingServerUrlRef = React.useRef(null);

    const onLocationChange = () => {
        const { origin, hash, search } = window.location;
        const { searchParams } = new URL(`${origin}${hash.replace('#', '')}${search}`);

        setSearchParams((previousSearchParams) => {
            const currentSearchParams = Object.fromEntries(searchParams.entries());
            return deepEqual(previousSearchParams, currentSearchParams) ? previousSearchParams : currentSearchParams;
        });
    };

    const apply = React.useCallback((url, { save, notify }) => {
        if (save) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'AddServerUrl',
                    args: url,
                },
            });
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    streamingServerUrl: url,
                },
            },
        });

        if (notify) {
            toast.show({
                type: 'success',
                title: `Using streaming server at ${url}`,
                timeout: 4000,
            });
        }
    }, [core, profile.settings, toast]);

    const onConfirm = React.useCallback(() => {
        apply(requested, { save: true, notify: false });
        set(null);
    }, [apply, requested]);

    const onCancel = React.useCallback(() => {
        set(null);
    }, []);

    React.useEffect(() => {
        const { streamingServerUrl } = searchParams;

        if (handledStreamingServerUrlRef.current === streamingServerUrl) {
            return;
        }
        handledStreamingServerUrlRef.current = streamingServerUrl ?? null;
        set(null);

        const parsed = parse(streamingServerUrl);
        if (parsed === null) {
            return;
        }

        const normalized = parsed.href;
        const selected = normalize(profile.settings.streamingServerUrl);
        if (normalized === selected) {
            return;
        }

        if (DEFAULT_STREAMING_SERVER_URLS.has(normalized)) {
            apply(normalized, { save: true, notify: false });
            return;
        }

        const saved = streamingServerUrls.some(({ url }) => (
            normalize(url) === normalized
        ));
        if (saved) {
            apply(normalized, { save: false, notify: true });
            return;
        }

        if (loopback(parsed)) {
            apply(normalized, { save: true, notify: true });
            return;
        }

        set(normalized);
    }, [apply, profile.settings.streamingServerUrl, searchParams, streamingServerUrls]);

    React.useEffect(() => {
        onLocationChange();
        window.addEventListener('hashchange', onLocationChange);
        return () => window.removeEventListener('hashchange', onLocationChange);
    }, []);

    return requested !== null ?
        <StreamingServerUrlModal
            url={requested}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
        :
        null;
};

module.exports = withCoreSuspender(SearchParamsHandler);
