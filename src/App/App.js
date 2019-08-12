const React = require('react');
const { Router } = require('stremio-router');
const { KeyboardNavigation, ServicesProvider } = require('stremio/services');
const routerViewsConfig = require('./routerViewsConfig');
require('./styles');

const App = () => {
    const onPathNotMatch = React.useCallback(() => {
        window.history.back();
    }, []);
    const onScroll = React.useCallback((event) => {
        const scrollEvent = new UIEvent('scroll');
        for (const prop in event.nativeEvent) {
            scrollEvent[prop] = event.nativeEvent[prop];
        }
        window.dispatchEvent(scrollEvent);
    }, []);
    const services = React.useMemo(() => ({
        keyboardNavigation: new KeyboardNavigation()
    }), []);
    React.useEffect(() => {
        services.keyboardNavigation.start();
    }, [services]);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                <div className={'app-content'} onScroll={onScroll}>
                    <Router
                        homePath={'/'}
                        viewsConfig={routerViewsConfig}
                        onPathNotMatch={onPathNotMatch}
                    />
                </div>
            </ServicesProvider>
        </React.StrictMode>
    );
};

module.exports = App;
