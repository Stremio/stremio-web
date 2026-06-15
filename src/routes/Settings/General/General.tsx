import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import { Button, Toggle } from 'stremio/components';
import { usePlatform, useToast, useDiscord } from 'stremio/common';
import { Section, Option, Link } from '../components';
import User from './User';
import useDataExport from './useDataExport';
import styles from './General.less';

type Props = {
    profile: Profile,
};

const General = forwardRef<HTMLDivElement, Props>(({ profile }: Props, ref) => {
    const { t } = useTranslation();
    const core = useCore();
    const platform = usePlatform();
    const toast = useToast();
    const discord = useDiscord();
    const [dataExport, loadDataExport] = useDataExport();

    const [traktAuthStarted, setTraktAuthStarted] = useState(false);

    const isTraktAuthenticated = useMemo(() => {
        const trakt = profile?.auth?.user?.trakt;
        return trakt && (Date.now() / 1000) < (trakt.created_at + trakt.expires_in);
    }, [profile.auth]);

    const onExportData = useCallback(() => {
        loadDataExport();
    }, []);

    const onCalendarSubscribe = useCallback(() => {
        if (!profile.auth) return;

        const protocol = platform.name === 'ios' ? 'webcal' : 'https';
        const url = `${protocol}://www.strem.io/calendar/${profile.auth.user._id}.ics`;
        platform.openExternal(url);

        toast.show({
            type: 'success',
            title: platform.name === 'ios' ?
                t('SETTINGS_SUBSCRIBE_CALENDAR_IOS_TOAST') :
                t('SETTINGS_SUBSCRIBE_CALENDAR_TOAST'),
            timeout: 25000
        });
        // Stremio 4 emits not documented event subscribeCalendar
    }, [profile.auth]);

    const onToggleTrakt = useCallback(() => {
        if (!isTraktAuthenticated && profile.auth !== null && profile.auth.user !== null && typeof profile.auth.user._id === 'string') {
            platform.openExternal(`https://www.strem.io/trakt/auth/${profile.auth.user._id}`);
            setTraktAuthStarted(true);
        } else {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'LogoutTrakt'
                }
            });
        }
    }, [isTraktAuthenticated, profile.auth]);

    const discordToggle = useMemo(() => ({
        checked: profile.settings.discordRpcEnabled === true,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        discordRpcEnabled: !profile.settings.discordRpcEnabled
                    }
                }
            });
        }
    }), [profile.settings]);

    useEffect(() => {
        if (dataExport.exportUrl) {
            platform.openExternal(dataExport.exportUrl);
        }
    }, [dataExport.exportUrl]);

    useEffect(() => {
        if (isTraktAuthenticated && traktAuthStarted) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'InstallTraktAddon'
                }
            });
            setTraktAuthStarted(false);
        }
    }, [isTraktAuthenticated, traktAuthStarted]);

    return <>
        <Section ref={ref}>
            <User profile={profile} />
        </Section>

        <Section>
            {
                profile?.auth?.user &&
                    <Link
                        label={t('SETTINGS_DATA_EXPORT')}
                        onClick={onExportData}
                    />
            }
            {
                profile?.auth?.user &&
                    <Link
                        label={t('SETTINGS_SUBSCRIBE_CALENDAR')}
                        onClick={onCalendarSubscribe}
                    />
            }
            <Link
                label={t('SETTINGS_SUPPORT')}
                href={'https://stremio.zendesk.com/hc/en-us'}
            />
            <Link
                label={t('SETTINGS_SOURCE_CODE')}
                href={`https://github.com/stremio/stremio-web/tree/${process.env.COMMIT_HASH}`}
            />
            <Link
                label={t('TERMS_OF_SERVICE')}
                href={'https://www.stremio.com/tos'}
            />
            <Link
                label={t('PRIVACY_POLICY')}
                href={'https://www.stremio.com/privacy'}
            />
            {
                profile?.auth?.user &&
                    <Link
                        label={t('SETTINGS_ACC_DELETE')}
                        href={'https://stremio.zendesk.com/hc/en-us/articles/360021428911-How-to-delete-my-account'}
                    />
            }
            {
                profile?.auth?.user?.email &&
                    <Link
                        label={t('SETTINGS_CHANGE_PASSWORD')}
                        href={`https://www.strem.io/reset-password/${profile.auth.user.email}`}
                    />
            }
            <Option className={styles['trakt-container']} icon={'trakt'} label={t('SETTINGS_TRAKT')}>
                <Button className={'button'} title={isTraktAuthenticated ? t('LOG_OUT') : t('SETTINGS_TRAKT_AUTHENTICATE')} disabled={profile.auth === null} tabIndex={-1} onClick={onToggleTrakt}>
                    {isTraktAuthenticated ? t('LOG_OUT') : t('SETTINGS_TRAKT_AUTHENTICATE')}
                </Button>
            </Option>
            {
                discord.available &&
                    <Option className={styles['discord-container']} icon={'discord'} label={'SETTINGS_DISCORD'}>
                        <Toggle
                            tabIndex={-1}
                            {...discordToggle}
                        />
                    </Option>
            }
        </Section>
    </>;
});

export default General;
