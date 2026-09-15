// Copyright (C) 2017-2026 Smart code 203358507

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import BottomSheet from 'stremio/components/BottomSheet';
import TextInput from 'stremio/components/TextInput';
import styles from './DiscoverFiltersSheet.less';

type FilterOption = {
    value: string;
    label: string;
    description?: string;
    default?: boolean;
};

type FilterInput = {
    id: string;
    label: string;
    options: FilterOption[];
    value?: string;
    active?: boolean;
    onSelect: (value: string) => void;
};

type Props = {
    inputs: FilterInput[];
    show: boolean;
    onCloseRequest: () => void;
};

const FilterSelection = ({ inputs, onCloseRequest }: Omit<Props, 'show'>) => {
    const { t } = useTranslation();
    const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const headingRef = useRef<HTMLHeadingElement>(null);
    const activeFilter = inputs.find(({ id }) => id === activeFilterId);
    const optionLabel = (option: FilterOption) => option.default ? t('ALL') : option.label;
    const query = search.trim().toLocaleLowerCase();
    const options = activeFilter?.options.filter((option) =>
        `${optionLabel(option)} ${option.description ?? ''}`.toLocaleLowerCase().includes(query)
    ) ?? [];
    const openFilter = (id: string | null) => {
        headingRef.current?.focus({ preventScroll: true });
        setSearch('');
        setActiveFilterId(id);
    };

    return <div className={styles['filter-selection']}>
        <header className={styles.header}>
            {activeFilter ? <button
                type={'button'}
                className={styles['icon-button']}
                aria-label={t('BACK')}
                onClick={() => openFilter(null)}
            ><Icon name={'chevron-back'} /></button> : <Icon className={styles['heading-icon']} name={'filters'} />}
            <h2 ref={headingRef} tabIndex={-1}>{activeFilter?.label ?? t('FILTERS')}</h2>
        </header>
        {activeFilter && activeFilter.options.length > 8 && <div className={styles.search}>
            <Icon name={'search'} />
            <TextInput
                type={'search'}
                value={search}
                placeholder={t('SEARCH')}
                aria-label={`${t('SEARCH')}: ${activeFilter.label}`}
                onChange={(event) => setSearch(event.target.value)}
            />
        </div>}
        <div key={activeFilter?.id ?? 'overview'} className={styles.body}>
            {activeFilter ? <div className={styles.choices} aria-label={activeFilter.label}>
                {options.map((option) => <button
                    key={option.value}
                    type={'button'}
                    className={classNames(styles.choice, { [styles.selected]: option.value === activeFilter.value })}
                    aria-pressed={option.value === activeFilter.value}
                    onClick={() => {
                        openFilter(null);
                        if (option.value !== activeFilter.value) activeFilter.onSelect(option.value);
                    }}
                >
                    <span className={styles['choice-copy']}>
                        <span>{optionLabel(option)}</span>
                        {option.description && <span className={styles.description}>{option.description}</span>}
                    </span>
                    <span className={styles.radio} aria-hidden={true} />
                </button>)}
                {options.length === 0 && <div className={styles.empty} role={'status'}>{t('SEARCH_NO_RESULTS')}</div>}
            </div> : <div className={styles.overview}>
                {[inputs.slice(0, 2), inputs.slice(2)].filter((group) => group.length > 0).map((group) => <div key={group[0].id} className={styles.group}>
                    {group.map((input) => {
                        const selected = input.options.find(({ value }) => value === input.value);
                        return <button
                            key={input.id}
                            type={'button'}
                            className={styles['filter-row']}
                            disabled={input.options.length === 0}
                            onClick={() => openFilter(input.id)}
                        >
                            <span className={styles['row-copy']}>
                                <span className={styles['filter-label']}>{input.label}</span>
                                <span className={classNames(styles.value, { [styles.active]: input.active })}>{selected ? optionLabel(selected) : t('NONE')}</span>
                                {selected?.description && <span className={styles.description}>{selected.description}</span>}
                            </span>
                            <Icon name={'chevron-forward'} />
                        </button>;
                    })}
                </div>)}
            </div>}
        </div>
        <footer className={styles.footer}>
            <button type={'button'} className={styles.done} onClick={onCloseRequest}>{t('DONE')}</button>
        </footer>
    </div>;
};

const DiscoverFiltersSheet = ({ inputs, show, onCloseRequest }: Props) => {
    const { t } = useTranslation();
    return <BottomSheet
        className={styles.sheet}
        show={show}
        onCloseRequest={onCloseRequest}
        closeOnContentClick={false}
        closeOnOrientationChange={false}
        flush={true}
        ariaLabel={t('CATALOG_FILTERS')}
    >
        <FilterSelection inputs={inputs} onCloseRequest={onCloseRequest} />
    </BottomSheet>;
};

export default DiscoverFiltersSheet;
