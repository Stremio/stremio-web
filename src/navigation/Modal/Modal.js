const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const { FocusableProvider } = require('../FocusableContext');
const { withModalsContainer } = require('../ModalsContainerContext');

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
    modalsContainer: PropTypes.instanceOf(HTMLElement).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

const ModalWithModalsContainer = withModalsContainer(Modal);

ModalWithModalsContainer.displayName = 'ModalWithModalsContainer';

module.exports = ModalWithModalsContainer;
