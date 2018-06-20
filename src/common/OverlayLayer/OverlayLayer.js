import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import styles from './styles';

class OverlayLayer extends PureComponent {
    constructor(props) {
        super(props);

        this.layerRoot = document.createElement('div');
    }

    componentDidMount() {
        document.body.appendChild(this.layerRoot);
    }

    componentWillUnmount() {
        document.body.removeChild(this.layerRoot);
    }

    render() {
        this.layerRoot.className = classnames(styles['overlay-container'], this.props.className);
        return ReactDOM.createPortal(this.props.children, this.layerRoot);
    }
}

export default OverlayLayer;
