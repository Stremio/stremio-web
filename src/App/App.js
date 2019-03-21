const React = require('react');
const { Router } = require('stremio-common');
const routerConfig = require('./routerConfig').default;
const styles = require('./styles');

const App = () => (
    <React.StrictMode>
        <Router className={styles['router']} config={routerConfig} />
    </React.StrictMode>
);

module.exports = App;
