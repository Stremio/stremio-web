// Copyright (C) 2017-2020 Smart code 203358507

require('spatial-navigation-polyfill');
const React = require('react');
const { Router } = require('stremio-router');
const { Core, Shell, Chromecast, KeyboardShortcuts, ServicesProvider } = require('stremio/services');
const { NotFound } = require('stremio/routes');
const { ToastProvider, sanitizeLocationPath, CONSTANTS } = require('stremio/common');
const CoreEventsToaster = require('./CoreEventsToaster');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

window.core_imports = {
    sanitize_location_path: sanitizeLocationPath,
    app_version: process.env.VERSION
};

const App = () => {
    const onPathNotMatch = React.useCallback(() => {
        return NotFound;
    }, []);
    const services = React.useMemo(() => ({
        core: new Core(),
        shell: new Shell(),
        chromecast: new Chromecast(),
        keyboardShortcuts: new KeyboardShortcuts()
    }), []);
    const [coreInitialized, setCoreInitialized] = React.useState(false);
    const [shellInitialized, setShellInitialized] = React.useState(false);
    React.useEffect(() => {
        const onCoreStateChanged = () => {
            setCoreInitialized(services.core.active);
            if (services.core.error) {
                alert(services.core.error);
            }
        };
        const onShellStateChanged = () => {
            setShellInitialized(services.shell.active || services.shell.error instanceof Error);
        };
        const onChromecastStateChange = () => {
            if (services.chromecast.active) {
                services.chromecast.transport.setOptions({
                    receiverApplicationId: CONSTANTS.CHROMECAST_RECEIVER_APP_ID,
                    autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
                    resumeSavedSession: false,
                    language: null
                });
            }
        };
        services.core.on('stateChanged', onCoreStateChanged);
        services.shell.on('stateChanged', onShellStateChanged);
        services.chromecast.on('stateChanged', onChromecastStateChange);
        services.core.start();
        services.shell.start();
        services.chromecast.start();
        services.keyboardShortcuts.start();
        window.services = services;
        return () => {
            services.core.stop();
            services.shell.stop();
            services.chromecast.stop();
            services.keyboardShortcuts.stop();
            services.core.off('stateChanged', onCoreStateChanged);
            services.shell.off('stateChanged', onShellStateChanged);
            services.chromecast.off('stateChanged', onChromecastStateChange);
        };
    }, []);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                {
                    coreInitialized && shellInitialized ?
                        <ToastProvider className={styles['toasts-container']}>
                            <CoreEventsToaster />
                            <Router
                                className={styles['router']}
                                viewsConfig={routerViewsConfig}
                                onPathNotMatch={onPathNotMatch}
                            />
                        </ToastProvider>
                        :
                        <div className={styles['app-loader']} />
                }
            </ServicesProvider>
        </React.StrictMode>
    );
};

module.exports = App;
