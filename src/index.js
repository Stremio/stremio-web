import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Modal } from 'stremio-common';

const appContainer = document.getElementById('app');

Modal.container = appContainer;

ReactDOM.render(<App />, appContainer);
