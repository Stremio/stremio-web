const React = require('react');
const PropTypes = require('prop-types');
const { Modal } = require('stremio-router');
const Button = require('stremio/common/Button');
const ColorPicker = require('stremio/common/ColorPicker');
const useBinaryState = require('stremio/common/useBinaryState');
const Icon = require('stremio-icons/dom');
const styles = require('./styles');

const ColorInput = ({ className, id, value, onChange }) => {
    const [colorInputVisible, showColorInput, closeColorInput] = useBinaryState(false);
    const [selectedColor, setSelectedColor] = React.useState(value);

    const confirmColorInput = React.useCallback((event) => {
        if(typeof onChange === "function") {
            event.nativeEvent.value = selectedColor;
            onChange(event);
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
                                <Icon className={styles['x-icon']} icon={'ic_x'} />
                            </Button>
                            <h1>Choose a color:</h1>
                            <ColorPicker className={styles['color-input']} value={selectedColor} onChange={setSelectedColor} />
                            <Button className={styles['button']} data-id={id} onClick={confirmColorInput}>Select</Button>
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
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;
