const React = require('react');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
const FocusableProvider = require('../Focusable/FocusableProvider');
const withModalsContainer = require('./withModalsContainer');

const onModalsContainerDomTreeChange = ({ modalsContainerElement, contentElement }) => {
    return modalsContainerElement.lastElementChild === contentElement;
};

const Modal = ({ modalsContainer, children }) => {
    return ReactDOM.createPortal(
        <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
            <div>{children}</div>
        </FocusableProvider>,
        modalsContainer
    );
};

Modal.propTypes = {
    modalsContainer: PropTypes.instanceOf(HTMLElement).isRequired
};

const ModalWithModalsContainer = withModalsContainer(Modal);

ModalWithModalsContainer.displayName = 'ModalWithModalsContainer';

module.exports = ModalWithModalsContainer;
