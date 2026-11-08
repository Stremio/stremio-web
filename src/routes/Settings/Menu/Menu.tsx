// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button } from 'stremio/components';
import { PageIcon, SearchField } from '../components';
import type { SettingsGroup } from '../useSettingsPages';
import styles from './Menu.less';

type Props = {
    groups: SettingsGroup[],
    selected: string | null,
    query: string,
    onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onNavigate: () => void,
};

const Menu = ({ groups, selected, query, onQueryChange, onNavigate }: Props) => {
    const { t } = useTranslation();

    return (
        <nav className={styles['menu']} aria-label={t('SETTINGS')}>
            <SearchField value={query} onChange={onQueryChange} />
            {
                groups.map((group) => (
                    <div key={group.id} className={styles['group']}>
                        <div className={styles['label']}>{group.label}</div>
                        {
                            group.pages.map((page) => (
                                <Button
                                    key={page.id}
                                    className={classNames(styles['item'], { [styles['selected']]: page.id === selected })}
                                    href={`#/settings/${page.id}`}
                                    title={page.label}
                                    aria-current={page.id === selected ? 'page' : undefined}
                                    onClick={onNavigate}
                                >
                                    <PageIcon className={styles['icon']} name={page.icon} />
                                    <div className={styles['item-label']}>{page.label}</div>
                                </Button>
                            ))
                        }
                    </div>
                ))
            }
        </nav>
    );
};

export default Menu;
