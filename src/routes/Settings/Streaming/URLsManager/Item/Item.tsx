// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import { useProfile } from 'stremio/common';
import { DEFAULT_STREAMING_SERVER_URL } from 'stremio/common/CONSTANTS';
import { useTranslation } from 'react-i18next';
import { Button, RadioButton } from 'stremio/components';
import useStreamingServer from 'stremio/common/useStreamingServer';
import Icon from '@stremio/stremio-icons/react';
import styles from './Item.less';
import classNames from 'classnames';
import useStreamingServerUrls from '../useStreamingServerUrls';

type Props = {
    url: string;
};

const Item = ({ url }: Props) => {
    const { t } = useTranslation();
    const profile = useProfile();
    const streamingServer = useStreamingServer();
    const { deleteServerUrl, selectServerUrl } = useStreamingServerUrls();

    const selected = useMemo(() => profile.settings.streamingServerUrl === url, [url, profile.settings]);
    const defaultUrl = useMemo(() => url === DEFAULT_STREAMING_SERVER_URL, [url]);

    const handleDelete = useCallback(() => {
        deleteServerUrl(url);
        selected && selectServerUrl(DEFAULT_STREAMING_SERVER_URL);
    }, [url, selected]);

    const handleSelect = useCallback(() => {
        selectServerUrl(url);
    }, [url]);

    return (
        <div className={styles['item']}>
            <div className={styles['content']}>
                <RadioButton className={styles['selectable']} selected={selected} onChange={handleSelect} disabled={selected} />
                <div className={styles['label']}>{url}</div>
            </div>
            <div className={styles['actions']}>
                {
                    selected ?
                        <div className={styles['status']}>
                            <div className={classNames(styles['icon'], { [styles['ready']]: streamingServer.settings?.type === 'Ready' }, { [styles['error']]: streamingServer.settings?.type === 'Err' })} />
                            <div className={styles['label']}>
                                {
                                    streamingServer.settings === null ?
                                        'NotLoaded'
                                        :
                                        streamingServer.settings.type === 'Ready' ?
                                            t('SETTINGS_SERVER_STATUS_ONLINE')
                                            :
                                            streamingServer.settings.type === 'Err' ?
                                                t('SETTINGS_SERVER_STATUS_ERROR')
                                                :
                                                streamingServer.settings.type
                                }
                            </div>
                        </div>
                        : null
                }
                {
                    !defaultUrl ?
                        <Button className={styles['delete']} onClick={handleDelete}>
                            <Icon name={'bin'} className={styles['icon']} />
                        </Button>
                        : null
                }
            </div>
        </div>
    );
};

export default Item;
