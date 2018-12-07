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
        this.menuRef = React.createRef();
        this.menuScrollRef = React.createRef();
        this.menuBorderTopRef = React.createRef();
        this.menuBorderRightRef = React.createRef();
        this.menuBorderBottomRef = React.createRef();
        this.menuBorderLeftRef = React.createRef();

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
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children ||
            nextState.open !== this.state.open;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.open && !prevState.open) {
            this.updateStyles();
            if (typeof this.props.onOpen === 'function') {
                this.props.onOpen();
            }
        } else if (!this.state.open && prevState.open && typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

    updateStyles = () => {
        const menuDirections = {};
        const bodyRect = document.body.getBoundingClientRect();
        const menuRect = this.menuRef.current.getBoundingClientRect();
        const labelRect = this.labelRef.current.getBoundingClientRect();
        const borderWidth = 1 / window.devicePixelRatio;
        const labelPosition = {
            left: labelRect.x - bodyRect.x,
            top: labelRect.y - bodyRect.y,
            right: (bodyRect.width + bodyRect.x) - (labelRect.x + labelRect.width),
            bottom: (bodyRect.height + bodyRect.y) - (labelRect.y + labelRect.height)
        };

        if (menuRect.height <= labelPosition.bottom) {
            this.menuRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else if (menuRect.height <= labelPosition.top) {
            this.menuRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        } else if (labelPosition.bottom >= labelPosition.top) {
            this.menuRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else {
            this.menuRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        }

        if (menuRect.width <= (labelPosition.right + labelRect.width)) {
            this.menuRef.current.style.left = `${labelPosition.left}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else if (menuRect.width <= (labelPosition.left + labelRect.width)) {
            this.menuRef.current.style.right = `${labelPosition.right}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        } else if (labelPosition.right > labelPosition.left) {
            this.menuRef.current.style.left = `${labelPosition.left}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else {
            this.menuRef.current.style.right = `${labelPosition.right}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        }

        if (this.props.border) {
            this.menuBorderTopRef.current.style.height = `${borderWidth}px`;
            this.menuBorderRightRef.current.style.width = `${borderWidth}px`;
            this.menuBorderBottomRef.current.style.height = `${borderWidth}px`;
            this.menuBorderLeftRef.current.style.width = `${borderWidth}px`;
            this.labelBorderTopRef.current.style.height = `${borderWidth}px`;
            this.labelBorderTopRef.current.style.top = `${labelPosition.top}px`;
            this.labelBorderTopRef.current.style.right = `${labelPosition.right}px`;
            this.labelBorderTopRef.current.style.left = `${labelPosition.left}px`;
            this.labelBorderRightRef.current.style.width = `${borderWidth}px`;
            this.labelBorderRightRef.current.style.top = `${labelPosition.top}px`;
            this.labelBorderRightRef.current.style.right = `${labelPosition.right}px`;
            this.labelBorderRightRef.current.style.bottom = `${labelPosition.bottom}px`;
            this.labelBorderBottomRef.current.style.height = `${borderWidth}px`;
            this.labelBorderBottomRef.current.style.right = `${labelPosition.right}px`;
            this.labelBorderBottomRef.current.style.bottom = `${labelPosition.bottom}px`;
            this.labelBorderBottomRef.current.style.left = `${labelPosition.left}px`;
            this.labelBorderLeftRef.current.style.width = `${borderWidth}px`;
            this.labelBorderLeftRef.current.style.top = `${labelPosition.top}px`;
            this.labelBorderLeftRef.current.style.bottom = `${labelPosition.bottom}px`;
            this.labelBorderLeftRef.current.style.left = `${labelPosition.left}px`;

            if (menuDirections.top) {
                this.labelBorderTopRef.current.style.display = 'none';
                if (menuDirections.left) {
                    this.menuBorderBottomRef.current.style.right = `${labelRect.width - borderWidth}px`;
                } else {
                    this.menuBorderBottomRef.current.style.left = `${labelRect.width - borderWidth}px`;
                }
            } else {
                this.labelBorderBottomRef.current.style.display = 'none';
                if (menuDirections.left) {
                    this.menuBorderTopRef.current.style.right = `${labelRect.width - borderWidth}px`;
                } else {
                    this.menuBorderTopRef.current.style.left = `${labelRect.width - borderWidth}px`;
                }
            }
        }

        this.menuRef.current.style.visibility = 'visible';
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

    menuContainerOnClick = (event) => {
        event.stopPropagation();
    }

    renderLabel(children) {
        return React.cloneElement(children, { ref: this.labelRef, onClick: this.open });
    }

    renderMenu(children) {
        if (!this.state.open) {
            return null;
        }

        return (
            <Modal className={classnames('modal-container', this.props.className)} onClick={this.close}>
                <div ref={this.menuRef} className={styles['menu-container']} onClick={this.menuContainerOnClick}>
                    <div ref={this.menuScrollRef} className={styles['scroll-container']}>
                        {children}
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
