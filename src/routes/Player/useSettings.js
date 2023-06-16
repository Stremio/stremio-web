// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useProfile } = require('stremio/common');

const useSettings = () => {
    const { core } = useServices();
    const profile = useProfile();
    const updateSettings = React.useCallback((settings) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    ...settings
                }
            }
        });
    }, [profile]);
    return [profile.settings, updateSettings];
};

module.exports = useSettings;
