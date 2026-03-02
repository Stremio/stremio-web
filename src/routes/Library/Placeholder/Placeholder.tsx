// Copyright (C) 2017-2025 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, Image } from 'stremio/components';
import styles from './Placeholder.less';

const Placeholder = () => {
    const { t } = useTranslation();

    return (
        <div className={styles['placeholder']}>
            <div className={styles['title']}>
                {t('LIBRARY_NOT_LOGGED_IN')}
            </div>
            <div className={styles['image-container']}>
                <Image
                    className={styles['image']}
                    src={require('/assets/images/library_placeholder.png')}
                    alt={' '}
                />
            </div>
            <div className={styles['overview']}>
                <div className={styles['point']}>
                    <Icon className={styles['icon']} name={'cloud-library'} />
                    <div className={styles['text']}>
                        {t('NOT_LOGGED_IN_CLOUD')}
                    </div>
                </div>
                <div className={styles['point']}>
                    <Icon className={styles['icon']} name={'actors'} />
                    <div className={styles['text']}>
                        {t('NOT_LOGGED_IN_RECOMMENDATIONS')}
                    </div>
                </div>
            </div>
            <div className={styles['button-container']}>
                <Button className={styles['button']} href={'#/intro?form=login'}>
                    {t('LOG_IN')}
                </Button>
            </div>
        </div>
    );
};

export default Placeholder;
