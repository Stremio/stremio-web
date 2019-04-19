const React = require('react');
const { Router } = require('stremio-navigation');
const { homePath, onPathNotMatch, views: viewsConfig } = require('./routerConfig');
const styles = require('./styles');

const App = () => (
    <React.StrictMode>
        <Router
            className={styles['router']}
            homePath={homePath}
            viewsConfig={viewsConfig}
            onPathNotMatch={onPathNotMatch}
        />
    </React.StrictMode>
);

module.exports = App;
