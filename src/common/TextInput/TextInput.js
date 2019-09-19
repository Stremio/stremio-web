const React = require('react');
const classnames = require('classnames');
const useTabIndex = require('stremio/common/useTabIndex');
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
            size={1}
            autoCorrect={'off'}
            autoCapitalize={'off'}
            autoComplete={'off'}
            spellCheck={false}
            {...props}
            ref={ref}
            className={classnames(props.className, styles['text-input-container'], { 'disabled': props.disabled })}
            tabIndex={tabIndex}
            onKeyUp={onKeyUp}
        />
    );
});

TextInput.displayName = 'TextInput';

module.exports = TextInput;
