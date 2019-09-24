const React = require('react');
const { Router } = require('stremio-router');
const { KeyboardNavigation, ServicesProvider, StremioCore } = require('stremio/services');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

const App = () => {
    const onPathNotMatch = React.useCallback(() => {
        window.history.back();
    }, []);
    const services = React.useMemo(() => ({
        keyboardNavigation: new KeyboardNavigation(),
        core: new StremioCore()
    }), []);
    const [coreActive, setCoreActive] = React.useState(services.core.active);
    React.useEffect(() => {
        const onCoreStateChanged = () => {
            setCoreActive(services.core.active);
        };
        services.keyboardNavigation.start();
        services.core.start();
        services.core.on('stateChanged', onCoreStateChanged);
        return () => {
            services.keyboardNavigation.stop();
            services.core.stop();
            services.core.off('stateChanged', onCoreStateChanged);
        };
    }, []);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                {
                    coreActive ?
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
