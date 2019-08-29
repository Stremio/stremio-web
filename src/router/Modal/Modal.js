const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { FocusableProvider } = require('../FocusableContext');
const { useModalsContainer } = require('../ModalsContainerContext');

const Modal = ({ className, children }) => {
    const modalsContainer = useModalsContainer();
    const onRoutesContainerDomTreeChange = React.useCallback(({ routesContainer, contentContainer }) => {
        return routesContainer.lastElementChild === contentContainer.parentElement.parentElement;
    }, []);
    const onModalsContainerDomTreeChange = React.useCallback(({ modalsContainer, contentContainer }) => {
        return modalsContainer.lastElementChild === contentContainer;
    }, []);
    return ReactDOM.createPortal(
        <FocusableProvider onRoutesContainerDomTreeChange={onRoutesContainerDomTreeChange} onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
            <div className={classnames(className, 'modal-container')}>{children}</div>
        </FocusableProvider>,
        modalsContainer
    );
};

Modal.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Modal;
