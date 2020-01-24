const React = require('react');
const ReactDOM = require('react-dom');
const Sentry = require('@sentry/browser');
const App = require('./App');

Sentry.init({dsn: "https://e47a6d214ae4478b81136c29612003a7@sentry.io/1911455"});

ReactDOM.render(<App />, document.getElementById('app'));
