import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'stremio-common';
import App from './app';

const container = document.getElementById('app');

Modal.container = container;
Modal.className = 'modal-container';

ReactDOM.render(<App />, container);
