const React = require('react');
const PropTypes = require('prop-types');
const AColorPicker = require('a-color-picker');

const COLOR_FORMAT = 'rgbacss';

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
        pickerRef.current.off('change');
        pickerRef.current.on('change', (picker, color) => {
            if (typeof onChange === 'function') {
                onChange(AColorPicker.parseColor(color, COLOR_FORMAT));
            }
        });
    }, [onChange]);
    React.useEffect(() => {
        if (AColorPicker.parseColor(pickerRef.current.color, COLOR_FORMAT) !== value) {
            pickerRef.current.color = value;
        }
    }, [value]);
    return (
        <div ref={pickerElementRef} className={className} />
    );
};

ColorPicker.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorPicker;
