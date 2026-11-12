// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import TextInput from 'stremio/components/TextInput';
import styles from './Search.less';

type Props = {
    className?: string,
    value: string,
    placeholder: string,
    onChange: (value: string) => void,
};

const Search = ({ className, value, placeholder, onChange }: Props) => {
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
    }, [onChange]);

    return (
        <label className={classNames(className, styles['search'])}>
            <TextInput
                className={styles['input']}
                type={'text'}
                value={value}
                placeholder={placeholder}
                aria-label={placeholder}
                onChange={handleChange}
            />
            <Icon className={styles['icon']} name={'search'} />
        </label>
    );
};

export default Search;
