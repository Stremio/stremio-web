const React = require('react');
const PropTypes = require('prop-types');
const { SketchPicker } = require('react-color');

class ColorPicker extends React.Component {
    onContainerClicked = (e) => {
        e.stopPropagation();
    }

    onColorChanged = (color) => {
        const value = '#' + `0${color.rgb.r.toString(16)}`.slice(-2) +
            `0${color.rgb.g.toString(16)}`.slice(-2) +
            `0${color.rgb.b.toString(16)}`.slice(-2) +
            `0${Math.round(color.rgb.a * 255).toString(16)}`.slice(-2);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <div className={this.props.className} onClick={this.onContainerClicked}>
                <SketchPicker
                    width={''}
                    color={this.props.value}
                    presetColors={[]}
                    onChangeComplete={this.onColorChanged}
                />
            </div>
        );
    }
}

ColorPicker.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
};

module.exports = ColorPicker;
