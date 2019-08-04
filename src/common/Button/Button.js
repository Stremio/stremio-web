const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useFocusable } = require('stremio-navigation');

const ENTER_KEY_CODE = 13;

const Button = React.forwardRef(({ children, ...props }, ref) => {
    const focusable = useFocusable();
    const onKeyUp = React.useCallback((event) => {
        if (typeof props.onKeyUp === 'function') {
            props.onKeyUp(event);
        }

        if (event.keyCode === ENTER_KEY_CODE && !event.nativeEvent.clickPrevented) {
            event.currentTarget.click();
        }
    }, [props.onKeyUp]);
    const onMouseDown = React.useCallback((event) => {
        if (typeof props.onMouseDown === 'function') {
            props.onMouseDown(event);
        }

        if (!event.nativeEvent.blurPrevented) {
            event.preventDefault();
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    }, [props.onMouseDown]);
    return React.createElement(
        typeof props.href === 'string' ? 'a' : 'div',
        {
            ...props,
            ref,
            className: classnames(props.className, { 'focusable': focusable }, { 'disabled': props.disabled }),
            tabIndex: (props.tabIndex === null || isNaN(props.tabIndex)) ?
                (focusable ? 0 : -1)
                :
                props.tabIndex,
            onKeyUp,
            onMouseDown
        },
        children
    );
});

Button.displayName = 'Button';

Button.propTypes = {
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    href: PropTypes.string,
    disabled: PropTypes.bool,
    onKeyUp: PropTypes.func,
    onMouseDown: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Button;
