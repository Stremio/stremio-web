const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { FocusableProvider } = require('../FocusableContext');
const { useModalsContainer } = require('../ModalsContainerContext');

const Modal = ({ className, children }) => {
    const modalsContainer = useModalsContainer();
    const onRoutesContainerChildrenChange = React.useCallback(({ routesContainer, contentContainer }) => {
        return routesContainer.lastElementChild.contains(contentContainer);
    }, []);
    const onModalsContainerChildrenChange = React.useCallback(({ modalsContainer, contentContainer }) => {
        return modalsContainer.lastElementChild === contentContainer;
    }, []);
    return ReactDOM.createPortal(
        <FocusableProvider onRoutesContainerChildrenChange={onRoutesContainerChildrenChange} onModalsContainerChildrenChange={onModalsContainerChildrenChange}>
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
