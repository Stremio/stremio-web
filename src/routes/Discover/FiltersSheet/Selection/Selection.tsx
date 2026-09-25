// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import TextInput from 'stremio/components/TextInput';
import Overview from './Overview';
import Choices from './Choices';
import { Input } from '../types';
import styles from './Selection.less';

const SEARCHABLE_OPTIONS_COUNT = 8;

type Props = {
    inputs: Input[];
    onCloseRequest: () => void;
};

const Selection = ({ inputs, onCloseRequest }: Props) => {
    const { t } = useTranslation();
    const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const headingRef = useRef<HTMLDivElement>(null);
    const activeFilter = inputs.find(({ id }) => id === activeFilterId) ?? null;

    const openFilter = useCallback((id: string | null) => {
        headingRef.current?.focus({ preventScroll: true });
        setSearch('');
        setActiveFilterId(id);
    }, []);
    const onBackClick = useCallback(() => openFilter(null), [openFilter]);
    const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }, []);
    const onOptionSelect = useCallback((value: string) => {
        openFilter(null);
        if (activeFilter !== null && value !== activeFilter.value) {
            activeFilter.onSelect(value);
        }
    }, [activeFilter, openFilter]);

    return (
        <div className={styles['selection']}>
            <div className={styles['header']}>
                {
                    activeFilter === null ?
                        <Icon className={styles['heading-icon']} name={'filters'} />
                        :
                        null
                }
                <div ref={headingRef} className={styles['heading']} tabIndex={-1}>
                    {
                        activeFilter !== null ?
                            <button
                                type={'button'}
                                className={styles['back-button']}
                                aria-label={`${t('BACK')}: ${activeFilter.label}`}
                                onClick={onBackClick}
                            >
                                <span className={styles['back-icon']}>
                                    <Icon name={'chevron-back'} />
                                </span>
                                <span className={styles['back-label']}>{activeFilter.label}</span>
                            </button>
                            :
                            t('FILTERS')
                    }
                </div>
            </div>
            {
                activeFilter !== null && activeFilter.options.length > SEARCHABLE_OPTIONS_COUNT ?
                    <div className={styles['search']}>
                        <Icon name={'search'} />
                        <TextInput
                            type={'search'}
                            value={search}
                            placeholder={t('SEARCH')}
                            aria-label={`${t('SEARCH')}: ${activeFilter.label}`}
                            onChange={onSearchChange}
                        />
                    </div>
                    :
                    null
            }
            <div key={activeFilter?.id ?? 'overview'} className={styles['body']}>
                {
                    activeFilter !== null ?
                        <Choices filter={activeFilter} query={search} onSelect={onOptionSelect} />
                        :
                        <Overview inputs={inputs} onFilterClick={openFilter} />
                }
            </div>
            <div className={styles['footer']}>
                <button type={'button'} className={styles['done']} onClick={onCloseRequest}>
                    {t('DONE')}
                </button>
            </div>
        </div>
    );
};

export default Selection;
