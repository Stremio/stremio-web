import React from 'react';
import ReactDOM from 'react-dom';
import { FocusableContext } from 'stremio-common';
import withModalsContainer from './withModalsContainer';

const Modal = ({ modalsContainer, children }) => {
    if (modalsContainer === null) {
        return null;
    }

    return ReactDOM.createPortal(
        <FocusableContext.Provider value={true}>
            <div className={'modal-container'}>
                {children}
            </div>
        </FocusableContext.Provider>,
        modalsContainer
    );
};

export default withModalsContainer(Modal);
