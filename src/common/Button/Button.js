const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const useTabIndex = require('../useTabIndex');
const styles = require('./styles');

const Button = React.forwardRef(({ children, ...props }, ref) => {
    const tabIndex = useTabIndex(props.tabIndex, props.disabled);
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
        typeof props.href === 'string' ? 'a' : 'div',
        {
            ...props,
            ref,
            className: classnames(props.className, styles['button-container'], { 'disabled': props.disabled }),
            tabIndex,
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
