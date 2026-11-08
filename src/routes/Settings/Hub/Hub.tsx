// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { interfaceLanguages, languageNames, usePlatform } from 'stremio/common';
import { Button } from 'stremio/components';
import { PageIcon, SearchField } from '../components';
import { PAGES } from '../constants';
import isTraktAuthenticated from '../isTraktAuthenticated';
import type { SettingsGroup } from '../useSettingsPages';
import styles from './Hub.less';

const LANGUAGES_NAMES: Record<string, string> = languageNames;

type Props = {
    groups: SettingsGroup[],
    profile: Profile,
    streamingServer: StreamingServer,
    query: string,
    onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onOpenPage: (event: React.MouseEvent<HTMLDivElement>) => void,
};

const Hub = ({ groups, profile, streamingServer, query, onQueryChange, onOpenPage }: Props) => {
    const { t } = useTranslation();
    const platform = usePlatform();

    const avatar = useMemo(() => {
        if (!profile.auth) {
            return `url('${require('/assets/images/anonymous.png')}')`;
        }

        if (profile.auth.user.avatar) {
            return `url('${profile.auth.user.avatar}')`;
        }

        return `url('${require('/assets/images/default_avatar.png')}')`;
    }, [profile.auth]);

    const summaries = useMemo<Record<string, string | null>>(() => {
        const { settings } = profile;
        const interfaceLanguage = interfaceLanguages.find(({ codes }: { codes: string[] }) => codes.includes(settings.interfaceLanguage));
        const subtitlesLanguage = settings.subtitlesLanguage !== null ?
            LANGUAGES_NAMES[settings.subtitlesLanguage] ?? settings.subtitlesLanguage
            :
            t('NONE');

        const deviceSummary = () => {
            if (platform.shell.active) {
                return settings.hardwareDecoding ? t('SETTINGS_SUMMARY_HWDEC_ON') : t('SETTINGS_SUMMARY_HWDEC_OFF');
            }

            return settings.surroundSound ? t('SETTINGS_SUMMARY_SURROUND_ON') : t('SETTINGS_SUMMARY_SURROUND_OFF');
        };

        const streamingSummary = () => {
            switch (streamingServer.settings?.type) {
                case 'Ready': return t('SETTINGS_SUMMARY_SERVER_ONLINE');
                case 'Err': return t('SETTINGS_SUMMARY_SERVER_OFFLINE');
                default: return null;
            }
        };

        return {
            [PAGES.INTERFACE]: interfaceLanguage?.name ?? settings.interfaceLanguage,
            [PAGES.PLAYER]: t('SETTINGS_SUMMARY_SUBTITLES', { language: subtitlesLanguage }),
            [PAGES.INTEGRATIONS]: isTraktAuthenticated(profile) ? t('SETTINGS_SUMMARY_TRAKT_CONNECTED') : t('SETTINGS_SUMMARY_INTEGRATIONS'),
            [PAGES.DEVICE]: deviceSummary(),
            [PAGES.STREAMING]: streamingSummary(),
            [PAGES.ACCOUNT]: profile.auth === null ? `${t('LOG_IN')} / ${t('SIGN_UP')}` : null,
            [PAGES.HELP]: t('SETTINGS_SUMMARY_HELP'),
        };
    }, [t, profile, platform.shell.active, streamingServer.settings]);

    return (
        <div className={styles['hub']}>
            <Button
                className={styles['identity']}
                href={`#/settings/${PAGES.ACCOUNT}`}
                title={t('ACCOUNT')}
                data-page={PAGES.ACCOUNT}
                onClick={onOpenPage}
            >
                <div className={styles['avatar']} style={{ backgroundImage: avatar }} />
                <div className={styles['text']}>
                    <div className={styles['title']}>
                        {profile.auth === null ? t('ANONYMOUS_USER') : profile.auth.user.email}
                    </div>
                    {
                        profile.auth === null &&
                            <div className={styles['summary']}>{t('SETTINGS_GUEST_HINT')}</div>
                    }
                </div>
                <Icon className={styles['chevron']} name={'chevron-forward'} />
            </Button>
            <SearchField className={styles['search']} value={query} onChange={onQueryChange} />
            {
                groups.map((group) => (
                    <React.Fragment key={group.id}>
                        <div className={styles['label']}>{group.label}</div>
                        <div className={styles['card']}>
                            {
                                group.pages.map((page) => (
                                    <Button
                                        key={page.id}
                                        className={styles['row']}
                                        href={`#/settings/${page.id}`}
                                        title={page.label}
                                        data-page={page.id}
                                        onClick={onOpenPage}
                                    >
                                        <PageIcon className={styles['icon']} name={page.icon} />
                                        <div className={styles['text']}>
                                            <div className={styles['title']}>{page.label}</div>
                                            {
                                                summaries[page.id] &&
                                                    <div className={styles['summary']}>{summaries[page.id]}</div>
                                            }
                                        </div>
                                        <Icon className={styles['chevron']} name={'chevron-forward'} />
                                    </Button>
                                ))
                            }
                        </div>
                    </React.Fragment>
                ))
            }
        </div>
    );
};

export default Hub;
