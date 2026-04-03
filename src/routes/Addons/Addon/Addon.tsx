// Copyright (C) 2017-2023 Smart code 203358507

import React from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, Image } from 'stremio/components';
import styles from './styles.less';

export type BehaviorHints = {
    adult?: boolean;
    configurable?: boolean;
    configurationRequired?: boolean;
    p2p?: boolean;
};

type AddonHandlerEvent = {
    type: string;
    nativeEvent: globalThis.MouseEvent;
    reactEvent: React.MouseEvent;
    dataset: Record<string, unknown>;
};

type Props = {
    className?: string;
    id?: string;
    name?: string;
    version?: string;
    logo?: string;
    description?: string;
    types?: string[];
    behaviorHints: BehaviorHints;
    installed: boolean;
    onInstall?: (event: AddonHandlerEvent) => void;
    onUninstall?: (event: AddonHandlerEvent) => void;
    onConfigure?: (event: AddonHandlerEvent) => void;
    onUpdate?: (event: AddonHandlerEvent) => void;
    onOpen?: (event: AddonHandlerEvent) => void;
    onShare?: (event: AddonHandlerEvent) => void;
    dataset?: Record<string, unknown>;
};

const Addon = ({
    className,
    id,
    name,
    version,
    logo,
    description,
    types,
    behaviorHints,
    installed,
    onInstall,
    onUninstall,
    onConfigure,
    onUpdate,
    onOpen,
    onShare,
    dataset,
}: Props) => {
    const { t } = useTranslation();
    const onInstallClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (typeof onInstall === 'function') {
                onInstall({
                    type: 'install',
                    nativeEvent: event.nativeEvent,
                    reactEvent: event,
                    dataset: dataset ?? {},
                });
            }
        },
        [onInstall, dataset]
    );
    const onUninstallClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (typeof onUninstall === 'function') {
                onUninstall({
                    type: 'uninstall',
                    nativeEvent: event.nativeEvent,
                    reactEvent: event,
                    dataset: dataset ?? {},
                });
            }
        },
        [onUninstall, dataset]
    );
    const onOpenClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (typeof onOpen === 'function') {
                onOpen({
                    type: 'open',
                    nativeEvent: event.nativeEvent,
                    reactEvent: event,
                    dataset: dataset ?? {},
                });
            }
        },
        [onOpen, dataset]
    );
    const configureButtonOnClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (typeof onConfigure === 'function') {
                onConfigure({
                    type: 'configure',
                    nativeEvent: event.nativeEvent,
                    reactEvent: event,
                    dataset: dataset ?? {},
                });
            }
        },
        [onConfigure, dataset]
    );
    const updateButtonOnClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (typeof onUpdate === 'function') {
                onUpdate({
                    type: 'update',
                    nativeEvent: event.nativeEvent,
                    reactEvent: event,
                    dataset: dataset ?? {},
                });
            }
        },
        [onUpdate, dataset]
    );
    const shareButtonOnClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (typeof onShare === 'function') {
                onShare({
                    type: 'share',
                    nativeEvent: event.nativeEvent,
                    reactEvent: event,
                    dataset: dataset ?? {},
                });
            }
        },
        [onShare, dataset]
    );
    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
                onOpenClick(event as unknown as React.MouseEvent);
            }
        },
        [onOpenClick]
    );
    const renderLogoFallback = React.useCallback(() => <Icon className={styles['icon']} name={'addons'} />, []);
    const showConfigure =
        !behaviorHints.configurationRequired && Boolean(behaviorHints.configurable);
    const showUpdate =
        installed && typeof onUpdate === 'function' && !behaviorHints.configurationRequired;

    return (
        <Button className={classnames(className, styles['addon-container'])} onKeyDown={onKeyDown} onClick={onOpenClick}>
            <div className={styles['logo-container']}>
                <Image className={styles['logo']} src={logo ?? ''} alt={' '} renderFallback={renderLogoFallback}/>
            </div>
            <div className={styles['info-container']}>
                <div className={styles['name-container']} title={typeof name === 'string' && name.length > 0 ? name : id}>
                    {typeof name === 'string' && name.length > 0 ? name : id}
                </div>
                {typeof version === 'string' && version.length > 0 ? (
                    <div className={styles['version-container']} title={t('ADDON_VERSION_SHORT', { version })}>
                        {t('ADDON_VERSION_SHORT', { version })}
                    </div>
                ) : null}
                {Array.isArray(types) && types.length > 0 ? (
                    <div className={styles['types-container']}>
                        {types.length === 1 ? types.join('') : types.slice(0, -1).join(', ') + ' & ' + types[types.length - 1]}
                    </div>
                ) : null}
                {typeof description === 'string' && description.length > 0 ? (
                    <div className={styles['description-container']} title={description}>
                        {description}
                    </div>
                ) : null}
            </div>
            <div className={styles['buttons-container']}>
                <div className={styles['action-buttons-container']}>
                    {showConfigure ? (
                        <Button
                            className={styles['configure-button-container']}
                            title={t('ADDON_CONFIGURE')}
                            tabIndex={-1}
                            onClick={configureButtonOnClick}
                        >
                            <Icon className={styles['icon']} name={'settings'} />
                        </Button>
                    ) : null}
                    {showUpdate ? (
                        <Button
                            className={styles['update-button-container']}
                            title={t('ADDON_UPDATE', { defaultValue: 'Update addon' })}
                            tabIndex={-1}
                            onClick={updateButtonOnClick}
                        >
                            <Icon className={styles['icon']} name={'reset'} />
                        </Button>
                    ) : null}
                    <Button
                        className={installed ? styles['uninstall-button-container'] : styles['install-button-container']}
                        title={
                            installed
                                ? t('ADDON_UNINSTALL')
                                : behaviorHints.configurationRequired
                                    ? t('ADDON_CONFIGURE')
                                    : t('ADDON_INSTALL')
                        }
                        tabIndex={-1}
                        onClick={
                            installed ? onUninstallClick : behaviorHints.configurationRequired ? configureButtonOnClick : onInstallClick
                        }
                    >
                        <div className={styles['label']}>
                            {installed
                                ? t('ADDON_UNINSTALL')
                                : behaviorHints.configurationRequired
                                    ? t('ADDON_CONFIGURE')
                                    : t('ADDON_INSTALL')}
                        </div>
                    </Button>
                </div>
                <Button className={styles['share-button-container']} title={t('SHARE_ADDON')} tabIndex={-1} onClick={shareButtonOnClick}>
                    <Icon className={styles['icon']} name={'share'} />
                    <div className={styles['label']}>{t('SHARE_ADDON')}</div>
                </Button>
            </div>
        </Button>
    );
};

export default Addon;
