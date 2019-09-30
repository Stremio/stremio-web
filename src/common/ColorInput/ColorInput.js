const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');
const { Modal } = require('stremio-router');
const Button = require('stremio/common/Button');
const ColorPicker = require('stremio/common/ColorPicker');
const useBinaryState = require('stremio/common/useBinaryState');
const Icon = require('stremio-icons/dom/Icon');
const styles = require('./styles');

const ColorInput = ({ className, value, onChange }) => {
    const [colorInputVisible, showColorInput, closeColorInput] = useBinaryState(false);
    const [selectedColor, setSelectedColor] = React.useState(value);

    const confirmColorInput = React.useCallback(() => {
        if(typeof onChange === "function") {
            onChange(selectedColor);
        }
        closeColorInput();
    }, [selectedColor, onChange]);

    React.useEffect(() => {
        setSelectedColor(value);
    }, [value, colorInputVisible]);

    const modalBackgroundOnClick = React.useCallback((event) => {
        if(event.target === event.currentTarget) {
            closeColorInput();
        }
    }, []);

    return (
        <React.Fragment>
            <Button className={className} title={selectedColor} onClick={showColorInput} style={{ backgroundColor: value }}></Button>
            {
                colorInputVisible
                    ?
                    <Modal className={styles['color-input-modal']} onMouseDown={modalBackgroundOnClick}>
                        <div className={styles['color-input-container']}>
                            <Button onClick={closeColorInput}>
                                <Icon className={classnames(styles['x-icon'])} icon={'ic_x'} />
                            </Button>
                            <h1>Choose a color:</h1>
                            <ColorPicker className={classnames(styles['color-input'])} value={selectedColor} onChange={setSelectedColor} />
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
    value: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;
