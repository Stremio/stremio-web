const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const { useModalsContainer } = require('../ModalsContainerContext');

const Modal = ({ className, children, ...props }) => {
    const modalsContainer = useModalsContainer();
    return ReactDOM.createPortal(
        <FocusLock className={classnames(className, 'modal-container')} autoFocus={false} lockProps={props}>
            {children}
        </FocusLock>,
        modalsContainer
    );
};

module.exports = Modal;
