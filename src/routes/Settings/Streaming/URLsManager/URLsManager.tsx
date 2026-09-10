// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './URLsManager.less';
import { Button } from 'stremio/components';
import Item from './Item';
import AddItem from './AddItem';
import Icon from '@stremio/stremio-icons/react';
import useStreamingServerUrls from './useStreamingServerUrls';

type Props = {
    selectedUrl: string;
    settings: StreamingServer['settings'];
};

const URLsManager = ({ selectedUrl, settings }: Props) => {
    const { t } = useTranslation();
    const [addMode, setAddMode] = useState(false);
    const { streamingServerUrls, addServerUrl, deleteServerUrl, selectServerUrl, reloadServer } = useStreamingServerUrls();

    const onAdd = () => {
        setAddMode(true);
    };

    const onCancel = () => {
        setAddMode(false);
    };

    const handleAddUrl = useCallback((url: string) => {
        addServerUrl(url);
        setAddMode(false);
    }, []);

    return (
        <div className={styles['wrapper']}>
            <div className={styles['header']}>
                <div className={styles['label']}>{t('URL')}</div>
                <div className={styles['label']}>{t('STATUS')}</div>
            </div>
            <div className={styles['content']}>
                {
                    streamingServerUrls.map((item: StreamingServerUrl) => (
                        <Item
                            key={item.url}
                            url={item.url}
                            selected={item.url === selectedUrl}
                            settings={settings}
                            deleteServerUrl={deleteServerUrl}
                            selectServerUrl={selectServerUrl}
                        />
                    ))
                }
                {
                    addMode ?
                        <AddItem onCancel={onCancel} handleAddUrl={handleAddUrl} />
                        : null
                }
            </div>
            <div className={styles['footer']}>
                <Button title={t('SETTINGS_SERVER_ADD_URL')} className={styles['add-url']} onClick={onAdd}>
                    <Icon name={'add'} className={styles['icon']} />
                    {t('SETTINGS_SERVER_ADD_URL')}
                </Button>
                <Button className={styles['reload']} title={t('RELOAD')} onClick={reloadServer}>
                    <Icon name={'reset'} className={styles['icon']} />
                    <div className={styles['label']}>{t('RELOAD')}</div>
                </Button>
            </div>
        </div>
    );
};

export default URLsManager;
