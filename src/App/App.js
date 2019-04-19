const React = require('react');
const { Router } = require('stremio-navigation');
const { defaultPath, views: viewsConfig } = require('./routerConfig');
const styles = require('./styles');

const App = () => (
    <React.StrictMode>
        <Router
            className={styles['router']}
            defaultPath={defaultPath}
            viewsConfig={viewsConfig}
        />
    </React.StrictMode>
);

module.exports = App;
