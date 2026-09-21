// Copyright (C) 2017-2023 Smart code 203358507

import React, { useCallback, useMemo, useState } from 'react';
import classnames from 'classnames';
import { HexAlphaColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';
import { Button } from 'stremio/components';
import ModalDialog from 'stremio/components/ModalDialog';
import useBinaryState from 'stremio/common/useBinaryState';
import styles from './ColorInput.less';

type Props = {
    className: string,
    value: string,
    onChange?: (value: string) => void,
    onClick?: (event: React.MouseEvent) => void,
};

type DialogProps = {
    value: string,
    onChange?: (value: string) => void,
    onClose: () => void,
};

const ColorInputDialog = ({ value, onChange, onClose }: DialogProps) => {
    const { t } = useTranslation();
    const [tempValue, setTempValue] = useState(value);

    const modalDialogOnClick = useCallback((event: React.MouseEvent) => {
        // @ts-expect-error: Property 'openModalPrevented' does not exist on type 'MouseEvent'.
        event.nativeEvent.openModalPrevented = true;
    }, []);

    const modalButtons = useMemo(() => {
        const selectButtonOnClick = () => {
            if (typeof onChange === 'function') {
                onChange(tempValue);
            }

            onClose();
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

    return (
        <ModalDialog title={t('CHOOSE_COLOR')} buttons={modalButtons} onCloseRequest={onClose} onClick={modalDialogOnClick}>
            <HexAlphaColorPicker color={value} onChangeEnd={setTempValue} />
        </ModalDialog>
    );
};

const ColorInput = ({ className, value, onChange, ...props }: Props) => {
    const { t } = useTranslation();
    const [modalOpen, openModal, closeModal] = useBinaryState(false);

    const labelButtonStyle = useMemo(() => ({
        backgroundColor: value
    }), [value]);

    const isTransparent = useMemo(() => {
        const hex = value.replace('#', '');
        return hex.length === 8 && hex.endsWith('00');
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
                    <ColorInputDialog key={value} value={value} onChange={onChange} onClose={closeModal} />
                    :
                    null
            }
        </Button>
    );
};

export default ColorInput;
