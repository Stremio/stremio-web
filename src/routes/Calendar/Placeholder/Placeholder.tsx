// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, Image } from 'stremio/common';
import styles from './Placeholder.less';

const Placeholder = () => {
    const { t } = useTranslation();

    return (
        <div className={styles['placeholder']}>
            <div className={styles['title']}>
                {t('CALENDAR_NOT_LOGGED_IN')}
            </div>
            <Image
                className={styles['image']}
                src={require('/images/calendar_placeholder.png')}
                alt={' '}
            />
            <div className={styles['overview']}>
                <div className={styles['point']}>
                    <Icon className={styles['icon']} name={'megaphone'} />
                    <div className={styles['text']}>
                        {t('NOT_LOGGED_IN_NOTIFICATIONS')}
                    </div>
                </div>
                <div className={styles['point']}>
                    <Icon className={styles['icon']} name={'calendar-thin'} />
                    <div className={styles['text']}>
                        {t('NOT_LOGGED_IN_CALENDAR')}
                    </div>
                </div>
            </div>
            <Button className={styles['button']} href={'#/intro?form=login'}>
                {t('LOG_IN')}
            </Button>
        </div>
    );
};

export default Placeholder;
