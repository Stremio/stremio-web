import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FocusableProvider } from 'stremio-common';

const Modal = ({ children }) => {
    const [modalContainer] = useState(document.createElement('div'));
    const onDomTreeChange = useCallback(({ onFocusableChange }) => {
        onFocusableChange(modalContainer.nextElementSibling === null);
    });
    useEffect(() => {
        modalContainer.className = Modal.modalClassName;
        Modal.modalsContainer.appendChild(modalContainer);
        return () => {
            Modal.modalsContainer.removeChild(modalContainer);
        };
    });

    return ReactDOM.createPortal(
        <FocusableProvider elements={[Modal.modalsContainer]} onDomTreeChange={onDomTreeChange}>
            {React.Children.only(children)}
        </FocusableProvider>,
        modalContainer
    );
};

export default Modal;
