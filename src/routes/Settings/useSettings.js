const React = require('react');
const { useServices } = require('stremio/services');

const IGNORED_SETTINGS = Object.freeze(['user', 'streaming']);

module.exports = () => {
    const { core } = useServices();

    const [settings, setSettings] = React.useState({
        user: null,
        streaming: {},
        streaming_loaded: false,
        streaming_error: ""
    });

    React.useEffect(() => {
        const onNewState = () => {
            const { ctx, streaming_server_settings } = core.getState()
            try {
                const newSettings = {
                    ...settings,
                    ...ctx.content.settings,
                    user: ctx.content.auth ? ctx.content.auth.user : null,
                    streaming: streaming_server_settings && streaming_server_settings.ready || {},
                    streaming_loaded: streaming_server_settings && !!(streaming_server_settings.error || streaming_server_settings.ready),
                    streaming_error: streaming_server_settings && streaming_server_settings.error || "",
                };
                setSettings(newSettings);
            } catch (e) {
                console.log('Cannot update settings state', e);
            }
        };
        const onStoreError = ({ event, args }) => {
            if (event !== "SettingsStoreError") return;
            // TODO: Notify with maybe a toast?
            console.log(args)
        }

        core.on('NewModel', onNewState);
        core.on('Event', onStoreError);

        onNewState();

        return () => {
            // Destructor function
            core.off('NewModel', onNewState);
            core.off('Event', onStoreError);
        };
    }, []);

    const setTheSettings = React.useCallback(newSettings => {
        const event = { action: 'Settings', args: { args: {} } };
        // This can be done with React.useEffect and newSettings.streaming as dependency
        const streamingServerSettingChanged = settings.streaming && Object.keys(newSettings.streaming)
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
