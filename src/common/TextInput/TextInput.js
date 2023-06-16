// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const TextInput = React.forwardRef((props, ref) => {
    const onKeyDown = React.useCallback((event) => {
        if (typeof props.onKeyDown === 'function') {
            props.onKeyDown(event);
        }

        if (event.key === 'Enter' && !event.nativeEvent.submitPrevented && typeof props.onSubmit === 'function') {
            props.onSubmit(event);
        }
    }, [props.onKeyDown, props.onSubmit]);
    return (
        <input
            size={1}
            autoCorrect={'off'}
            autoCapitalize={'off'}
            autoComplete={'off'}
            spellCheck={false}
            tabIndex={0}
            {...props}
            ref={ref}
            className={classnames(props.className, styles['text-input'], { 'disabled': props.disabled })}
            onKeyDown={onKeyDown}
        />
    );
});

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onKeyDown: PropTypes.func,
    onSubmit: PropTypes.func
};

module.exports = TextInput;
