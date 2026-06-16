// Copyright (C) 2017-2023 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'stremio/components/Image';
import Button from 'stremio/components/Button';
import styles from './styles.less';

type Props = {
    message: string,
};

const Error = ({ message }: Props) => {
    const { t } = useTranslation();

    const clearData = React.useCallback(() => {
        window.localStorage.clear();
        window.location.reload();
    }, []);

    return (
        <div className={styles['error-container']}>
            <Image
                className={styles['error-image']}
                src={require('/assets/images/empty.png')}
                alt={' '}
            />
            <div className={styles['info']}>
                <div className={styles['title']}>
                    {t('GENERIC_ERROR_MESSAGE')}
                </div>
                <div className={styles['message']}>
                    {message}
                </div>
            </div>
            <div className={styles['buttons-container']}>
                <Button className={styles['button-container']} title={t('CLEAR_DATA')} onClick={clearData}>
                    <div className={styles['label']}>
                        { t('CLEAR_DATA') }
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default Error;
