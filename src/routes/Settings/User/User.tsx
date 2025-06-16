import React, { useMemo } from 'react';
import Link from '../Link';
import styles from './User.less';
import { t } from 'i18next';

type Props = {
    profile: Profile,
    onLogout: () => void,
};

const User = ({ profile, onLogout }: Props) => {
    const avatar = useMemo(() => (
        !profile.auth ?
            `url('${require('/images/anonymous.png')}')`
            :
            profile.auth.user.avatar ?
                `url('${profile.auth.user.avatar}')`
                :
                `url('${require('/images/default_avatar.png')}')`
    ), [profile.auth]);

    return (
        <div className={styles['user']}>
            <div className={styles['user-info-content']}>
                <div
                    className={styles['avatar-container']}
                    style={{ backgroundImage: avatar }}
                />
                <div className={styles['email-logout-container']}>
                    <div className={styles['email-label-container']} title={profile.auth === null ? 'Anonymous user' : profile.auth.user.email}>
                        <div className={styles['email-label']}>
                            {profile.auth === null ? 'Anonymous user' : profile.auth.user.email}
                        </div>
                    </div>
                    {
                        profile.auth !== null ?
                            <Link
                                label={t('LOG_OUT')}
                                onClick={onLogout}
                            />
                            :
                            <Link
                                label={`${t('LOG_IN')} / ${t('SIGN_UP')}`}
                                href={'#/intro'}
                            />
                    }
                </div>
            </div>
        </div>
    );
};

export default User;
