// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import FocusLock from 'react-focus-lock';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import styles from './styles.less';

type Props = {
    url: string,
    onConfirm: () => void,
    onCancel: () => void,
};

const StreamingServerUrlModal = ({ url, onConfirm, onCancel }: Props) => {
    const { t } = useTranslation();

    const onKeyDown = useCallback((event: React.KeyboardEvent) => {
        event.stopPropagation();
        if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
        }
    }, [onCancel]);

    useEffect(() => {
        const onWindowKeyDown = (event: KeyboardEvent) => {
            event.key === 'Escape' && onCancel();
        };

        window.addEventListener('keydown', onWindowKeyDown);
        return () => window.removeEventListener('keydown', onWindowKeyDown);
    }, [onCancel]);

    return createPortal((
        <FocusLock
            autoFocus={false}
            returnFocus
            className={styles['modal-container']}
            lockProps={{ onKeyDown }}
        >
            <div className={styles['backdrop']} onClick={onCancel} />
            <div
                className={styles['modal-dialog-container']}
                role={'dialog'}
                aria-modal={'true'}
                aria-labelledby={'streaming-server-url-modal-title'}
            >
                <Button className={styles['close-button-container']} title={t('BUTTON_CLOSE')} onClick={onCancel}>
                    <Icon className={styles['icon']} name={'close'} />
                </Button>

                <div className={styles['modal-dialog-content']}>
                    <div id={'streaming-server-url-modal-title'} className={styles['title-container']} title={t('SETTINGS_SERVER_CONFIGURE_TITLE')}>
                        {t('SETTINGS_SERVER_CONFIGURE_TITLE')}
                    </div>

                    <div className={styles['body-container']}>
                        <div className={styles['url']}>
                            {url}
                        </div>
                    </div>

                    <div className={styles['buttons-container']}>
                        <Button className={classnames(styles['action-button'], styles['cancel-button'])} title={t('BUTTON_CANCEL')} onClick={onCancel}>
                            <div className={styles['label']}>{t('BUTTON_CANCEL')}</div>
                        </Button>

                        <Button className={styles['action-button']} title={t('BUTTON_CONFIRM')} onClick={onConfirm}>
                            <div className={styles['label']}>{t('BUTTON_CONFIRM')}</div>
                        </Button>
                    </div>
                </div>
            </div>
        </FocusLock>
    ), document.body);
};

export default StreamingServerUrlModal;
