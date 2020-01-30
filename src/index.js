const React = require('react');
const ReactDOM = require('react-dom');
const Sentry = require('@sentry/browser');
const package = require('../package.json');
const App = require('./App');

Sentry.init(package.sentry);

ReactDOM.render(<App />, document.getElementById('app'));
