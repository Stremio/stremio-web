// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const {
    withCoreSuspender,
    useProfile,
} = require('stremio/common');
const useProfileSettingsInputs = require('stremio/routes/Settings/useProfileSettingsInputs');

const DefaultSettingsHandler = () => {
    const profile = useProfile();

    const { streamingServerUrlInput } = useProfileSettingsInputs(profile);

    React.useLayoutEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('streamingServerUrl')) {
            streamingServerUrlInput.onChange(searchParams.get('streamingServerUrl'));
        }
    }, []);

    return null;
};

module.exports = withCoreSuspender(DefaultSettingsHandler);
