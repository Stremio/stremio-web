// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const AColorPicker = require('a-color-picker');
const styles = require('./styles');

const parseColor = (value) => {
    return AColorPicker.parseColor(value, 'hexcss4');
};

const ColorPicker = ({ className, value, onInput }) => {
    const pickerRef = React.useRef(null);
    const pickerElementRef = React.useRef(null);
    React.useLayoutEffect(() => {
        pickerRef.current = AColorPicker.createPicker(pickerElementRef.current, {
            color: parseColor(value),
            showHSL: false,
            showHEX: false,
            showRGB: false,
            showAlpha: true
        });
        const pickerClipboard = pickerElementRef.current.querySelector('.a-color-picker-clipbaord');
        if (pickerClipboard instanceof HTMLElement) {
            pickerClipboard.tabIndex = -1;
        }
    }, []);
    React.useLayoutEffect(() => {
        if (typeof onInput === 'function') {
            pickerRef.current.on('change', (picker, value) => {
                onInput({
                    type: 'input',
                    value: parseColor(value)
                });
            });
        }
        return () => {
            pickerRef.current.off('change');
        };
    }, [onInput]);
    React.useLayoutEffect(() => {
        const nextValue = parseColor(value);
        if (nextValue !== parseColor(pickerRef.current.color)) {
            pickerRef.current.color = nextValue;
        }
    }, [value]);
    return (
        <div ref={pickerElementRef} className={classnames(className, styles['color-picker-container'])} />
    );
};

ColorPicker.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onInput: PropTypes.func
};

module.exports = ColorPicker;
