// Copyright (C) 2017-2023 Smart code 203358507

require('spatial-navigation-polyfill');
const React = require('react');
const { useTranslation } = require('react-i18next');
const { Router } = require('stremio-router');
const { Core, Shell, Chromecast, DragAndDrop, KeyboardShortcuts, ServicesProvider } = require('stremio/services');
const { NotFound } = require('stremio/routes');
const { ToastProvider, TooltipProvider, CONSTANTS, withCoreSuspender } = require('stremio/common');
const ServicesToaster = require('./ServicesToaster');
const DeepLinkHandler = require('./DeepLinkHandler');
const SearchParamsHandler = require('./SearchParamsHandler');
const ErrorDialog = require('./ErrorDialog');
const withProtectedRoutes = require('./withProtectedRoutes');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

const RouterWithProtectedRoutes = withCoreSuspender(withProtectedRoutes(Router));

const App = () => {
    const { i18n } = useTranslation();
    const onPathNotMatch = React.useCallback(() => {
        return NotFound;
    }, []);
    const services = React.useMemo(() => {
        const core = new Core({
            appVersion: process.env.VERSION,
            shellVersion: null
        });
        return {
            core,
            shell: new Shell(),
            chromecast: new Chromecast(),
            keyboardShortcuts: new KeyboardShortcuts(),
            dragAndDrop: new DragAndDrop({ core })
        };
    }, []);
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
                    language: null,
                    androidReceiverCompatible: true
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
        services.dragAndDrop.start();
        window.services = services;
        return () => {
            services.core.stop();
            services.shell.stop();
            services.chromecast.stop();
            services.keyboardShortcuts.stop();
            services.dragAndDrop.stop();
            services.core.off('stateChanged', onCoreStateChanged);
            services.shell.off('stateChanged', onShellStateChanged);
            services.chromecast.off('stateChanged', onChromecastStateChange);
        };
    }, []);
    React.useEffect(() => {
        const onCoreEvent = ({ event, args }) => {
            switch (event) {
                case 'SettingsUpdated': {
                    if (args && args.settings && typeof args.settings.interfaceLanguage === 'string') {
                        i18n.changeLanguage(args.settings.interfaceLanguage);
                    }
                    break;
                }
            }
        };
        const onCtxState = (state) => {
            if (state && state.profile && state.profile.settings && typeof state.profile.settings.interfaceLanguage === 'string') {
                i18n.changeLanguage(state.profile.settings.interfaceLanguage);
            }
        };
        const onWindowFocus = () => {
            services.core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'PullAddonsFromAPI'
                }
            });
            services.core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'PullUserFromAPI'
                }
            });
            services.core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'SyncLibraryWithAPI'
                }
            });
            services.core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'PullNotifications'
                }
            });
        };
        if (services.core.active) {
            onWindowFocus();
            window.addEventListener('focus', onWindowFocus);
            services.core.transport.on('CoreEvent', onCoreEvent);
            services.core.transport
                .getState('ctx')
                .then(onCtxState)
                .catch((e) => console.error(e));
        }
        return () => {
            if (services.core.active) {
                window.removeEventListener('focus', onWindowFocus);
                services.core.transport.off('CoreEvent', onCoreEvent);
            }
        };
    }, [initialized]);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                {
                    initialized ?
                        services.core.error instanceof Error ?
                            <ErrorDialog className={styles['error-container']} />
                            :
                            <ToastProvider className={styles['toasts-container']}>
                                <TooltipProvider className={styles['tooltip-container']}>
                                    <ServicesToaster />
                                    <DeepLinkHandler />
                                    <SearchParamsHandler />
                                    <RouterWithProtectedRoutes
                                        className={styles['router']}
                                        viewsConfig={routerViewsConfig}
                                        onPathNotMatch={onPathNotMatch}
                                    />
                                </TooltipProvider>
                            </ToastProvider>
                        :
                        <div className={styles['loader-container']} />
                }
            </ServicesProvider>
        </React.StrictMode>
    );
};

module.exports = App;
