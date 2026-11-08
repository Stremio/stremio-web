// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import styles from './LinkRow.less';

type Props = {
    label: string,
    href: string,
};

const LinkRow = ({ label, href }: Props) => {
    const { t } = useTranslation();

    return (
        <Button className={styles['link-row']} title={label} href={href} target={'_blank'}>
            <div className={styles['label']}>{label}</div>
            <div className={styles['icon']} role={'img'} aria-label={t('SETTINGS_OPENS_IN_NEW_TAB')}>
                <Icon className={styles['svg']} name={'open-in-browser'} />
            </div>
        </Button>
    );
};

export default LinkRow;
