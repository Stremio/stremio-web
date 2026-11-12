// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatform, useToast } from 'stremio/common';
import { Group, Row, RowButton } from '../components';

type Props = {
    profile: Profile,
    trakt: {
        authenticated: boolean,
        toggle: () => void,
    },
};

const Integrations = ({ profile, trakt }: Props) => {
    const { t } = useTranslation();
    const platform = usePlatform();
    const toast = useToast();

    const traktDescription = useMemo(() => {
        if (profile.auth === null) {
            return t('SETTINGS_TRAKT_GUEST_DESC');
        }

        return trakt.authenticated ? t('SETTINGS_TRAKT_CONNECTED_DESC') : t('SETTINGS_TRAKT_DESC');
    }, [t, profile.auth, trakt.authenticated]);

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
    }, [profile.auth]);

    return (
        <Group>
            <Row rowId={'trakt'} label={t('SETTINGS_TRAKT')} description={traktDescription} icon={'trakt'} stackOnPhone={true}>
                <RowButton
                    label={trakt.authenticated ? t('SETTINGS_TRAKT_DISCONNECT') : t('SETTINGS_TRAKT_AUTHENTICATE')}
                    external={!trakt.authenticated}
                    disabled={profile.auth === null}
                    onClick={trakt.toggle}
                />
            </Row>
            <Row
                rowId={'calendar'}
                label={t('SETTINGS_SUBSCRIBE_CALENDAR')}
                description={profile.auth === null ? t('SETTINGS_CALENDAR_GUEST_DESC') : t('SETTINGS_CALENDAR_DESC')}
                icon={'calendar'}
                stackOnPhone={true}
            >
                <RowButton
                    label={t('SETTINGS_CALENDAR_SUBSCRIBE')}
                    disabled={profile.auth === null}
                    onClick={onCalendarSubscribe}
                />
            </Row>
        </Group>
    );
};

export default Integrations;
