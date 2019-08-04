const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useFocusable } = require('stremio-navigation');

const ENTER_KEY_CODE = 13;

const Input = React.forwardRef((props, ref) => {
    const focusable = useFocusable();
    const onKeyUp = React.useCallback((event) => {
        if (typeof props.onKeyUp === 'function') {
            props.onKeyUp(event);
        }

        if (event.keyCode === ENTER_KEY_CODE && !event.nativeEvent.submitPrevented && typeof props.onSubmit === 'function') {
            props.onSubmit(event);
        }
    }, [props.onKeyUp, props.onSubmit]);
    return (
        <input
            {...props}
            ref={ref}
            className={classnames(props.className, { 'disabled': props.disabled })}
            tabIndex={(props.tabIndex === null || isNaN(props.tabIndex)) ? (focusable ? 0 : -1) : props.tabIndex}
            onKeyUp={onKeyUp}
        />
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
    onKeyUp: PropTypes.func,
    onSubmit: PropTypes.func
};

module.exports = Input;
