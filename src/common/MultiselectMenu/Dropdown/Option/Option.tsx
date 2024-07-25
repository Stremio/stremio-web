// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import classNames from 'classnames';
import Button from 'stremio/common/Button';
import styles from './Option.less';
import Icon from '@stremio/stremio-icons/react';

type Props = {
    option: MultiselectMenuOption;
    selectedOption?: MultiselectMenuOption | null;
    onSelect: (value: string) => void;
};

const Option = ({ option, selectedOption, onSelect }: Props) => {
    // consider using option.id === selectedOption?.id instead
    const selected = useMemo(() => option?.value === selectedOption?.value, [option, selectedOption]);

    return (
        <Button
            className={classNames(styles['option'], { [styles['selected']]: selected })}
            key={option.id}
            onClick={() => onSelect(option.value)}
            aria-selected={selected}
        >
            <div className={styles['label']}>{ option.label }</div>
            {
                selected && !option.level ?
                <div className={styles['icon']} />
                    : null

            }
            {
                option.level ?
                    <Icon name={'chevron-right'} className={styles['option-chevron']} />
                    : null
            }
        </Button>
    );
};

export default Option;