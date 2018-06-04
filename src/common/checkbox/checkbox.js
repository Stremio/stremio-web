import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

class Checkbox extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.checked !== this.props.checked;
    }

    onPress = () => {
        if (typeof this.props.onPress === 'function') {
            this.props.onPress();
        }
    }

    render() {
        return (
            <div style={styles.root} onClick={this.onPress} />
        );
    }
}

Checkbox.propTypes = {
    enabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onPress: PropTypes.func
};
Checkbox.defaultProps = {
    enabled: true
};

export default Checkbox;
