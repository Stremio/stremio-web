const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const { FocusableProvider } = require('../FocusableContext');
const { useModalsContainer } = require('../ModalsContainerContext');

const Modal = ({ children }) => {
    const modalsContainer = useModalsContainer();
    const onModalsContainerDomTreeChange = React.useCallback(({ modalsContainerElement, contentElement }) => {
        return modalsContainerElement.lastElementChild === contentElement;
    }, []);
    return ReactDOM.createPortal(
        <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
            <div>{children}</div>
        </FocusableProvider>,
        modalsContainer
    );
};

Modal.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Modal;
