import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { withFocusable } from 'stremio-common';
import styles from './styles';

class Checkbox extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.focusable !== this.props.focusable ||
            nextProps.checked !== this.props.checked ||
            nextProps.disabled !== this.props.disabled ||
            nextProps.className !== this.props.className;
    }

    onClick = (event) => {
        event.preventDefault();
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }
    }

    render() {
        return (
            <div className={classnames(this.props.className, styles['checkbox-container'], { 'checked': this.props.checked }, { 'disabled': this.props.disabled })}>
                <Icon
                    className={styles['icon']}
                    icon={this.props.checked ? 'ic_check' : 'ic_box_empty'}
                />
                <input
                    ref={this.props.forwardedRef}
                    className={styles['native-checkbox']}
                    type={'checkbox'}
                    tabIndex={this.props.focusable ? 0 : -1}
                    disabled={this.props.disabled}
                    defaultChecked={this.props.checked}
                    onClick={this.onClick}
                />
            </div>
        );
    }
}

Checkbox.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func
};

Checkbox.defaultProps = {
    disabled: false,
    checked: false
};

const CheckboxWithFocusable = withFocusable(Checkbox);

CheckboxWithFocusable.displayName = 'CheckboxWithFocusable';

const CheckboxWithForwardedRef = React.forwardRef((props, ref) => (
    <CheckboxWithFocusable {...props} forwardedRef={ref} />
));

CheckboxWithForwardedRef.displayName = 'CheckboxWithForwardedRef';

export default CheckboxWithForwardedRef;
