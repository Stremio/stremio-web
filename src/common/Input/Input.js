const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const useTabIndex = require('../useTabIndex');
const styles = require('./styles');

const ENTER_KEY_CODE = 13;
const ARROW_KEY_CODE = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

const Input = React.forwardRef((props, ref) => {
    const tabIndex = useTabIndex(props.tabIndex, props.disabled);
    const onKeyUp = React.useCallback((event) => {
        if (typeof props.onKeyUp === 'function') {
            props.onKeyUp(event);
        }

        if (event.keyCode === ENTER_KEY_CODE && !event.nativeEvent.submitPrevented && typeof props.onSubmit === 'function') {
            props.onSubmit(event);
        }
    }, [props.onKeyUp, props.onSubmit]);
    const onKeyDown = React.useCallback((event) => {
        if (ARROW_KEY_CODE[event.keyCode]) {
            event.stopPropagation();
            if (event.shiftKey) {
                event.preventDefault();
                window.navigate(ARROW_KEY_CODE[event.keyCode]);
            }
        }
    }, [props.onKeyDown]);
    return (
        <input
            {...props}
            ref={ref}
            className={classnames(props.className, styles['input-container'], { 'disabled': props.disabled })}
            tabIndex={tabIndex}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
        />
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    onSubmit: PropTypes.func
};

module.exports = Input;
