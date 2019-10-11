const React = require('react');
const PropTypes = require('prop-types');
const AColorPicker = require('a-color-picker');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const Button = require('stremio/common/Button');
const useBinaryState = require('stremio/common/useBinaryState');
const useDataset = require('stremio/common/useDataset');
const ColorPicker = require('./ColorPicker');
const styles = require('./styles');

const COLOR_FORMAT = 'hexcss4';

const ColorInput = ({ value, onChange, ...props }) => {
    value = AColorPicker.parseColor(value, COLOR_FORMAT);
    const dataset = useDataset(props);
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const [tempValue, setTempValue] = React.useState(value);
    React.useEffect(() => {
        setTempValue(value);
    }, [value, modalOpen]);
    const colorPickerOnInput = React.useCallback((event) => {
        setTempValue(event.value);
    }, []);
    const submitButtonOnClick = React.useCallback((event) => {
        if (typeof onChange === 'function') {
            onChange({
                type: 'change',
                value: tempValue,
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }

        closeModal();
    }, [onChange, tempValue, dataset]);
    const modalContainerOnMouseDown = React.useCallback((event) => {
        if (!event.nativeEvent.closeModalPrevented) {
            closeModal();
        }
    }, []);
    const modalContentOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.closeModalPrevented = true;
    }, []);
    return (
        <React.Fragment>
            <Button
                title={value}
                {...props}
                style={{ backgroundColor: value }}
                onClick={openModal}
            />
            {
                modalOpen ?
                    <Modal className={styles['color-input-modal-container']} onMouseDown={modalContainerOnMouseDown}>
                        <div className={styles['color-input-container']} onMouseDown={modalContentOnMouseDown}>
                            <div className={styles['header-container']}>
                                <div className={styles['title']}>Choose a color:</div>
                                <Button className={styles['close-button-container']} title={'Close'} onClick={closeModal}>
                                    <Icon className={styles['icon']} icon={'ic_x'} />
                                </Button>
                            </div>
                            <ColorPicker className={styles['color-picker']} value={tempValue} onInput={colorPickerOnInput} />
                            <Button className={styles['submit-button-container']} title={'Submit'} onClick={submitButtonOnClick}>
                                <div className={styles['label']}>Select</div>
                            </Button>
                        </div>
                    </Modal>
                    :
                    null
            }
        </React.Fragment>
    );
};

ColorInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;
