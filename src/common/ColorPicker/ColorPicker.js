const React = require('react');
const PropTypes = require('prop-types');

const ColorPicker = ({ className, value, onChange }) => {
    return (
        <div style={{ backgroundColor: 'red' }} className={className}>
            {value}
        </div>
    );
};

ColorPicker.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func
};

module.exports = ColorPicker;
