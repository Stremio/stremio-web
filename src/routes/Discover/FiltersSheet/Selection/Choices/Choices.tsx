// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import RadioButton from 'stremio/components/RadioButton';
import { Input, Option } from '../../types';
import styles from './Choices.less';

type Props = {
    filter: Input;
    query: string;
    onSelect: (value: string) => void;
};

const Choices = ({ filter, query, onSelect }: Props) => {
    const { t } = useTranslation();
    const optionLabel = (option: Option) => option.default ? t('ALL') : option.label;
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const options = filter.options.filter((option) => {
        return `${optionLabel(option)} ${option.description ?? ''}`.toLocaleLowerCase().includes(normalizedQuery);
    });

    return (
        <div className={styles['choices']} role={'radiogroup'} aria-label={filter.label}>
            {options.map((option) => (
                <RadioButton
                    key={option.value}
                    className={styles['choice']}
                    selected={option.value === filter.value}
                    ariaLabel={[optionLabel(option), option.description].filter(Boolean).join(' ')}
                    onChange={() => onSelect(option.value)}
                    label={
                        <span className={styles['choice-copy']}>
                            <span>{optionLabel(option)}</span>
                            {
                                option.description ?
                                    <span className={styles['description']}>{option.description}</span>
                                    :
                                    null
                            }
                        </span>
                    }
                />
            ))}
            {
                options.length === 0 ?
                    <div className={styles['empty']} role={'status'}>
                        {t('SEARCH_NO_RESULTS')}
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default Choices;
