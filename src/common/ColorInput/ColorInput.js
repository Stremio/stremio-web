const React = require('react');
const PropTypes = require('prop-types');
const AColorPicker = require('a-color-picker');
const Button = require('stremio/common/Button');
const useBinaryState = require('stremio/common/useBinaryState');
const ModalDialog = require('stremio/common/ModalDialog');
const useDataset = require('stremio/common/useDataset');
const ColorPicker = require('./ColorPicker');

const COLOR_FORMAT = 'hexcss4';

const ColorInput = ({ className, value, onChange, ...props }) => {
    value = AColorPicker.parseColor(value, COLOR_FORMAT);
    const dataset = useDataset(props);
    const [modalOpen, setModalOpen, setModalClosed] = useBinaryState(false);
    const [tempValue, setTempValue] = React.useState(value);
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
        setModalClosed();
    }, [onChange, tempValue, dataset]);
    React.useEffect(() => {
        setTempValue(value);
    }, [value, modalOpen]);
    return (
        <React.Fragment>
            <Button title={value} {...props} style={{ ...props.style, backgroundColor: value }} className={className} onClick={setModalOpen} />
            {
                modalOpen ?
                    <ModalDialog title={'Choose a color:'} buttons={[{ label: 'Select', props: { onClick: submitButtonOnClick, 'data-autofocus': true } }]} onCloseRequest={setModalClosed}>
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
    onChange: PropTypes.func
};

module.exports = ColorInput;
