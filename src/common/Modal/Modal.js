import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import styles from './styles';

class Modal extends PureComponent {
    constructor(props) {
        super(props);

        this.root = document.createElement('div');
    }

    componentDidMount() {
        document.body.appendChild(this.root);
    }

    componentWillUnmount() {
        document.body.removeChild(this.root);
    }

    render() {
        return ReactDOM.createPortal(
            <div className={classnames(styles['modal-container'], this.props.className)} onClick={this.props.onRequestClose}>
                {this.props.children}
            </div>,
            this.root
        );
    }
}

Modal.propTypes = {
    onRequestClose: PropTypes.func,
    className: PropTypes.string
};

export default Modal;
