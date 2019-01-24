import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Modal } from 'stremio-common';
import Label from './Label';
import Menu from './Menu';
import styles from './styles';

class Popup extends Component {
    constructor(props) {
        super(props);

        this.labelRef = React.createRef();
        this.labelBorderTopRef = React.createRef();
        this.labelBorderRightRef = React.createRef();
        this.labelBorderBottomRef = React.createRef();
        this.labelBorderLeftRef = React.createRef();
        this.menuContainerRef = React.createRef();
        this.menuScrollRef = React.createRef();
        this.menuChildrenRef = React.createRef();
        this.menuBorderTopRef = React.createRef();
        this.menuBorderRightRef = React.createRef();
        this.menuBorderBottomRef = React.createRef();
        this.menuBorderLeftRef = React.createRef();
        this.hiddenBorderRef = React.createRef();
        this.popupMutationObserver = this.createPopupMutationObserver();

        this.state = {
            open: false
        };
    }

    componentDidMount() {
        window.addEventListener('blur', this.close);
        window.addEventListener('resize', this.close);
        window.addEventListener('keyup', this.onKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('blur', this.close);
        window.removeEventListener('resize', this.close);
        window.removeEventListener('keyup', this.onKeyUp);
        this.popupMutationObserver.disconnect();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children ||
            nextState.open !== this.state.open;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.open && !prevState.open) {
            this.updateStyles();
            this.popupMutationObserver.observe(document.documentElement, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true
            });
            if (typeof this.props.onOpen === 'function') {
                this.props.onOpen();
            }
        } else if (!this.state.open && prevState.open) {
            this.popupMutationObserver.disconnect();
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        }
    }

    createPopupMutationObserver = () => {
        let prevLabelRect = {};
        let prevMenuChildrenRect = {};
        return new MutationObserver(() => {
            if (this.state.open) {
                const labelRect = this.labelRef.current.getBoundingClientRect();
                const menuChildrenRect = this.menuChildrenRef.current.getBoundingClientRect();
                if (labelRect.x !== prevLabelRect.x ||
                    labelRect.y !== prevLabelRect.y ||
                    labelRect.width !== prevLabelRect.width ||
                    labelRect.height !== prevLabelRect.height ||
                    menuChildrenRect.x !== prevMenuChildrenRect.x ||
                    menuChildrenRect.y !== prevMenuChildrenRect.y ||
                    menuChildrenRect.width !== prevMenuChildrenRect.width ||
                    menuChildrenRect.height !== prevMenuChildrenRect.height) {
                    this.updateStyles();
                }

                prevLabelRect = labelRect;
                prevMenuChildrenRect = menuChildrenRect;
            } else {
                prevLabelRect = {};
                prevMenuChildrenRect = {};
            }
        });
    }

    updateStyles = () => {
        this.menuContainerRef.current.removeAttribute('style');
        this.menuScrollRef.current.removeAttribute('style');
        this.menuBorderTopRef.current.removeAttribute('style');
        this.menuBorderRightRef.current.removeAttribute('style');
        this.menuBorderBottomRef.current.removeAttribute('style');
        this.menuBorderLeftRef.current.removeAttribute('style');
        this.labelBorderTopRef.current.removeAttribute('style');
        this.labelBorderRightRef.current.removeAttribute('style');
        this.labelBorderBottomRef.current.removeAttribute('style');
        this.labelBorderLeftRef.current.removeAttribute('style');

        const menuDirections = {};
        const documentRect = document.documentElement.getBoundingClientRect();
        const labelRect = this.labelRef.current.getBoundingClientRect();
        const menuChildredRect = this.menuChildrenRef.current.getBoundingClientRect();
        const borderSize = parseFloat(window.getComputedStyle(this.hiddenBorderRef.current).getPropertyValue('border-top-width'));
        const labelPosition = {
            left: labelRect.x - documentRect.x,
            top: labelRect.y - documentRect.y,
            right: (documentRect.width + documentRect.x) - (labelRect.x + labelRect.width),
            bottom: (documentRect.height + documentRect.y) - (labelRect.y + labelRect.height)
        };

        if (menuChildredRect.height <= labelPosition.bottom) {
            this.menuContainerRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else if (menuChildredRect.height <= labelPosition.top) {
            this.menuContainerRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        } else if (labelPosition.bottom >= labelPosition.top) {
            this.menuContainerRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else {
            this.menuContainerRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        }

        if (menuChildredRect.width <= (labelPosition.right + labelRect.width)) {
            this.menuContainerRef.current.style.left = `${labelPosition.left}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else if (menuChildredRect.width <= (labelPosition.left + labelRect.width)) {
            this.menuContainerRef.current.style.right = `${labelPosition.right}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        } else if (labelPosition.right > labelPosition.left) {
            this.menuContainerRef.current.style.left = `${labelPosition.left}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else {
            this.menuContainerRef.current.style.right = `${labelPosition.right}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        }

        if (this.props.border) {
            this.menuBorderTopRef.current.style.height = `${borderSize}px`;
            this.menuBorderRightRef.current.style.width = `${borderSize}px`;
            this.menuBorderBottomRef.current.style.height = `${borderSize}px`;
            this.menuBorderLeftRef.current.style.width = `${borderSize}px`;
            this.labelBorderTopRef.current.style.height = `${borderSize}px`;
            this.labelBorderTopRef.current.style.top = `${labelPosition.top}px`;
            this.labelBorderTopRef.current.style.right = `${labelPosition.right}px`;
            this.labelBorderTopRef.current.style.left = `${labelPosition.left}px`;
            this.labelBorderRightRef.current.style.width = `${borderSize}px`;
            this.labelBorderRightRef.current.style.top = `${labelPosition.top}px`;
            this.labelBorderRightRef.current.style.right = `${labelPosition.right}px`;
            this.labelBorderRightRef.current.style.bottom = `${labelPosition.bottom}px`;
            this.labelBorderBottomRef.current.style.height = `${borderSize}px`;
            this.labelBorderBottomRef.current.style.right = `${labelPosition.right}px`;
            this.labelBorderBottomRef.current.style.bottom = `${labelPosition.bottom}px`;
            this.labelBorderBottomRef.current.style.left = `${labelPosition.left}px`;
            this.labelBorderLeftRef.current.style.width = `${borderSize}px`;
            this.labelBorderLeftRef.current.style.top = `${labelPosition.top}px`;
            this.labelBorderLeftRef.current.style.bottom = `${labelPosition.bottom}px`;
            this.labelBorderLeftRef.current.style.left = `${labelPosition.left}px`;

            if (menuDirections.top) {
                this.labelBorderTopRef.current.style.left = `${labelPosition.left + menuChildredRect.width}px`;
                if (menuDirections.left) {
                    this.menuBorderBottomRef.current.style.right = `${labelRect.width - borderSize}px`;
                } else {
                    this.menuBorderBottomRef.current.style.left = `${labelRect.width - borderSize}px`;
                }
            } else {
                this.labelBorderBottomRef.current.style.left = `${labelPosition.left + menuChildredRect.width}px`;
                if (menuDirections.left) {
                    this.menuBorderTopRef.current.style.right = `${labelRect.width - borderSize}px`;
                } else {
                    this.menuBorderTopRef.current.style.left = `${labelRect.width - borderSize}px`;
                }
            }
        }

        this.menuContainerRef.current.style.visibility = 'visible';
    }

    onKeyUp = (event) => {
        if (this.state.open && event.keyCode === 27) { // escape
            event.stopPropagation();
            this.close();
        }
    }

    open = () => {
        this.setState({ open: true });
    }

    close = () => {
        this.setState({ open: false });
    }

    labelOnClick = (event) => {
        event.stopPropagation();
        this.open();
    }

    menuContainerOnClick = (event) => {
        event.stopPropagation();
    }

    modalBackgroundOnClick = (event) => {
        event.stopPropagation();
        this.close();
    }

    renderLabel(children) {
        return React.cloneElement(children, { ref: this.labelRef, onClick: this.labelOnClick });
    }

    renderMenu(children) {
        if (!this.state.open) {
            return null;
        }

        return (
            <Modal>
                <div className={classnames(styles['modal-container'], this.props.className)} onClick={this.modalBackgroundOnClick}>
                    <div ref={this.menuContainerRef} className={styles['menu-container']} onClick={this.menuContainerOnClick}>
                        <div ref={this.menuScrollRef} className={styles['menu-scroll-container']}>
                            {React.cloneElement(children, { ref: this.menuChildrenRef })}
                        </div>
                        <div ref={this.menuBorderTopRef} className={classnames(styles['border'], styles['border-top'])} />
                        <div ref={this.menuBorderRightRef} className={classnames(styles['border'], styles['border-right'])} />
                        <div ref={this.menuBorderBottomRef} className={classnames(styles['border'], styles['border-bottom'])} />
                        <div ref={this.menuBorderLeftRef} className={classnames(styles['border'], styles['border-left'])} />
                    </div>
                    <div ref={this.labelBorderTopRef} className={classnames(styles['border'], styles['border-top'])} />
                    <div ref={this.labelBorderRightRef} className={classnames(styles['border'], styles['border-right'])} />
                    <div ref={this.labelBorderBottomRef} className={classnames(styles['border'], styles['border-bottom'])} />
                    <div ref={this.labelBorderLeftRef} className={classnames(styles['border'], styles['border-left'])} />
                    <div ref={this.hiddenBorderRef} className={classnames(styles['border'], styles['border-hidden'])} />
                </div>
            </Modal>
        );
    }

    render() {
        if (React.Children.count(this.props.children) !== 2) {
            console.warn(new Error('Popup children should be one Popup.Label and one Popup.Menu'));
            return null;
        }

        if (!React.isValidElement(this.props.children[0]) || this.props.children[0].type !== Label) {
            console.warn(new Error('First Popup child should be of type Popup.Label'));
            return null;
        }

        if (!React.isValidElement(this.props.children[1]) || this.props.children[1].type !== Menu) {
            console.warn(new Error('Second Popup child should be of type Popup.Menu'));
            return null;
        }

        return (
            <Fragment>
                {this.renderLabel(this.props.children[0])}
                {this.renderMenu(this.props.children[1])}
            </Fragment>
        );
    }
}

Popup.Label = Label;
Popup.Menu = Menu;

Popup.propTypes = {
    className: PropTypes.string,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    border: PropTypes.bool.isRequired
};
Popup.defaultProps = {
    border: false
};

export default Popup;
