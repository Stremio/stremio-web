import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withFocusable } from 'stremio-common';

const ENTER_KEY_CODE = 13;
const BUTTON_INPUT_TYPES = ['button', 'link', 'submit', 'checkbox'];
const TEXT_INPUT_TYPES = ['text', 'password', 'email', 'search'];
const TAG_NAMES_FOR_TYPE = {
    button: 'div',
    link: 'a',
    submit: 'input',
    checkbox: 'input',
    text: 'input',
    password: 'input',
    email: 'input',
    search: 'input'
};

class Input extends PureComponent {
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
        const { forwardedRef, focusable, type, children, ...props } = this.props;
        const tagName = TAG_NAMES_FOR_TYPE[type];
        const elementProps = {
            ...props,
            ref: forwardedRef,
            type: tagName === 'input' ? type : null,
            tabIndex: focusable ? 0 : -1,
            onKeyUp: this.onKeyUp,
            onDrag: this.onDrag,
            onMouseOut: this.onMouseOut
        };
        return React.createElement(tagName, elementProps, children);
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
