// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { PAGES } from '../constants';
import getAvatar from '../getAvatar';
import styles from './AccountRow.less';

type Props = {
    className?: string,
    profile: Profile,
    card?: boolean,
    selected?: boolean,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
};

const AccountRow = ({ className, profile, card, selected, onClick }: Props) => {
    const { t } = useTranslation();

    const avatar = useMemo(() => getAvatar(profile.auth), [profile.auth]);
    const guest = profile.auth === null;
    const title = profile.auth === null ? t('SETTINGS_ACCOUNT_GUEST') : t('ACCOUNT');
    const caption = profile.auth === null ? t('SETTINGS_ACCOUNT_LOG_IN_SIGN_UP') : profile.auth.user.email;

    return (
        <Button
            className={classNames(className, styles['account-row'], { [styles['card']]: card, [styles['selected']]: selected })}
            href={guest ? '#/intro' : `#/settings/${PAGES.ACCOUNT}`}
            title={profile.auth === null ? title : profile.auth.user.email}
            data-page={guest ? undefined : PAGES.ACCOUNT}
            aria-current={selected ? 'page' : undefined}
            onClick={guest ? undefined : onClick}
        >
            <div className={styles['avatar']} style={{ backgroundImage: avatar }} />
            <div className={styles['text']}>
                <div className={styles['title']}>{title}</div>
                <div className={styles['caption']}>{caption}</div>
            </div>
            <Icon className={styles['chevron']} name={'chevron-forward'} />
        </Button>
    );
};

export default AccountRow;
