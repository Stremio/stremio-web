// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router';
import { UpdateBanner } from 'stremio/components';
import useServiceWorkerUpdater from './useServiceWorkerUpdater';
import styles from './WebUpdateScreen.less';

const WebUpdateScreen = () => {
    const { t } = useTranslation();
    const { state, dismissed, applyUpdate, dismissUpdate } = useServiceWorkerUpdater();
    const isPlayer = useMatch('/player/*');
    const autoApply = state.status === 'ready' && state.autoApply;
    const promptVisible =
        !dismissed &&
        isPlayer === null &&
        (state.status === 'ready' || state.status === 'reload-ready' || state.status === 'failed');

    useEffect(() => {
        if (autoApply && isPlayer === null) {
            applyUpdate();
        }
    }, [applyUpdate, autoApply, isPlayer]);

    if (state.status === 'applying') {
        return (
            <div
                className={styles['web-update-screen']}
                role={'status'}
                aria-live={'polite'}
                aria-busy={true}
            >
                <img
                    className={styles['logo']}
                    src={require('/assets/images/stremio_symbol.png')}
                    alt={''}
                />
                <div className={styles['title']}>
                    {t('UPDATER_TITLE')}
                </div>
                <div className={styles['progress']} aria-hidden={true}>
                    <div className={styles['progress-value']} />
                </div>
            </div>
        );
    }

    return (
        <UpdateBanner
            className={styles['web-update-banner']}
            visible={promptVisible}
            label={t('UPDATER_TITLE')}
            actionLabel={state.status === 'failed' ? t('TRY_AGAIN') : t('RELOAD_UI')}
            closeLabel={t('BUTTON_CLOSE')}
            onAction={applyUpdate}
            onClose={dismissUpdate}
        />
    );
};

export default WebUpdateScreen;
