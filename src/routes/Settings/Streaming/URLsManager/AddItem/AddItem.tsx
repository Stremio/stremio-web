// Copyright (C) 2017-2024 Smart code 203358507

import React, { ChangeEvent, useCallback, useState } from 'react';
import Icon from '@stremio/stremio-icons/react';
import { Button, TextInput } from 'stremio/components';
import styles from './AddItem.less';

type Props = {
    onCancel: () => void;
    handleAddUrl: (url: string) => void;
};

const AddItem = ({ onCancel, handleAddUrl }: Props) => {
    const [inputValue, setInputValue] = useState('');

    const handleValueChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
        setInputValue(target.value);
    }, []);

    const onSubmit = useCallback(() => {
        handleAddUrl(inputValue);
    }, [inputValue]);

    return (
        <div className={styles['add-item']}>
            <TextInput
                className={styles['input']}
                value={inputValue}
                onChange={handleValueChange}
                onSubmit={onSubmit}
                placeholder={'Enter URL'}
            />
            <div className={styles['actions']}>
                <Button className={styles['add']} onClick={onSubmit}>
                    <Icon name={'checkmark'} className={styles['icon']} />
                </Button>
                <Button className={styles['cancel']} onClick={onCancel}>
                    <Icon name={'close'} className={styles['icon']} />
                </Button>
            </div>
        </div>
    );
};

export default AddItem;
