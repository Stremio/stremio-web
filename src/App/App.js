const React = require('react');
const { Router } = require('stremio-navigation');
const routerViewsConfig = require('./routerViewsConfig');
const styles = require('./styles');

const App = () => (
    <React.StrictMode>
        <Router
            className={styles['router']}
            viewsConfig={routerViewsConfig}
        />
    </React.StrictMode>
);

module.exports = App;
