// Copyright (C) 2017-2023 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'stremio/components/Image';
import Button from 'stremio/components/Button';
import styles from './styles.less';

const Error = () => {
    const { t } = useTranslation();

    const [dataCleared, setDataCleared] = React.useState(false);

    const reload = React.useCallback(() => {
        window.location.reload();
    }, []);

    const clearData = React.useCallback(() => {
        window.localStorage.clear();
        setDataCleared(true);
    }, []);

    return (
        <div className={styles['error-container']}>
            <Image
                className={styles['error-image']}
                src={require('/assets/images/empty.png')}
                alt={' '}
            />
            <div className={styles['error-message']}>
                { t('GENERIC_ERROR_MESSAGE') }
            </div>
            <div className={styles['buttons-container']}>
                <Button className={styles['button-container']} title={t('TRY_AGAIN')} onClick={reload}>
                    <div className={styles['label']}>
                        { t('TRY_AGAIN') }
                    </div>
                </Button>
                <Button className={styles['button-container']} disabled={dataCleared} title={t('CLEAR_DATA')} onClick={clearData}>
                    <div className={styles['label']}>
                        { t('CLEAR_DATA') }
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default Error;
