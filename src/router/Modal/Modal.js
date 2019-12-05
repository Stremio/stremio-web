const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const { useModalsContainer } = require('../ModalsContainerContext');

const Modal = ({ className, autoFocus, children, ...props }) => {
    const modalsContainer = useModalsContainer();
    return ReactDOM.createPortal(
        <FocusLock className={classnames(className, 'modal-container')} autoFocus={!!autoFocus} lockProps={props}>
            {children}
        </FocusLock>,
        modalsContainer
    );
};

Modal.propTypes = {
    className: PropTypes.string,
    autoFocus: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Modal;
