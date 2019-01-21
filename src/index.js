import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'stremio-common';
import App from './app';

const container = document.getElementById('app');

Modal.container = container;

ReactDOM.render(<App />, container);
