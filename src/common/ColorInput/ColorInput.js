const React = require('react');
const PropTypes = require('prop-types');
const AColorPicker = require('a-color-picker');
const Button = require('stremio/common/Button');
const useBinaryState = require('stremio/common/useBinaryState');
const ModalDialog = require('stremio/common/ModalDialog');
const ColorPicker = require('./ColorPicker');

const COLOR_FORMAT = 'hexcss4';

const ColorInput = ({ className, value, dataset, onChange }) => {
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const [tempValue, setTempValue] = React.useState(() => {
        return AColorPicker.parseColor(value, COLOR_FORMAT);
    });
    const colorPickerOnInput = React.useCallback((event) => {
        setTempValue(event.value);
    }, []);
    const selectButtonOnClick = React.useCallback((event) => {
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
    }, [tempValue, dataset, onChange]);
    const buttonStyle = React.useMemo(() => ({
        backgroundColor: value
    }), [value]);
    const modalButtons = React.useMemo(() => ([
        {
            label: 'Select',
            props: {
                onClick: selectButtonOnClick,
                'data-autofocus': true
            }
        }
    ]), [selectButtonOnClick]);
    React.useEffect(() => {
        setTempValue(AColorPicker.parseColor(value, COLOR_FORMAT));
    }, [value, modalOpen]);
    return (
        <React.Fragment>
            <Button title={value} style={buttonStyle} className={className} onClick={openModal} />
            {
                modalOpen ?
                    <ModalDialog title={'Choose a color:'} buttons={modalButtons} onCloseRequest={closeModal}>
                        <ColorPicker value={tempValue} onInput={colorPickerOnInput} />
                    </ModalDialog>
                    :
                    null
            }
        </React.Fragment>
    );
};

ColorInput.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    dataset: PropTypes.objectOf(String),
    onChange: PropTypes.func
};

module.exports = ColorInput;
