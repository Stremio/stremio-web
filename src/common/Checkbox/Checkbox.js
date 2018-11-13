import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class Checkbox extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.checked !== this.props.checked ||
            nextProps.enabled !== this.props.enabled;
    }

    onClick = () => {
        if (this.props.enabled && typeof this.props.onClick === 'function') {
            this.props.onClick();
        }
    }

    render() {
        return (
            <div className={classnames(styles['root'], this.props.className, this.props.checked ? styles['checkbox-checked'] : null, this.props.enabled ? null : styles['checkbox-disabled'])}>
                <Icon className={classnames(styles['icon'])} icon={this.props.checked ? 'ic_check' : 'ic_box_empty'} />
                <input type={'checkbox'} className={styles['native-checkbox']} defaultChecked={this.props.checked} disabled={!this.props.enabled} onClick={this.onClick} />
            </div>
        );
    }
}

Checkbox.propTypes = {
    className: PropTypes.string,
    enabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func
};

Checkbox.defaultProps = {
    enabled: true,
    checked: false
};

export default Checkbox;
