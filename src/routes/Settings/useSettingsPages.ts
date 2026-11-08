// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatform } from 'stremio/common';
import usePWA from 'stremio/common/usePWA';
import { PAGES } from './constants';

type SettingsPage = {
    id: string,
    icon: string,
    label: string,
    scope: string | null,
};

type SettingsGroup = {
    id: string,
    label: string,
    pages: SettingsPage[],
};

const useSettingsPages = () => {
    const { t } = useTranslation();
    const platform = usePlatform();
    const [isIOSPWA, isStandalonePWA] = usePWA();

    const installed = platform.shell.active || isIOSPWA || isStandalonePWA;

    const groups = useMemo<SettingsGroup[]>(() => {
        const savedScope = installed ? t('SETTINGS_SCOPE_SAVED_ON_DEVICE') : t('SETTINGS_SCOPE_SAVED_IN_BROWSER');
        const serverScope = installed ? t('SETTINGS_SCOPE_SERVER_ON_DEVICE') : t('SETTINGS_SCOPE_SERVER_IN_BROWSER');

        return [
            {
                id: 'preferences',
                label: t('SETTINGS_GROUP_PREFERENCES'),
                pages: [
                    { id: PAGES.INTERFACE, icon: 'grid', label: t('INTERFACE'), scope: savedScope },
                    { id: PAGES.PLAYER, icon: 'movies-outline', label: t('SETTINGS_NAV_PLAYER'), scope: savedScope },
                    { id: PAGES.INTEGRATIONS, icon: 'link', label: t('SETTINGS_NAV_INTEGRATIONS'), scope: null },
                ],
            },
            {
                id: 'device',
                label: installed ? t('SETTINGS_GROUP_THIS_DEVICE') : t('SETTINGS_GROUP_THIS_BROWSER'),
                pages: [
                    { id: PAGES.DEVICE, icon: 'channels-outline', label: platform.shell.active ? t('SETTINGS_NAV_PLAYBACK_AND_APP') : t('PLAYBACK'), scope: savedScope },
                    { id: PAGES.STREAMING, icon: 'network', label: t('SETTINGS_NAV_STREAMING'), scope: serverScope },
                ],
            },
            {
                id: 'account',
                label: t('ACCOUNT'),
                pages: [
                    { id: PAGES.ACCOUNT, icon: 'account', label: t('ACCOUNT'), scope: null },
                ],
            },
            {
                id: 'help',
                label: t('SETTINGS_GROUP_HELP'),
                pages: [
                    ...(!platform.isMobile ? [{ id: PAGES.SHORTCUTS, icon: 'keyboard', label: t('SETTINGS_NAV_SHORTCUTS'), scope: null }] : []),
                    { id: PAGES.HELP, icon: 'help', label: t('SETTINGS_NAV_HELP_AND_ABOUT'), scope: null },
                ],
            },
        ];
    }, [t, installed, platform.shell.active, platform.isMobile]);

    const pages = useMemo(() => groups.flatMap(({ pages }) => pages), [groups]);

    return { groups, pages };
};

export type { SettingsPage, SettingsGroup };

export default useSettingsPages;
