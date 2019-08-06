const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const useTabIndex = require('../useTabIndex');
const styles = require('./styles');

const TextInput = React.forwardRef((props, ref) => {
    const tabIndex = useTabIndex(props.tabIndex, props.disabled);
    const onKeyUp = React.useCallback((event) => {
        if (typeof props.onKeyUp === 'function') {
            props.onKeyUp(event);
        }

        if (event.key === 'Enter' && !event.nativeEvent.submitPrevented && typeof props.onSubmit === 'function') {
            props.onSubmit(event);
        }
    }, [props.onKeyUp, props.onSubmit]);
    return (
        <input
            {...props}
            ref={ref}
            className={classnames(props.className, styles['text-input-container'], { 'disabled': props.disabled })}
            tabIndex={tabIndex}
            onKeyUp={onKeyUp}
        />
    );
});

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
    onKeyUp: PropTypes.func,
    onSubmit: PropTypes.func
};

module.exports = TextInput;
