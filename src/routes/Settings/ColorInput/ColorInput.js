const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');
const { Modal } = require('stremio-router');
const Button = require('stremio/common/Button');
const ColorPicker = require('stremio/common/ColorPicker');
const useBinaryState = require('stremio/common/useBinaryState');
const Icon = require('stremio-icons/dom/Icon');
const styles = require('./styles');

const ColorInput = ({ className, defaultValue, onChange }) => {
    const colorInputRef = React.useRef(null);
    const [colorInputVisible, showColorInput, closeColorInput] = useBinaryState(false);
    const [color, setColor] = React.useState(defaultValue);
    const [selectedColor, setSelectedColor] = React.useState(defaultValue);
    const discardColorInput = React.useCallback((event) => {
        if (event.type === "mousedown" && colorInputRef.current.contains(event.target)) {
            return;
        }
        setColor(selectedColor);
        closeColorInput();
    });
    const confirmColorInput = React.useCallback(() => {
        setSelectedColor(color);
        onChange(color);
        closeColorInput();
    }, [color, onChange]);
    return (
        <React.Fragment>
            <Button className={className} title={selectedColor} onClick={showColorInput} style={{ backgroundColor: selectedColor }}></Button>
            {
                colorInputVisible
                    ?
                    <Modal className={classnames(styles['color-input-modal'])} onMouseDown={discardColorInput}>
                        <div ref={colorInputRef} className={classnames(styles['color-input-container'])}>
                            <Button onClick={discardColorInput}>
                                <Icon className={classnames(styles['x-icon'])} icon={'ic_x'} />
                            </Button>
                            <h1>Choose a color:</h1>
                            <ColorPicker className={classnames(styles['color-input'])} value={color} onChange={setColor} />
                            <Button className={classnames(styles['button'])} onClick={confirmColorInput}>Select</Button>
                        </div>
                    </Modal>
                    :
                    null
            }
        </React.Fragment>
    );
};


ColorInput.propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;