const React = require('react');
const classnames = require('classnames');
const { useFocusable } = require('stremio-router');
const styles = require('./styles');

const Button = React.forwardRef(({ children, ...props }, ref) => {
    const focusable = useFocusable();
    const onKeyUp = React.useCallback((event) => {
        if (typeof props.onKeyUp === 'function') {
            props.onKeyUp(event);
        }

        if (event.key === 'Enter' && !event.nativeEvent.clickPrevented) {
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
        typeof props.href === 'string' && props.href.length > 0 ? 'a' : 'div',
        {
            tabIndex: focusable && !props.disabled ? 0 : -1,
            ...props,
            ref,
            className: classnames(props.className, styles['button-container'], { 'disabled': props.disabled }),
            onKeyUp,
            onMouseDown
        },
        children
    );
});

Button.displayName = 'Button';

module.exports = Button;
