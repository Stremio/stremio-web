require('spatial-navigation-polyfill');
const React = require('react');
const { Router } = require('stremio-router');
const { Core, KeyboardNavigation, ServicesProvider, Shell } = require('stremio/services');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

const App = () => {
    const onPathNotMatch = React.useCallback(() => {
        window.history.back();
    }, []);
    const services = React.useMemo(() => ({
        keyboardNavigation: new KeyboardNavigation(),
        shell: new Shell(),
        core: new Core()
    }), []);
    const [shellInitialized, setShellInitialized] = React.useState(false);
    const [coreInitialized, setCoreInitialized] = React.useState(false);
    React.useEffect(() => {
        const onShellStateChanged = () => {
            setShellInitialized(services.shell.active || services.shell.error instanceof Error);
        };
        const onCoreStateChanged = () => {
            setCoreInitialized(services.core.active || services.core.error instanceof Error);
            if (services.core.active) {
                services.core.dispatch({ action: 'LoadCtx' });
            }
        };
        services.shell.on('stateChanged', onShellStateChanged);
        services.core.on('stateChanged', onCoreStateChanged);
        services.keyboardNavigation.start();
        services.shell.start();
        services.core.start();
        return () => {
            services.keyboardNavigation.stop();
            services.shell.stop();
            services.core.stop();
            services.shell.off('stateChanged', onShellStateChanged);
            services.core.off('stateChanged', onCoreStateChanged);
        };
    }, []);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                {
                    shellInitialized && coreInitialized ?
                        <Router
                            className={styles['router']}
                            homePath={'/'}
                            viewsConfig={routerViewsConfig}
                            onPathNotMatch={onPathNotMatch}
                        />
                        :
                        <div className={styles['app-loader']} />
                }
            </ServicesProvider>
        </React.StrictMode>
    );
};

module.exports = App;
