// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import styles from './Page.less';

type Props = {
    title: string,
    scope?: string | null,
    onBack?: (event: React.MouseEvent<HTMLDivElement>) => void,
    children?: React.ReactNode,
};

const Page = ({ title, scope, onBack, children }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={styles['page']}>
            {
                onBack &&
                    <Button className={styles['back']} href={'#/settings'} title={t('SETTINGS')} data-back={true} onClick={onBack}>
                        <Icon className={styles['icon']} name={'chevron-back'} />
                        <div className={styles['label']}>{t('SETTINGS')}</div>
                    </Button>
            }
            <div className={styles['head']}>
                <h1 className={styles['title']}>{title}</h1>
                {
                    scope &&
                        <p className={styles['scope']}>{scope}</p>
                }
            </div>
            {children}
        </div>
    );
};

export default Page;
