// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import { Group, Row, RowButton } from '../components';
import getAvatar from '../getAvatar';
import styles from './Account.less';

type Props = {
    profile: Profile,
    dataExport: {
        loading: boolean,
        start: () => void,
    },
};

const Account = ({ profile, dataExport }: Props) => {
    const { t } = useTranslation();
    const core = useCore();

    const avatar = useMemo(() => getAvatar(profile.auth), [profile.auth]);

    const onLogout = useCallback(() => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'Logout'
            }
        });
    }, []);

    return (
        <React.Fragment>
            <Group>
                <div className={styles['identity']}>
                    <div className={styles['avatar']} style={{ backgroundImage: avatar }} />
                    <div className={styles['text']}>
                        <div className={styles['name']} title={profile.auth === null ? t('ANONYMOUS_USER') : profile.auth.user.email}>
                            {profile.auth === null ? t('ANONYMOUS_USER') : profile.auth.user.email}
                        </div>
                        {
                            profile.auth === null &&
                                <div className={styles['hint']}>{t('SETTINGS_ACCOUNT_GUEST_HINT')}</div>
                        }
                    </div>
                    {
                        profile.auth !== null ?
                            <RowButton icon={'exit'} label={t('LOG_OUT')} onClick={onLogout} />
                            :
                            <RowButton variant={'primary'} label={`${t('LOG_IN')} / ${t('SIGN_UP')}`} href={'#/intro'} />
                    }
                </div>
            </Group>
            {
                profile?.auth?.user?.email &&
                    <Group title={t('SETTINGS_GROUP_SECURITY')}>
                        <Row rowId={'password'} label={t('PASSWORD')} description={t('SETTINGS_PASSWORD_DESC')} stackOnPhone={true}>
                            <RowButton
                                label={t('SETTINGS_CHANGE_PASSWORD')}
                                href={`https://www.strem.io/reset-password/${profile.auth.user.email}`}
                                external={true}
                            />
                        </Row>
                    </Group>
            }
            {
                profile?.auth?.user &&
                    <Group title={t('SETTINGS_GROUP_YOUR_DATA')}>
                        <Row rowId={'export'} label={t('SETTINGS_DATA_EXPORT')} description={t('WEBSITE_DATA_EXPORT_DESCRIPTION')} stackOnPhone={true}>
                            <RowButton label={t('SETTINGS_DATA_EXPORT_BUTTON')} disabled={dataExport.loading} onClick={dataExport.start} />
                        </Row>
                    </Group>
            }
            {
                profile?.auth?.user &&
                    <Group className={styles['danger']}>
                        <Row rowId={'deletion'} label={t('SETTINGS_ACCOUNT_DELETION')} description={t('SETTINGS_ACCOUNT_DELETION_DESC')} stackOnPhone={true}>
                            <RowButton
                                variant={'danger'}
                                label={t('SETTINGS_DELETE_ACCOUNT')}
                                href={'https://www.stremio.com/acc-settings'}
                                external={true}
                            />
                        </Row>
                    </Group>
            }
        </React.Fragment>
    );
};

export default Account;
