// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import { Button } from 'stremio/components';
import styles from './Option.less';
import Icon from '@stremio/stremio-icons/react';
import useLanguageSorting from '../useLanguageSorting';
import interfaceLanguages from 'stremio/common/interfaceLanguages.json';

type Props = {
    option: MultiselectMenuOption;
    selectedValue?: any;
    onSelect: (value: any) => void;
};

const Option = forwardRef<HTMLButtonElement, Props>(({ option, selectedValue, onSelect }, ref) => {
    const { userLangCode } = useLanguageSorting();

    const selected = useMemo(() => option?.value === selectedValue, [option, selectedValue]);

    const separator = useMemo(() => {
        const lang = interfaceLanguages.find((l) => l.name === option?.label);
        return lang ? userLangCode.some((code) => lang.codes.includes(code)) : false;
    }, [option, userLangCode]);

    const handleClick = useCallback(() => {
        onSelect(option.value);
    }, [onSelect, option.value]);

    return (
        <Button
            ref={ref}
            className={classNames(styles['option'], { [styles['selected']]: selected }, { [styles['separator']]: separator })}
            key={option.id}
            onClick={handleClick}
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
                    <Icon name={'caret-right'} className={styles['option-caret']} />
                    : null
            }
        </Button>
    );
});

Option.displayName = 'Option';

export default Option;
