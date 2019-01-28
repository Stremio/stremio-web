import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FocusableContext } from 'stremio-common';
import withModalsContainer from './withModalsContainer';

const Modal = ({ modalsContainer, children }) => {
    const modalContainerRef = useRef(null);
    const [focusable, setFocusable] = useState(false);
    useEffect(() => {
        const nextFocusable = modalsContainer.lastElementChild === modalContainerRef.current;
        if (nextFocusable !== focusable) {
            setFocusable(nextFocusable);
        }
    });

    return ReactDOM.createPortal(
        <FocusableContext.Provider value={focusable}>
            <div ref={modalContainerRef} className={'modal-container'}>
                {children}
            </div>
        </FocusableContext.Provider>,
        modalsContainer
    );
};

export default withModalsContainer(Modal);
