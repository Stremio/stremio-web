import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { FocusableProvider } from 'stremio-common';

const Modal = (props) => ReactDOM.createPortal(
    <FocusableProvider>
        <div {...props} className={classnames(Modal.className, props.className)} />
    </FocusableProvider>,
    Modal.container
);

export default Modal;
