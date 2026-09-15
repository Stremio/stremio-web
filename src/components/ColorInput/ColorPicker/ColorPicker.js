// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const AColorPicker = require('a-color-picker');
const useLiveRef = require('stremio/common/useLiveRef');
const styles = require('./styles');

const parseColor = (value) => {
    return AColorPicker.parseColor(value, 'hexcss4');
};

const ColorPicker = ({ className, value, onInput }) => {
    const pickerRef = React.useRef(null);
    const pickerElementRef = React.useRef(null);
    const onInputRef = useLiveRef(onInput);
    React.useLayoutEffect(() => {
        const picker = AColorPicker.createPicker(pickerElementRef.current, {
            color: parseColor(value),
            showHSL: false,
            showHEX: false,
            showRGB: false,
            showAlpha: true
        });
        pickerRef.current = picker;
        picker.on('change', (picker, value) => {
            if (typeof onInputRef.current === 'function') {
                onInputRef.current(parseColor(value));
            }
        });
        const pickerClipboard = pickerElementRef.current.querySelector('.a-color-picker-clipboard');
        if (pickerClipboard instanceof HTMLElement) {
            pickerClipboard.tabIndex = -1;
        }
        return () => {
            picker.off('change');
            picker.destroy();
            pickerRef.current = null;
        };
    }, []);
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
