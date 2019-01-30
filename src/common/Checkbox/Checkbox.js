import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Input } from 'stremio-common';
import styles from './styles';

class Checkbox extends PureComponent {
    onClick = (event) => {
        event.preventDefault();
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }
    }

    onDrag = (event) => {
        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(event);
        }

        if (!event.defaultPrevented) {
            this.props.forwardedRef.current.blur();
        }
    }

    onMouseOut = (event) => {
        if (typeof this.props.onMouseOut === 'function') {
            this.props.onMouseOut(event);
        }

        if (!event.defaultPrevented) {
            this.props.forwardedRef.current.blur();
        }
    }

    render() {
        return (
            <label className={classnames(this.props.className, styles['checkbox-container'], { 'checked': this.props.checked }, { 'disabled': this.props.disabled })} onClick={this.onClick} onDrag={this.onDrag} onMouseOut={this.onMouseOut}>
                <Input
                    ref={this.props.forwardedRef}
                    className={styles['native-checkbox']}
                    type={'checkbox'}
                    disabled={this.props.disabled}
                    defaultChecked={this.props.checked}
                />
                <div className={styles['icon-container']}>
                    <Icon className={styles['icon']} icon={this.props.checked ? 'ic_check' : 'ic_box_empty'} />
                </div>
                {React.Children.only(this.props.children)}
            </label>
        );
    }
}

Checkbox.propTypes = {
    disabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired
};

Checkbox.defaultProps = {
    disabled: false,
    checked: false
};

const CheckboxWithForwardedRef = React.forwardRef((props, ref) => (
    <Checkbox {...props} forwardedRef={ref} />
));

CheckboxWithForwardedRef.displayName = 'CheckboxWithForwardedRef';

export default CheckboxWithForwardedRef;
