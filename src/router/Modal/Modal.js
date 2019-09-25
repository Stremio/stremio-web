const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');
const { FocusableProvider } = require('../FocusableContext');
const { useModalsContainer } = require('../ModalsContainerContext');

const Modal = (props) => {
    const modalsContainer = useModalsContainer();
    const onRoutesContainerChildrenChange = React.useCallback(({ routesContainer, contentContainer }) => {
        return routesContainer.lastElementChild.contains(contentContainer);
    }, []);
    const onModalsContainerChildrenChange = React.useCallback(({ modalsContainer, contentContainer }) => {
        return modalsContainer.lastElementChild === contentContainer;
    }, []);
    return ReactDOM.createPortal(
        <FocusableProvider onRoutesContainerChildrenChange={onRoutesContainerChildrenChange} onModalsContainerChildrenChange={onModalsContainerChildrenChange}>
            <div {...props} className={classnames(props.className, 'modal-container')} />
        </FocusableProvider>,
        modalsContainer
    );
};

module.exports = Modal;
