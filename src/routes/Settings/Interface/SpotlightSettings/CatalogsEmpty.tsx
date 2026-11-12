// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import styles from './CatalogsEmpty.less';

const CatalogsEmpty = () => {
    const { t } = useTranslation();

    return (
        <div className={styles['empty']}>
            <Icon className={styles['icon']} name={'addons-outline'} />
            <div className={styles['title']}>{t('SETTINGS_SPOTLIGHT_NO_CATALOGS')}</div>
            <div>{t('SETTINGS_SPOTLIGHT_NO_CATALOGS_DESCRIPTION')}</div>
            <Button className={styles['link']} href={'#/addons'}>{t('SETTINGS_SPOTLIGHT_GO_TO_ADDONS')}</Button>
        </div>
    );
};

export default CatalogsEmpty;
