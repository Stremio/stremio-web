const React = require('react');
const classnames = require('classnames');
const styles = require('./styles');

const Button = React.forwardRef(({ className, href, disabled, children, ...props }, ref) => {
    const onKeyDown = React.useCallback((event) => {
        if (typeof props.onKeyDown === 'function') {
            props.onKeyDown(event);
        }

        if (event.key === 'Enter' && !event.nativeEvent.buttonClickPrevented) {
            event.currentTarget.click();
        }
    }, [props.onKeyDown]);
    const onMouseDown = React.useCallback((event) => {
        if (typeof props.onMouseDown === 'function') {
            props.onMouseDown(event);
        }

        if (!event.nativeEvent.buttonBlurPrevented) {
            event.preventDefault();
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    }, [props.onMouseDown]);
    return React.createElement(
        typeof href === 'string' && href.length > 0 ? 'a' : 'div',
        {
            tabIndex: 0,
            ...props,
            ref,
            className: classnames(className, styles['button-container'], { 'disabled': disabled }),
            href,
            onKeyDown,
            onMouseDown
        },
        children
    );
});

Button.displayName = 'Button';

module.exports = Button;
