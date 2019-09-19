const React = require('react');
const classnames = require('classnames');
const { useFocusable } = require('stremio-router');
const styles = require('./styles');

const TextInput = React.forwardRef((props, ref) => {
    const focusable = useFocusable();
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
            size={1}
            autoCorrect={'off'}
            autoCapitalize={'off'}
            autoComplete={'off'}
            spellCheck={false}
            tabIndex={focusable && !props.disabled ? 0 : -1}
            {...props}
            ref={ref}
            className={classnames(props.className, styles['text-input-container'], { 'disabled': props.disabled })}
            onKeyUp={onKeyUp}
        />
    );
});

TextInput.displayName = 'TextInput';

module.exports = TextInput;
