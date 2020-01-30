const React = require('react');
const ReactDOM = require('react-dom');
const Sentry = require('@sentry/browser');
const App = require('./App');

Sentry.init({ dsn: process.env.SENTRY_DSN });

ReactDOM.render(<App />, document.getElementById('app'));
