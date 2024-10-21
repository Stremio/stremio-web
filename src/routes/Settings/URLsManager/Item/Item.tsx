// Copyright (C) 2017-2024 Smart code 203358507

import React, { useState, useCallback, ChangeEvent } from 'react';
import { useProfile } from 'stremio/common';
import Button from 'stremio/common/Button';
import useStreamingServer from 'stremio/common/useStreamingServer';
import TextInput from 'stremio/common/TextInput';
import Icon from '@stremio/stremio-icons/react';
import styles from './Item.less';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Checkbox from 'stremio/common/Checkbox';

type ViewModeProps = {
    url: string;
    onDelete?: (url: string) => void;
    onSelect?: (url: string) => void;
}

const ViewMode = ({ url, onDelete, onSelect }: ViewModeProps) => {
    const { t } = useTranslation();
    const streamingServer = useStreamingServer();
    const profile = useProfile();
    const selected = profile.settings.streamingServerUrl === url;

    const handleDelete = () => {
        onDelete?.(url);
    };

    const handleSelect = () => {
        onSelect?.(url);
    };

    return (
        <>
            <div className={styles['content']}>
                <Checkbox value={selected} onChange={handleSelect} />
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
                <Button className={styles['delete']} onClick={handleDelete}>
                    <Icon name={'close'} className={styles['icon']} />
                </Button>
            </div>
        </>
    );
};

type AddModeProps = {
    inputValue: string;
    handleValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onAdd?: (url: string) => void;
    onCancel?: () => void;
}

const AddMode = ({ inputValue, handleValueChange, onAdd, onCancel }: AddModeProps) => {
    const handleAdd = () => {
        if (inputValue.trim()) {
            onAdd?.(inputValue);
        }
    };

    return (
        <>
            <TextInput
                className={styles['input']}
                value={inputValue}
                onChange={handleValueChange}
            />
            <div className={styles['actions']}>
                <Button className={styles['add']} onClick={handleAdd}>
                    <Icon name={'checkmark'} className={styles['icon']} />
                </Button>
                <Button className={styles['cancel']} onClick={onCancel}>
                    <Icon name={'close'} className={styles['icon']} />
                </Button>
            </div>
        </>
    );
};

type Props =
    | {
        mode: 'add';
        onAdd?: (url: string) => void;
        onCancel?: () => void;
    }
    | {
        mode: 'view';
        url: string;
        onDelete?: (url: string) => void;
        onSelect?: (url: string) => void;
    };

const Item = (props: Props) => {
    if (props.mode === 'add') {
        const { onAdd, onCancel } = props;

        const [inputValue, setInputValue] = useState('');

        const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            setInputValue(event.target.value);
        }, []);

        return (
            <div className={classNames(styles['item'], styles['add'])}>
                <AddMode
                    inputValue={inputValue}
                    handleValueChange={handleValueChange}
                    onAdd={onAdd}
                    onCancel={onCancel}
                />
            </div>
        );
    } else if (props.mode === 'view') {
        const { url, onDelete, onSelect } = props;

        return (
            <div className={classNames(styles['item'])}>
                <ViewMode url={url} onDelete={onDelete} onSelect={onSelect} />
            </div>
        );
    }
};

export default Item;

