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
        this.menuRef = React.createRef();
        this.scrollRef = React.createRef();
        this.borderTopRef = React.createRef();
        this.borderRightRef = React.createRef();
        this.borderBottomRef = React.createRef();
        this.borderLeftRef = React.createRef();

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
        if (this.state.open !== prevState.open) {
            this.updateStyles();
            if (this.state.open && typeof this.props.onOpen === 'function') {
                this.props.onOpen();
            } else if (!this.state.open && typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        }
    }

    updateStyles = () => {
        if (!this.state.open) {
            this.labelRef.current.style.border = null;
            return;
        }

        const menuDirections = {};
        const bodyRect = document.body.getBoundingClientRect();
        const menuRect = this.menuRef.current.getBoundingClientRect();
        const labelRect = this.labelRef.current.getBoundingClientRect();
        const labelPosition = {
            left: labelRect.x,
            top: labelRect.y,
            right: bodyRect.width - (labelRect.x + labelRect.width),
            bottom: bodyRect.height - (labelRect.y + labelRect.height)
        };

        if (menuRect.height <= labelPosition.bottom) {
            this.menuRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.scrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else if (menuRect.height <= labelPosition.top) {
            this.menuRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.scrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        } else if (labelPosition.bottom >= labelPosition.top) {
            this.menuRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.scrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else {
            this.menuRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.scrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        }

        if (menuRect.width <= (labelPosition.right + labelRect.width)) {
            this.menuRef.current.style.left = `${labelPosition.left}px`;
            this.scrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else if (menuRect.width <= (labelPosition.left + labelRect.width)) {
            this.menuRef.current.style.right = `${labelPosition.right}px`;
            this.scrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        } else if (labelPosition.right > labelPosition.left) {
            this.menuRef.current.style.left = `${labelPosition.left}px`;
            this.scrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else {
            this.menuRef.current.style.right = `${labelPosition.right}px`;
            this.scrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        }

        if (!!this.props.borderColor) {
            this.borderTopRef.current.style.backgroundColor = this.props.borderColor;
            this.borderRightRef.current.style.backgroundColor = this.props.borderColor;
            this.borderBottomRef.current.style.backgroundColor = this.props.borderColor;
            this.borderLeftRef.current.style.backgroundColor = this.props.borderColor;
            this.labelRef.current.style.borderColor = this.props.borderColor;
            this.labelRef.current.style.borderStyle = 'solid';
            if (menuDirections.top) {
                this.labelRef.current.style.borderWidth = '0 1px 1px 1px';
                if (menuDirections.left) {
                    this.borderBottomRef.current.style.right = `${labelRect.width - 1}px`;
                } else {
                    this.borderBottomRef.current.style.left = `${labelRect.width - 1}px`;
                }
            } else {
                this.labelRef.current.style.borderWidth = '1px 1px 0 1px';
                if (menuDirections.left) {
                    this.borderTopRef.current.style.right = `${labelRect.width - 1}px`;
                } else {
                    this.borderTopRef.current.style.left = `${labelRect.width - 1}px`;
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
            <Modal className={'modal-container'} onClick={this.close}>
                <div ref={this.menuRef} className={styles['menu-container']} onClick={this.menuContainerOnClick}>
                    <div ref={this.scrollRef} className={styles['scroll-container']}>
                        {children}
                    </div>
                    <div ref={this.borderTopRef} className={classnames(styles['border'], styles['border-top'])} />
                    <div ref={this.borderRightRef} className={classnames(styles['border'], styles['border-right'])} />
                    <div ref={this.borderBottomRef} className={classnames(styles['border'], styles['border-bottom'])} />
                    <div ref={this.borderLeftRef} className={classnames(styles['border'], styles['border-left'])} />
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
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    borderColor: PropTypes.string
};

export default Popup;
