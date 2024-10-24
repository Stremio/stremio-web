// Copyright (C) 2017-2024 Smart code 203358507

import React, { ChangeEvent, useCallback, useState } from 'react';
import Button from 'stremio/common/Button';
import Icon from '@stremio/stremio-icons/react';
import TextInput from 'stremio/common/TextInput';
import styles from './AddItem.less';

type Props = {
    onCancel: () => void;
    handleAddUrl: (url: string) => void;
};

const AddItem = ({ onCancel, handleAddUrl }: Props) => {
    const [inputValue, setInputValue] = useState('');

    const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }, []);

    const onSumbit = useCallback(() => {
        handleAddUrl(inputValue);
    }, [inputValue]);

    return (
        <div className={styles['add-item']}>
            <TextInput
                className={styles['input']}
                value={inputValue}
                onChange={handleValueChange}
                onSubmit={onSumbit}
                placeholder={'Enter URL'}
            />
            <div className={styles['actions']}>
                <Button className={styles['add']} onClick={onSumbit}>
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
