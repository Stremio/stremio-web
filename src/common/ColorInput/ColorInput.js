// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const AColorPicker = require('a-color-picker');
const { useTranslation } = require('react-i18next');
const Button = require('stremio/common/Button');
const ModalDialog = require('stremio/common/ModalDialog');
const useBinaryState = require('stremio/common/useBinaryState');
const ColorPicker = require('./ColorPicker');
const styles = require('./styles');

const parseColor = (value) => {
    const color = AColorPicker.parseColor(value, 'hexcss4');
    return typeof color === 'string' ? color : '#ffffffff';
};

const ColorInput = ({ className, value, dataset, onChange, ...props }) => {
    const { t } = useTranslation();
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const [tempValue, setTempValue] = React.useState(() => {
        return parseColor(value);
    });
    const labelButtonStyle = React.useMemo(() => ({
        backgroundColor: value
    }), [value]);
    const isTransparent = React.useMemo(() => {
        return parseColor(value).endsWith('00');
    }, [value]);
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
                    'data-autofocus': true,
                    onClick: selectButtonOnClick
                }
            }
        ];
    }, [tempValue, dataset, onChange]);
    const colorPickerOnInput = React.useCallback((event) => {
        setTempValue(parseColor(event.value));
    }, []);
    React.useLayoutEffect(() => {
        setTempValue(parseColor(value));
    }, [value, modalOpen]);
    return (
        <Button title={isTransparent ? t('BUTTON_COLOR_TRANSPARENT') : value} {...props} style={labelButtonStyle} className={classnames(className, styles['color-input-container'])} onClick={labelButtonOnClick}>
            {
                isTransparent ?
                    <div className={styles['transparent-label-container']}>
                        <div className={styles['transparent-label']}>{ t('BUTTON_COLOR_TRANSPARENT') }</div>
                    </div>
                    :
                    null
            }
            {
                modalOpen ?
                    <ModalDialog title={'Choose a color:'} buttons={modalButtons} onCloseRequest={closeModal} onClick={modalDialogOnClick}>
                        <ColorPicker className={styles['color-picker-container']} value={tempValue} onInput={colorPickerOnInput} />
                    </ModalDialog>
                    :
                    null
            }
        </Button>
    );
};

ColorInput.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    dataset: PropTypes.object,
    onChange: PropTypes.func,
    onClick: PropTypes.func
};

module.exports = ColorInput;
