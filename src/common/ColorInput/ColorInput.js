const React = require('react');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const Button = require('stremio/common/Button');
const useBinaryState = require('stremio/common/useBinaryState');
const ColorPicker = require('./ColorPicker');
const styles = require('./styles');

const ColorInput = ({ value, onChange, ...props }) => {
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const [tempValue, setTempValue] = React.useState(value);
    React.useEffect(() => {
        setTempValue(value);
    }, [value, modalOpen]);
    const modalContainerOnMouseDown = React.useCallback((event) => {
        if (!event.nativeEvent.closeModalPrevented) {
            closeModal();
        }
    }, []);
    const modalContentOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.closeModalPrevented = true;
    }, []);
    const submitButtonOnClick = React.useCallback((event) => {
        if (typeof onChange === 'function') {
            onChange(event);
        }

        if (!event.nativeEvent.closeModalPrevented) {
            closeModal();
        }
    }, [onChange]);
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
                            <ColorPicker className={styles['color-picker']} value={tempValue} onChange={setTempValue} />
                            <Button className={styles['submit-button-container']} title={'Submit'} data-value={tempValue} onClick={submitButtonOnClick}>
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
