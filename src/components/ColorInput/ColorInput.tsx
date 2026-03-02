// Copyright (C) 2017-2023 Smart code 203358507

import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import * as AColorPicker from 'a-color-picker';
import { useTranslation } from 'react-i18next';
import { Button } from 'stremio/components';
import ModalDialog from 'stremio/components/ModalDialog';
import useBinaryState from 'stremio/common/useBinaryState';
import ColorPicker from './ColorPicker';
import styles from './ColorInput.less';

const parseColor = (value: string) => {
    const color = AColorPicker.parseColor(value, 'hexcss4');
    return typeof color === 'string' ? color : '#ffffffff';
};

type Props = {
    className: string,
    value: string,
    onChange?: (value: string) => void,
    onClick?: (event: React.MouseEvent) => void,
};

const ColorInput = ({ className, value, onChange, ...props }: Props) => {
    const { t } = useTranslation();
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const [tempValue, setTempValue] = useState(() => {
        return parseColor(value);
    });

    const labelButtonStyle = useMemo(() => ({
        backgroundColor: value
    }), [value]);

    const isTransparent = useMemo(() => {
        return parseColor(value).endsWith('00');
    }, [value]);

    const labelButtonOnClick = useCallback((event: React.MouseEvent) => {
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }

        // @ts-expect-error: Property 'openModalPrevented' does not exist on type 'MouseEvent'.
        if (!event.nativeEvent.openModalPrevented) {
            openModal();
        }
    }, [props.onClick]);

    const modalDialogOnClick = useCallback((event: React.MouseEvent) => {
        // @ts-expect-error: Property 'openModalPrevented' does not exist on type 'MouseEvent'.
        event.nativeEvent.openModalPrevented = true;
    }, []);

    const modalButtons = useMemo(() => {
        const selectButtonOnClick = () => {
            if (typeof onChange === 'function') {
                onChange(tempValue);
            }

            closeModal();
        };
        return [
            {
                label: t('SELECT'),
                props: {
                    'data-autofocus': true,
                    onClick: selectButtonOnClick
                }
            }
        ];
    }, [tempValue, onChange]);

    const colorPickerOnInput = useCallback((color: string) => {
        setTempValue(parseColor(color));
    }, []);

    useLayoutEffect(() => {
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
                    <ModalDialog title={t('CHOOSE_COLOR')} buttons={modalButtons} onCloseRequest={closeModal} onClick={modalDialogOnClick}>
                        <ColorPicker className={styles['color-picker-container']} value={tempValue} onInput={colorPickerOnInput} />
                    </ModalDialog>
                    :
                    null
            }
        </Button>
    );
};

export default ColorInput;
