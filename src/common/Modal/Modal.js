import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

class Modal extends PureComponent {
    constructor(props) {
        super(props);

        this.modalElement = document.createElement('div');
    }

    componentWillMount() {
        document.body.appendChild(this.modalElement);
    }

    componentWillUnmount() {
        document.body.removeChild(this.modalElement);
    }

    render() {
        this.modalElement.className = classnames('modal-container', this.props.className);
        this.modalElement.onclick = this.props.onRequestClose;
        return ReactDOM.createPortal(this.props.children, this.modalElement);
    }
}

Modal.propTypes = {
    onRequestClose: PropTypes.func,
    className: PropTypes.string
};

export default Modal;
