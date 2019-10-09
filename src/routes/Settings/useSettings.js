const React = require('react');
const { useServices } = require('stremio/services');

module.exports = () => {
    const IGNORED_SETTINGS = Object.freeze(['user']);

    const { core } = useServices();
    const [settings, setSettings] = React.useState({});

    React.useEffect(() => {
        const updateState = () => {
            const state = core.getState();
            if (state.ctx && state.ctx.is_loaded && state.ctx.content && state.ctx.content.settings) {
                setSettings({
                    ...settings,
                    ...state.ctx.content.settings,
                    user: state.ctx.content.auth ? state.ctx.content.auth.user : null
                });
            }
        }

        core.on('NewModel', updateState);

        updateState();

        return () => {
            // Destructor function
            core.off('NewModel', updateState);
        };
    }, []);

    const setTheSettings = React.useCallback(newSettings => {
        const args = {};
        Object.keys(newSettings)
            .filter(prop => !IGNORED_SETTINGS.includes(prop))
            .forEach(key => args[key] = newSettings[key].toString())
        core.dispatch({ action: 'Settings', args: { settings: 'Store', args } });
    }, [])

    return [settings, setTheSettings];
};

