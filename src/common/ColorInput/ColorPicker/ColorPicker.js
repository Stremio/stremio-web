const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const AColorPicker = require('a-color-picker');
const styles = require('./styles');

const COLOR_FORMAT = 'hexcss4';

// TODO implement custom picker which is keyboard accessible
const ColorPicker = ({ className, value, onChange }) => {
    value = AColorPicker.parseColor(value, COLOR_FORMAT);
    const pickerRef = React.useRef(null);
    const pickerElementRef = React.useRef(null);
    React.useEffect(() => {
        pickerRef.current = AColorPicker.createPicker(pickerElementRef.current, {
            color: value,
            showHSL: false,
            showHEX: false,
            showRGB: false,
            showAlpha: true
        });
    }, []);
    React.useEffect(() => {
        pickerRef.current.on('change', (picker, color) => {
            if (typeof onChange === 'function') {
                onChange(AColorPicker.parseColor(color, COLOR_FORMAT));
            }
        });
        return () => {
            pickerRef.current.off('change');
        };
    }, [onChange]);
    React.useEffect(() => {
        if (AColorPicker.parseColor(pickerRef.current.color, COLOR_FORMAT) !== value) {
            pickerRef.current.color = value;
        }
    }, [value]);
    return (
        <div ref={pickerElementRef} className={classnames(className, styles['color-picker-container'])} />
    );
};

ColorPicker.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorPicker;
