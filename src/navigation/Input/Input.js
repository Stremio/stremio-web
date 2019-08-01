const React = require('react');
const PropTypes = require('prop-types');
const { useFocusable } = require('../FocusableContext');

const ENTER_KEY_CODE = 13;
const BUTTON_INPUT_TYPES = ['button', 'link', 'checkbox'];
const TEXT_INPUT_TYPES = ['text', 'email', 'password'];
const TAG_NAMES_FOR_TYPE = {
    button: 'div',
    link: 'a',
    checkbox: 'input',
    text: 'input',
    email: 'input',
    password: 'input'
};

const Input = React.forwardRef(({ type, tabIndex, children, ...props }, ref) => {
    const focusable = useFocusable();
    const onKeyUp = React.useCallback((event) => {
        if (typeof props.onKeyUp === 'function') {
            props.onKeyUp(event);
        }

        if (!event.nativeEvent.submitPrevented && event.keyCode === ENTER_KEY_CODE) {
            if (BUTTON_INPUT_TYPES.includes(type)) {
                event.currentTarget.click();
            } else if (TEXT_INPUT_TYPES.includes(type)) {
                if (typeof props.onSubmit === 'function') {
                    props.onSubmit(event);
                }
            }
        }
    }, [props.onKeyUp, props.onSubmit, type]);
    const onMouseDown = React.useCallback((event) => {
        if (typeof props.onMouseDown === 'function') {
            props.onMouseDown(event);
        }

        if (!event.nativeEvent.blurPrevented && BUTTON_INPUT_TYPES.includes(type)) {
            event.preventDefault();
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    }, [props.onMouseDown, type]);
    const tagName = TAG_NAMES_FOR_TYPE[type];
    const elementProps = {
        ...props,
        ref,
        type: tagName === 'input' ? type : null,
        tabIndex: (isNaN(tabIndex) || tabIndex === null) ? (focusable ? 0 : -1) : tabIndex,
        onKeyUp,
        onMouseDown
    };
    return React.createElement(tagName, elementProps, children);
});

Input.displayName = 'Input';

Input.propTypes = {
    type: PropTypes.oneOf([
        ...BUTTON_INPUT_TYPES,
        ...TEXT_INPUT_TYPES
    ]).isRequired,
    tabIndex: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Input;
