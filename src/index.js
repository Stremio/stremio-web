const React = require('react');
const ReactDOM = require('react-dom');
const Sentry = require('@sentry/browser');
const Package = require('../package');
const App = require('./App');

Sentry.init({ dsn: Package.Sentry.dsn });

ReactDOM.render(<App />, document.getElementById('app'));
