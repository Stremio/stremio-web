const React = require('react');
const { Router } = require('stremio-navigation');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

const App = () => {
    const onPathNotMatch = React.useCallback(() => {
        window.history.back();
    }, []);

    return (
        <React.StrictMode>
            <Router
                className={styles['router']}
                homePath={'/'}
                viewsConfig={routerViewsConfig}
                onPathNotMatch={onPathNotMatch}
            />
        </React.StrictMode>
    );
};

module.exports = App;
