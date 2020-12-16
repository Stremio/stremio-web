// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./App');

if (typeof process.env.SENTRY_DSN === 'string') {
    const Sentry = require('@sentry/browser');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

ReactDOM.render(<App />, document.getElementById('app'));
