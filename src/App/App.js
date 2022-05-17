// Copyright (C) 2017-2022 Smart code 203358507

require('spatial-navigation-polyfill');
const React = require('react');
const { Router } = require('stremio-router');
const { Core, Shell, Chromecast, KeyboardShortcuts, ServicesProvider } = require('stremio/services');
const { NotFound } = require('stremio/routes');
const { ToastProvider, AnimationSyncProvider, sanitizeLocationPath, CONSTANTS } = require('stremio/common');
const CoreEventsToaster = require('./CoreEventsToaster');
const ErrorDialog = require('./ErrorDialog');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

window.core_imports = {
    app_version: process.env.VERSION,
    shell_version: null,
    sanitize_location_path: sanitizeLocationPath
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
    const [initialized, setInitialized] = React.useState(false);
    React.useEffect(() => {
        let prevPath = window.location.hash.slice(1);
        const onLocationHashChange = () => {
            if (services.core.active) {
                services.core.transport.analytics({
                    event: 'LocationPathChanged',
                    args: { prevPath }
                });
            }
            prevPath = window.location.hash.slice(1);
        };
        window.addEventListener('hashchange', onLocationHashChange);
        return () => {
            window.removeEventListener('hashchange', onLocationHashChange);
        };
    }, []);
    React.useEffect(() => {
        const onCoreStateChanged = () => {
            setInitialized(
                (services.core.active || services.core.error instanceof Error) &&
                (services.shell.active || services.shell.error instanceof Error)
            );
        };
        const onShellStateChanged = () => {
            setInitialized(
                (services.core.active || services.core.error instanceof Error) &&
                (services.shell.active || services.shell.error instanceof Error)
            );
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
    React.useEffect(() => {
        if (services.core.active) {
            services.core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'PullAddonsFromAPI'
                }
            });
        }
    }, [initialized]);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                {
                    initialized ?
                        services.core.error instanceof Error ?
                            <ErrorDialog className={styles['error-container']} />
                            :
                            <AnimationSyncProvider>
                                <ToastProvider className={styles['toasts-container']}>
                                    <CoreEventsToaster />
                                    <Router
                                        className={styles['router']}
                                        viewsConfig={routerViewsConfig}
                                        onPathNotMatch={onPathNotMatch}
                                    />
                                </ToastProvider>
                            </AnimationSyncProvider>
                        :
                        <div className={styles['loader-container']} />
                }
            </ServicesProvider>
        </React.StrictMode>
    );
};

module.exports = App;
