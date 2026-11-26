// Copyright (C) 2017-2026 Smart code 203358507

import React, { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import styles from './OfflineNotice.less';

const subscribe = (onChange: () => void) => {
    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);

    return () => {
        window.removeEventListener('online', onChange);
        window.removeEventListener('offline', onChange);
    };
};

const getOnlineStatus = () => navigator.onLine;

const OfflineNotice = () => {
    const { t } = useTranslation();
    const isOnline = useSyncExternalStore(subscribe, getOnlineStatus);

    return (
        <div className={styles['status']} role={'status'}>
            {
                !isOnline ?
                    <div className={styles['notice']}>
                        <Icon className={styles['icon']} name={'warning'} aria-hidden={true} />
                        {t('NOTIFICATION_OFFLINE')}
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default OfflineNotice;
