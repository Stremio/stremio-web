import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router';
import { useBinaryState, usePlatform } from 'stremio/common';
import { UpdateBanner } from 'stremio/components';

type Props = {
    className: string,
};

const UpdaterBanner = ({ className }: Props) => {
    const { t } = useTranslation();
    const { shell } = usePlatform();
    const [visible, show, hide] = useBinaryState(false);
    const isPlayer = useMatch('/player/*');

    const onInstallClick = useCallback(() => {
        shell.send('autoupdater-notif-clicked');
    }, [shell]);

    useEffect(() => {
        shell.on('autoupdater-show-notif', show);

        return () => {
            shell.off('autoupdater-show-notif', show);
        };
    }, []);

    return (
        <UpdateBanner
            className={className}
            visible={visible && isPlayer === null}
            label={t('UPDATER_TITLE')}
            actionLabel={t('UPDATER_INSTALL_BUTTON')}
            closeLabel={t('BUTTON_CLOSE')}
            onAction={onInstallClick}
            onClose={hide}
        />
    );
};

export default UpdaterBanner;
