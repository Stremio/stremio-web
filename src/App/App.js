const React = require('react');
const { Router } = require('stremio-navigation');
const { KeyboardNavigation, ServicesProvider } = require('stremio/services');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

const App = () => {
    const services = React.useMemo(() => ({
        keyboardNavigation: new KeyboardNavigation()
    }), []);
    const onPathNotMatch = React.useCallback(() => {
        window.history.back();
    }, []);
    React.useEffect(() => {
        services.keyboardNavigation.start();
    }, [services]);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                <Router
                    className={styles['router']}
                    homePath={'/'}
                    viewsConfig={routerViewsConfig}
                    onPathNotMatch={onPathNotMatch}
                />
            </ServicesProvider>
        </React.StrictMode>
    );
};

module.exports = App;
