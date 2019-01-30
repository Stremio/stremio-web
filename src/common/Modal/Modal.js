import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { FocusableProvider } from 'stremio-common';
import withModalsContainer from './withModalsContainer';

const onModalsContainerDomTreeChange = ({ modalsContainerElement, contentElement }) => {
    return modalsContainerElement.lastElementChild === contentElement;
};

const Modal = ({ modalsContainer, children }) => {
    return ReactDOM.createPortal(
        <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
            <div className={'modal-container'}>
                {children}
            </div>
        </FocusableProvider>,
        modalsContainer
    );
};

Modal.propTypes = {
    modalsContainer: PropTypes.instanceOf(HTMLElement).isRequired
};

const ModalWithModalsContainer = withModalsContainer(Modal);

ModalWithModalsContainer.displayName = 'ModalWithModalsContainer';

export default ModalWithModalsContainer;
