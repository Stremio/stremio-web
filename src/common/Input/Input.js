import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withFocusable } from 'stremio-common';

const ENTER_KEY_CODE = 13;
const BUTTON_INPUT_TYPES = ['button', 'submit', 'link', 'checkbox'];
const TEXT_INPUT_TYPES = ['text', 'password', 'email'];

class Input extends PureComponent {
    onClick = (event) => {
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }

        if (this.props.type === 'checkbox') {
            event.preventDefault();
        }
    }

    onKeyUp = (event) => {
        if (typeof this.props.onKeyUp === 'function') {
            this.props.onKeyUp(event);
        }

        if (!event.defaultPrevented && BUTTON_INPUT_TYPES.includes(this.props.type) && event.which === ENTER_KEY_CODE) {
            event.currentTarget.click();
        }
    }

    onDrag = (event) => {
        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(event);
        }

        if (!event.defaultPrevented && BUTTON_INPUT_TYPES.includes(this.props.type)) {
            event.currentTarget.blur();
        }
    }

    onMouseOut = (event) => {
        if (typeof this.props.onMouseOut === 'function') {
            this.props.onMouseOut(event);
        }

        if (!event.defaultPrevented && BUTTON_INPUT_TYPES.includes(this.props.type)) {
            event.currentTarget.blur();
        }
    }

    render() {
        const { forwardedRef, focusable, type, ...props } = this.props;

        if (type === 'button') {
            return (
                <div
                    {...props}
                    ref={forwardedRef}
                    tabIndex={focusable ? 0 : -1}
                    onKeyUp={this.onKeyUp}
                    onDrag={this.onDrag}
                    onMouseOut={this.onMouseOut}
                />
            );
        }

        if (type === 'link') {
            return (
                <a
                    {...props}
                    ref={forwardedRef}
                    tabIndex={focusable ? 0 : -1}
                    onKeyUp={this.onKeyUp}
                    onDrag={this.onDrag}
                    onMouseOut={this.onMouseOut}
                />
            );
        }

        return (
            <input
                {...props}
                ref={forwardedRef}
                tabIndex={focusable ? 0 : -1}
                type={type}
                onKeyUp={this.onKeyUp}
                onDrag={this.onDrag}
                onMouseOut={this.onMouseOut}
            />
        );
    }
}

Input.propTypes = {
    type: PropTypes.oneOf([...BUTTON_INPUT_TYPES, ...TEXT_INPUT_TYPES]).isRequired,
    focusable: PropTypes.bool.isRequired
};
Input.defaultProps = {
    focusable: false
};

const InputWithFocusable = withFocusable(Input);

InputWithFocusable.displayName = 'InputWithFocusable';

const InputWithForwardedRef = React.forwardRef((props, ref) => (
    <InputWithFocusable {...props} forwardedRef={ref} />
));

InputWithForwardedRef.displayName = 'InputWithForwardedRef';

export default InputWithForwardedRef;
