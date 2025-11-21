// Copyright (C) 2017-2023 Smart code 203358507

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { useShortcuts } from 'stremio/common';
import { Button, ShortcutsGroup } from 'stremio/components';
import styles from './styles.less';

type Props = {
    onClose: () => void,
};

const ShortcutsModal = ({ onClose }: Props) => {
    const { t } = useTranslation();
    const { grouped } = useShortcuts();

    useEffect(() => {
        const onKeyDown = ({ key }: KeyboardEvent) => {
            key === 'Escape' && onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return createPortal((
        <div className={styles['shortcuts-modal']}>
            <div className={styles['backdrop']} onClick={onClose} />

            <div className={styles['container']}>
                <div className={styles['header']}>
                    <div className={styles['title']}>
                        {t('SETTINGS_NAV_SHORTCUTS')}
                    </div>

                    <Button className={styles['close-button']} title={t('BUTTON_CLOSE')} onClick={onClose}>
                        <Icon className={styles['icon']} name={'close'} />
                    </Button>
                </div>

                <div className={styles['content']}>
                    {
                        grouped.map(({ name, label, shortcuts }) => (
                            <ShortcutsGroup
                                key={name}
                                label={label}
                                shortcuts={shortcuts}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    ), document.body);
};

export default ShortcutsModal;
