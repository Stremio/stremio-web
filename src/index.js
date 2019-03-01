import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.runApp = () => {
    ReactDOM.render(<App />, document.getElementById('app'));
};
