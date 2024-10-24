import React, { ChangeEvent, useCallback, useState } from 'react';
import Button from 'stremio/common/Button';
import Icon from '@stremio/stremio-icons/react';
import TextInput from 'stremio/common/TextInput';
import styles from './Item.less';
import classNames from 'classnames';

type Props = {
    onCancel: () => void
    handleAddUrl: (url: string) => void
};

const AddItem = ({ onCancel, handleAddUrl }: Props) => {

    const [inputValue, setInputValue] = useState('');

    const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }, []);

    const onSumbit = useCallback(() => {
        handleAddUrl?.(inputValue);
    }, [inputValue]);

    return (
        <div className={classNames(styles['item'], styles['add'])}>
            <TextInput
                className={styles['input']}
                value={inputValue}
                onChange={handleValueChange}
                onSubmit={onSumbit}
            />
            <div className={styles['actions']}>
                <Button className={styles['add']} onClick={handleAddUrl}>
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
