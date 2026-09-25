// Copyright (C) 2017-2023 Smart code 203358507

import React, { useCallback, useMemo, useState } from 'react';
import classnames from 'classnames';
import { HexAlphaColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';
import { Button } from 'stremio/components';
import BottomSheet from 'stremio/components/BottomSheet';
import ModalDialog from 'stremio/components/ModalDialog';
import useBinaryState from 'stremio/common/useBinaryState';
import useMediaQuery from 'stremio/common/useMediaQuery';
import screenSizes from 'stremio/common/screen-sizes.less';
import styles from './ColorInput.less';

type Props = {
    className: string,
    value: string,
    onChange?: (value: string) => void,
    onClick?: (event: React.MouseEvent) => void,
};

const ColorInput = ({ className, value, onChange, onClick, ...props }: Props) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xsmall})`);
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const [tempValue, setTempValue] = useState(value);

    const labelButtonStyle = useMemo(() => ({
        backgroundColor: value
    }), [value]);

    const isTransparent = useMemo(() => {
        const hex = value.replace('#', '');
        return hex.length === 8 && hex.endsWith('00');
    }, [value]);

    const labelButtonOnClick = useCallback((event: React.MouseEvent) => {
        if (typeof onClick === 'function') {
            onClick(event);
        }

        setTempValue(value);
        openModal();
    }, [onClick, value, openModal]);

    const selectButtonOnClick = useCallback(() => {
        if (typeof onChange === 'function') {
            onChange(tempValue);
        }

        closeModal();
    }, [onChange, tempValue, closeModal]);

    const modalButtons = useMemo(() => [
        {
            label: t('SELECT'),
            props: {
                'data-autofocus': true,
                onClick: selectButtonOnClick
            }
        }
    ], [selectButtonOnClick, t]);

    const picker = (
        <HexAlphaColorPicker className={styles['color-picker']} color={tempValue} onChange={setTempValue} />
    );

    return (
        <React.Fragment>
            <Button title={isTransparent ? t('BUTTON_COLOR_TRANSPARENT') : value} {...props} style={labelButtonStyle} className={classnames(className, styles['color-input-container'])} onClick={labelButtonOnClick}>
                {
                    isTransparent ?
                        <div className={styles['transparent-label-container']}>
                            <div className={styles['transparent-label']}>{ t('BUTTON_COLOR_TRANSPARENT') }</div>
                        </div>
                        :
                        null
                }
            </Button>
            {
                isMobile ?
                    <BottomSheet className={styles['color-sheet']} title={t('CHOOSE_COLOR')} show={modalOpen} onCloseRequest={closeModal} closeOnContentClick={false}>
                        {picker}
                        <Button className={styles['select-button']} onClick={selectButtonOnClick}>
                            {t('SELECT')}
                        </Button>
                    </BottomSheet>
                    :
                    modalOpen ?
                        <ModalDialog title={t('CHOOSE_COLOR')} buttons={modalButtons} onCloseRequest={closeModal}>
                            {picker}
                        </ModalDialog>
                        :
                        null
            }
        </React.Fragment>
    );
};

export default ColorInput;
