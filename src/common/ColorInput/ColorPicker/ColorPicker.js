const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const AColorPicker = require('a-color-picker');
const styles = require('./styles');

const COLOR_FORMAT = 'hexcss4';

// TODO implement custom picker which is keyboard accessible
const ColorPicker = ({ className, value, onInput }) => {
    const pickerRef = React.useRef(null);
    const pickerElementRef = React.useRef(null);
    React.useEffect(() => {
        pickerRef.current = AColorPicker.createPicker(pickerElementRef.current, {
            color: AColorPicker.parseColor(value, COLOR_FORMAT),
            showHSL: false,
            showHEX: false,
            showRGB: false,
            showAlpha: true
        });
        const clipboardPicker = pickerElementRef.current.querySelector('.a-color-picker-clipbaord');
        if (clipboardPicker instanceof HTMLElement) {
            clipboardPicker.tabIndex = -1;
        }
    }, []);
    React.useEffect(() => {
        pickerRef.current.on('change', (picker, value) => {
            if (typeof onInput === 'function') {
                onInput({
                    type: 'input',
                    value: AColorPicker.parseColor(value, COLOR_FORMAT)
                });
            }
        });
        return () => {
            pickerRef.current.off('change');
        };
    }, [onInput]);
    React.useEffect(() => {
        const nextValue = AColorPicker.parseColor(value, COLOR_FORMAT);
        if (AColorPicker.parseColor(pickerRef.current.color, COLOR_FORMAT) !== nextValue) {
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
