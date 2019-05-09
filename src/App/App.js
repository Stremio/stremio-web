const React = require('react');
const { Router } = require('stremio-navigation');
const routerConfig = require('./routerConfig');
const styles = require('./styles');

const App = () => {
    const onPathNotMatch = React.useCallback(() => {
        window.history.back();
    }, []);

    return (
        <React.StrictMode>
            <Router
                className={styles['router']}
                homePath={routerConfig.homePath}
                viewsConfig={routerConfig.views}
                onPathNotMatch={onPathNotMatch}
            />
        </React.StrictMode>
    );
};

module.exports = App;
