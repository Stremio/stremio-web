// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Input } from '../../types';
import styles from './Overview.less';

const PRIMARY_INPUTS_COUNT = 2;

type Props = {
    inputs: Input[];
    onFilterClick: (id: string) => void;
};

const Overview = ({ inputs, onFilterClick }: Props) => {
    const { t } = useTranslation();
    const groups = [inputs.slice(0, PRIMARY_INPUTS_COUNT), inputs.slice(PRIMARY_INPUTS_COUNT)].filter((group) => group.length > 0);

    const onClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = event.currentTarget.dataset;
        if (typeof id === 'string') {
            onFilterClick(id);
        }
    }, [onFilterClick]);

    return (
        <div className={styles['overview']}>
            {groups.map((group) => (
                <div key={group[0].id} className={styles['group']}>
                    {group.map((input) => {
                        const selected = input.options.find(({ value }) => value === input.value);
                        return (
                            <button
                                key={input.id}
                                type={'button'}
                                className={styles['filter-row']}
                                disabled={input.options.length === 0}
                                data-id={input.id}
                                onClick={onClick}
                            >
                                <span className={styles['row-copy']}>
                                    <span className={styles['filter-label']}>{input.label}</span>
                                    <span className={classNames(styles['value'], { [styles['active']]: input.active })}>
                                        {selected ? (selected.default ? t('ALL') : selected.label) : t('NONE')}
                                    </span>
                                    {
                                        selected?.description ?
                                            <span className={styles['description']}>{selected.description}</span>
                                            :
                                            null
                                    }
                                </span>
                                <Icon name={'chevron-forward'} />
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Overview;
