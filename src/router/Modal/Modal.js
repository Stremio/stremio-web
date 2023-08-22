// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const { useModalsContainer } = require('../ModalsContainerContext');

const Modal = React.forwardRef(({ className, autoFocus, disabled, children, ...props }, ref) => {
    const modalsContainer = useModalsContainer();
    return ReactDOM.createPortal(
        <FocusLock ref={ref} className={classnames(className, 'modal-container')} autoFocus={!!autoFocus} disabled={!!disabled} lockProps={props}>
            {children}
        </FocusLock>,
        modalsContainer
    );
});

Modal.displayName = 'Modal';

Modal.propTypes = {
    className: PropTypes.string,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node
};

module.exports = Modal;
