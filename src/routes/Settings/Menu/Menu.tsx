import React, { useMemo } from 'react';
import classNames from 'classnames';
import { t } from 'i18next';
import { Button } from 'stremio/components';
import { SECTIONS } from '../constants';
import styles from './Menu.less';

type Props = {
    selected: string,
    shell: ShellService,
    streamingServer: StreamingServer,
    onSelect: () => void,
};

const Menu = ({ selected, shell, streamingServer, onSelect }: Props) => {
    const settings = useMemo(() => (
        streamingServer?.settings?.type === 'Ready' ?
            streamingServer.settings.content as StreamingServerSettings : null
    ), [streamingServer?.settings]);

    return (
        <div className={styles['menu']}>
            <Button className={classNames(styles['button'], { [styles['selected']]: selected === SECTIONS.GENERAL })} title={t('SETTINGS_NAV_GENERAL')} data-section={SECTIONS.GENERAL} onClick={onSelect}>
                { t('SETTINGS_NAV_GENERAL') }
            </Button>
            <Button className={classNames(styles['button'], { [styles['selected']]: selected === SECTIONS.PLAYER })} title={t('SETTINGS_NAV_PLAYER')} data-section={SECTIONS.PLAYER} onClick={onSelect}>
                { t('SETTINGS_NAV_PLAYER') }
            </Button>
            <Button className={classNames(styles['button'], { [styles['selected']]: selected === SECTIONS.STREAMING })} title={t('SETTINGS_NAV_STREAMING')} data-section={SECTIONS.STREAMING} onClick={onSelect}>
                { t('SETTINGS_NAV_STREAMING') }
            </Button>
            <Button className={classNames(styles['button'], { [styles['selected']]: selected === SECTIONS.SHORTCUTS })} title={t('SETTINGS_NAV_SHORTCUTS')} data-section={SECTIONS.SHORTCUTS} onClick={onSelect}>
                { t('SETTINGS_NAV_SHORTCUTS') }
            </Button>

            <div className={styles['spacing']} />
            <div className={styles['version-info-label']} title={process.env.VERSION}>
                App Version: {process.env.VERSION}
            </div>
            <div className={styles['version-info-label']} title={process.env.COMMIT_HASH}>
                Build Version: {process.env.COMMIT_HASH}
            </div>
            {
                settings?.serverVersion &&
                    <div className={styles['version-info-label']} title={settings.serverVersion}>
                        Server Version: {settings.serverVersion}
                    </div>
            }
            {
                typeof shell?.transport?.props?.shellVersion === 'string' &&
                    <div className={styles['version-info-label']} title={shell.transport.props.shellVersion}>
                        Shell Version: {shell.transport.props.shellVersion}
                    </div>
            }
        </div>
    );
};

export default Menu;
