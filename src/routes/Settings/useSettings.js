const React = require('react');
const { useServices } = require('stremio/services');

module.exports = () => {
    const IGNORED_SETTINGS = Object.freeze(['user', 'streaming']);

    const { core } = useServices();
    const [settings, setSettings] = React.useState({ streaming: {} });

    React.useEffect(() => {
        const updateState = (state) => {
            console.log(state)
            try {
                setSettings({
                    ...settings, ...state.ctx.content.settings,
                    user: state.ctx.content.auth && state.ctx.content.auth.user,
                    streaming: state.streaming_server_settings || {},
                });
            } catch (e) {
                console.log('Cannot update settings state', e);
            }
        }

        const state = core.getState();
        try {
            if (state.ctx.is_loaded) {
                updateState(state);
                return;
            }
        } catch (e) {
            console.log('Cannot find state context', e);
        }

        const onNewState = () => {
            updateState(core.getState());
        };
        core.on('NewModel', onNewState);
        core.dispatch({ action: 'LoadCtx' });
        return () => {
            // Destructor function
            core.off('NewModel', onNewState);
        };
    }, []);

    const setTheSettings = React.useCallback(newSettings => {
        const event = { action: 'Settings', args: { args: {} } };
        // This can be done with React.useEffect and newSettings.streaming as dependency
        const streamingServerSettingChanged = Object.keys(newSettings.streaming)
            .some(prop => settings.streaming[prop] !== newSettings.streaming[prop]);
        if (streamingServerSettingChanged) {
            event.args = { settings: 'StoreStreamingServer', args: newSettings.streaming };
        } else {
            event.args.settings = 'Store';
            Object.keys(newSettings)
                .filter(prop => !IGNORED_SETTINGS.includes(prop))
                .forEach(key => event.args.args[key] = newSettings[key].toString());
        }
        core.dispatch(event);
    }, [settings])

    return [settings, setTheSettings];
};

