const React = require('react');
const { useServices } = require('stremio/services');

module.exports = (devTestWithUser) => {
    const IGNORED_SETTINGS = Object.freeze(['user']);

    const { core } = useServices();
    const [settings, setSettings] = React.useState({});

    React.useEffect(() => {
        const updateState = (state) => {
            try {
                setSettings({
                    ...settings, ...state.ctx.content.settings, user: devTestWithUser ? {
                        '_id': 'neo',
                        'email': 'neo@example.com',
                        'avatar': 'https://www.thenational.ae/image/policy:1.891803:1566372420/AC17-Matrix-20-04.jpg',
                    } : state.ctx.content.auth && state.ctx.content.auth.user
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
        const args = {};
        Object.keys(newSettings)
            .filter(prop => !IGNORED_SETTINGS.includes(prop))
            .forEach(key => args[key] = newSettings[key].toString())
        setSettings(newSettings);
        core.dispatch({ action: 'Settings', args: { settings: 'Store', args } });
    }, [settings])

    return [settings, setTheSettings];
};

