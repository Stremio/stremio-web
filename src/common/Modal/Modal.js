import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => ReactDOM.createPortal(<div {...props} />, document.body);

export default Modal;
