// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const {
    withCoreSuspender,
    useProfile,
    useToast,
} = require('stremio/common');
const { useServices } = require('stremio/services');

const DefaultSettingsHandler = () => {
    const { core } = useServices();
    const toast = useToast();

    const profile = useProfile();

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('streamingServerUrl')) {
            const streamingServerUrl = searchParams.get('streamingServerUrl');

            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        streamingServerUrl
                    }
                }
            });
            setTimeout(() => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'Reload'
                    }
                });
            }, 1000);
            toast.show({
                type: 'info',
                title: `Using streaming server at ${streamingServerUrl}`,
                timeout: 4000
            });
        }
    }, []);

    return null;
};

module.exports = withCoreSuspender(DefaultSettingsHandler);
