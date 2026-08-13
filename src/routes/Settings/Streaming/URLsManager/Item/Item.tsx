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
    const serverReady = useMemo(() => streamingServer.state?.type === 'Ready' && streamingServer.state.content === 'running', [streamingServer.state]);
    const serverError = useMemo(() => streamingServer.state?.type === 'Err' || (streamingServer.state?.type === 'Ready' && streamingServer.state.content === 'notRunning'), [streamingServer.state]);

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
                            <div className={classNames(styles['icon'], { [styles['ready']]: serverReady }, { [styles['error']]: serverError })} />
                            <div className={styles['label']}>
                                {
                                    streamingServer.state === null ?
                                        'NotLoaded'
                                        :
                                        serverReady ?
                                            t('SETTINGS_SERVER_STATUS_ONLINE')
                                            :
                                            serverError ?
                                                t('SETTINGS_SERVER_STATUS_ERROR')
                                                :
                                                streamingServer.state.type
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
