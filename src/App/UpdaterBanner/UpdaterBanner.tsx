import React, { useEffect } from 'react';
import Icon from '@stremio/stremio-icons/react';
import { useTranslation } from 'react-i18next';
import { useBinaryState, usePlatform } from 'stremio/common';
import { Button, Transition } from 'stremio/components';
import styles from './UpdaterBanner.less';

type Props = {
    className: string,
};

const UpdaterBanner = ({ className }: Props) => {
    const { t } = useTranslation();
    const { shell } = usePlatform();
    const [visible, show, hide] = useBinaryState(false);

    const onInstallClick = () => {
        shell.send('autoupdater-notif-clicked');
    };

    useEffect(() => {
        shell.on('autoupdater-show-notif', show);

        return () => {
            shell.off('autoupdater-show-notif', show);
        };
    }, []);

    return (
        <div className={className}>
            <Transition when={visible} name={'slide-up'}>
                <div className={styles['updater-banner']}>
                    <div className={styles['label']}>
                        { t('UPDATER_TITLE') }
                    </div>
                    <Button className={styles['button']} onClick={onInstallClick}>
                        { t('UPDATER_INSTALL_BUTTON') }
                    </Button>
                    <Button className={styles['close']} onClick={hide}>
                        <Icon className={styles['icon']} name={'close'} />
                    </Button>
                </div>
            </Transition>
        </div>
    );
};

export default UpdaterBanner;
