const React = require('react');
const { useServices } = require('stremio/services');

module.exports = (devTestWithUser) => {
    const { core } = useServices();
    // TODO: move these values in the state container
    const [settings, setSettings] = React.useState({});
    /*
        {
        'user': devTestWithUser ? {
            '_id': 'neo',
            'email': 'neo@example.com',
            'avatar': 'https://www.thenational.ae/image/policy:1.891803:1566372420/AC17-Matrix-20-04.jpg',
        } : null,
        'ui_language': "eng",
        'subtitles_language': 'bul',
        'subtitles_size': '100%',
        'subtitles_background': '',
        'subtitles_color': '#ffffff',
        'subtitles_outline_color': '#000',
        'auto-play_next_episode': 'true',
        'pause_playback_when_minimized': 'false',
        'hardware-accelerated_decoding': 'true',
        'launch_player_in_a_separate_window_(advanced)': 'true',
        'caching': '2048',
        'torrent_profile': 'profile-default',
        'streaming_server_is_available.': 'true',
    });
    */

    React.useEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            try {
                setSettings({ ...settings, ...state.ctx.content.settings });
            } catch (e) { }
        };
        window.top.core = core;
        core.on('NewModel', onNewState);
        core.dispatch({
            action: 'Load',
            args: {
                load: 'CatalogGrouped',
                args: { extra: [] }
            }
        });
        return () => {
            // Destructor function
            core.off('NewModel', onNewState);
        };
    }, []);

    const setTheSettings = React.useCallback(newSettings => {
        const { user, ...args } = { ...newSettings };
        console.log('Save', args);
        if(args.language === "bul") throw new Error('why')
        Object.keys(args).forEach(key=> args[key] = args[key].toString())
        setSettings(newSettings);
        core.dispatch({ action: 'Settings', args: { settings: 'Store', args } });
    }, [settings])

    return [settings, setTheSettings];
};

