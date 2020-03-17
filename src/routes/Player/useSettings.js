const React = require('react');
const { useProfile } = require('stremio/common');
const { useServices } = require('stremio/services');

const useSettings = () => {
    const { core } = useServices();
    const profile = useProfile();
    const updateSettings = React.useCallback((settings) => {
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    ...settings
                }
            }
        });
    }, [profile.settings]);
    return [profile.settings, updateSettings];
};

module.exports = useSettings;
