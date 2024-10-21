// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next';
import styles from './URLsManager.less';
import Button from 'stremio/common/Button';
import Item from './Item';
import Icon from '@stremio/stremio-icons/react';
import useStreamingServerUrls from 'stremio/common/useStreamingServerUrls';

const URLsManager = () => {
    const { t } = useTranslation();
    const [addMode, setAddMode] = useState(false);
    const { streamingServerUrls, actions } = useStreamingServerUrls();

    const onAdd = () => {
        setAddMode(true);
    }

    const onCancel = () => {
        setAddMode(false);
    };

    const handleAddUrl = useCallback((url: string) => {
        actions.onAdd(url);
        setAddMode(false);
    }, []);

    return (
        <div className={styles['wrapper']}>
            <div className={styles['header']}>
                <div className={styles['label']}>URL</div>
                <div className={styles['label']}>{ t('STATUS') }</div>
            </div>
            <div className={styles['content']}>
                {
                    streamingServerUrls.map((url: StreamingServerUrl, index: number) => (
                        <Item mode={'view'} key={index} {...url} {...actions} />
                    ))
                }
                {
                    addMode ?
                        <Item mode={'add'} onAdd={handleAddUrl} onCancel={onCancel} />
                        : null
                }
            </div>
            <div className={styles['footer']}>
                <Button label={'Add URL'} className={styles['add-url']} onClick={onAdd}>
                    <Icon name={'add'} className={styles['icon']} />
                    { t('ADD_URL') }
                </Button>
                <Button className={styles['reload']} title={'Reload'} onClick={actions.onReload}>
                    <Icon name={'reset'} className={styles['icon']} />
                    <div className={styles['label']}>{t('RELOAD')}</div>
                </Button>
            </div>
        </div>
    );
};

export default URLsManager;
