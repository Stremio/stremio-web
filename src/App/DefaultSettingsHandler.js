// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const {
    withCoreSuspender,
    useProfile,
} = require('stremio/common');
const useProfileSettingsInputs = require('stremio/routes/Settings/useProfileSettingsInputs');
const { useServices } = require('stremio/services');

const DefaultSettingsHandler = () => {
    const { core } = useServices();

    const profile = useProfile();

    const { streamingServerUrlInput } = useProfileSettingsInputs(profile);

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('streamingServerUrl')) {
            streamingServerUrlInput.onChange(searchParams.get('streamingServerUrl'));
            setTimeout(() => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'Reload'
                    }
                });
            }, 2000);
        }
    }, []);

    return null;
};

module.exports = withCoreSuspender(DefaultSettingsHandler);
