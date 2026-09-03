// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'stremio/components';
import styles from './styles.less';

type Props = {
    url: string,
    onConfirm: () => void,
    onCancel: () => void,
};

const StreamingServerUrlModal = ({ url, onConfirm, onCancel }: Props) => {
    const { t } = useTranslation();

    useEffect(() => {
        const onKeyDown = ({ key }: KeyboardEvent) => {
            key === 'Escape' && onCancel();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onCancel]);

    return createPortal((
        <div className={styles['streaming-server-url-modal']}>
            <div className={styles['backdrop']} onClick={onCancel} />

            <div className={styles['container']}>
                <div className={styles['title']}>
                    {t('SETTINGS_SERVER_CONFIGURE_TITLE')}
                </div>

                <div className={styles['message']}>
                    {t('SETTINGS_SERVER_CONFIGURE_CONFIRM')}
                </div>

                <div className={styles['url']}>
                    {url}
                </div>

                <div className={styles['buttons']}>
                    <Button className={styles['cancel-button']} title={t('BUTTON_CANCEL')} onClick={onCancel}>
                        <div className={styles['label']}>{t('BUTTON_CANCEL')}</div>
                    </Button>

                    <Button className={styles['confirm-button']} title={t('BUTTON_CONFIRM')} onClick={onConfirm}>
                        <div className={styles['label']}>{t('BUTTON_CONFIRM')}</div>
                    </Button>
                </div>
            </div>
        </div>
    ), document.body);
};

export default StreamingServerUrlModal;
