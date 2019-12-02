const React = require('react');
const PropTypes = require('prop-types');
const AColorPicker = require('a-color-picker');
const Button = require('stremio/common/Button');
const useBinaryState = require('stremio/common/useBinaryState');
const ModalDialog = require('stremio/common/ModalDialog');
const ColorPicker = require('./ColorPicker');

const COLOR_FORMAT = 'hexcss4';

const ColorInput = ({ className, value, dataset, onChange, ...props }) => {
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const [tempValue, setTempValue] = React.useState(() => {
        return AColorPicker.parseColor(value, COLOR_FORMAT);
    });
    const labelButtonStyle = React.useMemo(() => ({
        ...props.style,
        backgroundColor: value
    }), [props.style, value]);
    const labelButtonOnClick = React.useCallback((event) => {
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }

        if (!event.nativeEvent.openModalPrevented) {
            openModal();
        }
    }, [props.onClick]);
    const modalDialogOnClick = React.useCallback((event) => {
        event.nativeEvent.openModalPrevented = true;
    }, []);
    const modalButtons = React.useMemo(() => {
        const selectButtonOnClick = (event) => {
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
        };

        return [
            {
                label: 'Select',
                props: {
                    onClick: selectButtonOnClick,
                    'data-autofocus': true
                }
            }
        ];
    }, [tempValue, dataset, onChange]);
    const colorPickerOnInput = React.useCallback((event) => {
        setTempValue(AColorPicker.parseColor(event.value, COLOR_FORMAT));
    }, []);
    React.useEffect(() => {
        setTempValue(AColorPicker.parseColor(value, COLOR_FORMAT));
    }, [value, modalOpen]);
    return (
        <Button title={value} {...props} style={labelButtonStyle} className={className} onClick={labelButtonOnClick}>
            {
                modalOpen ?
                    <ModalDialog title={'Choose a color:'} buttons={modalButtons} onCloseRequest={closeModal} onClick={modalDialogOnClick}>
                        <ColorPicker value={tempValue} onInput={colorPickerOnInput} />
                    </ModalDialog>
                    :
                    null
            }
        </Button>
    );
};

ColorInput.propTypes = {
    value: PropTypes.string,
    dataset: PropTypes.objectOf(String),
    onChange: PropTypes.func
};

module.exports = ColorInput;
