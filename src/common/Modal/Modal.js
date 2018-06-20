import { PureComponent } from 'react';
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
        this.root.className = classnames(styles['modal-container'], this.props.className);
        return ReactDOM.createPortal(this.props.children, this.root);
    }
}

export default Modal;
