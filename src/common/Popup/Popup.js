import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'stremio-common';
import Label from './Label';
import Menu from './Menu';
import styles from './styles';

class Popup extends Component {
    constructor(props) {
        super(props);

        this.labelRef = React.createRef();
        this.menuRef = React.createRef();

        this.state = {
            open: false,
            menuStyle: null
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
            nextState.open !== this.state.open ||
            nextState.menuStyle !== this.state.menuStyle;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.open && !prevState.open) {
            this.updateMenuStyle();
            if (typeof this.props.onOpen === 'function') {
                this.props.onOpen();
            }
        } else if (!this.state.open && prevState.open) {
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
        }
    }

    updateMenuStyle = () => {
        if (this.menuRef.current === null || this.labelRef.current === null) {
            return;
        }

        const labelRect = this.labelRef.current.getBoundingClientRect();
        const labelPosition = {
            left: labelRect.x,
            top: labelRect.y,
            right: document.body.offsetWidth - (labelRect.x + labelRect.width),
            bottom: document.body.offsetHeight - (labelRect.y + labelRect.height)
        };
        const menuRect = this.menuRef.current.getBoundingClientRect();
        const menuStyle = {
            visibility: 'visible'
        };

        if (menuRect.height <= labelPosition.bottom) {
            menuStyle.top = labelPosition.top + labelRect.height;
        } else if (menuRect.height <= labelPosition.top) {
            menuStyle.bottom = labelPosition.bottom + labelRect.height;
        } else if (labelPosition.bottom >= labelPosition.top) {
            menuStyle.top = labelPosition.top + labelRect.height;
            menuStyle.height = labelPosition.bottom;
        } else {
            menuStyle.bottom = labelPosition.bottom + labelRect.height;
            menuStyle.height = labelPosition.top;
        }

        if (menuRect.width <= (labelPosition.right + labelRect.width)) {
            menuStyle.left = labelPosition.left;
        } else if (menuRect.width <= (labelPosition.left + labelRect.width)) {
            menuStyle.right = labelPosition.right;
        } else if (labelPosition.right > labelPosition.left) {
            menuStyle.left = labelPosition.left;
            menuStyle.width = labelPosition.right + labelRect.width;
        } else {
            menuStyle.right = labelPosition.right;
            menuStyle.width = labelPosition.left + labelRect.width;
        }

        this.setState({ menuStyle });
    }

    onKeyUp = (event) => {
        if (event.keyCode === 27) { // escape
            event.stopPropagation();
            this.close();
        }
    }

    open = () => {
        this.setState({ open: true, menuStyle: null });
    }

    close = () => {
        this.setState({ open: false, menuStyle: null });
    }

    menuContainerOnClick = (event) => {
        event.stopPropagation();
    }

    renderMenu(children) {
        if (!this.state.open) {
            return null;
        }

        return (
            <Modal onRequestClose={this.close}>
                <div ref={this.menuRef} style={this.state.menuStyle} className={styles['menu-container']} onClick={this.menuContainerOnClick}>
                    {children}
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
                {React.cloneElement(this.props.children[0], { ref: this.labelRef, onClick: this.open })}
                {this.renderMenu(this.props.children[1])}
            </Fragment>
        );
    }
}

Popup.Label = Label;
Popup.Menu = Menu;

Popup.propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func
};

export default Popup;
