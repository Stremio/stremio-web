import React from 'react';
import ReactDOM from 'react-dom';
import { FocusableProvider } from 'stremio-common';

const Modal = (props) => ReactDOM.createPortal(
    <FocusableProvider>
        <div {...props} />
    </FocusableProvider>,
    document.getElementById('app')
);

export default Modal;
