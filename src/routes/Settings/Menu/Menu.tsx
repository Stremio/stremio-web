// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { SearchField } from '../components';
import { PAGES } from '../constants';
import AccountRow from '../AccountRow';
import type { SettingsGroup } from '../useSettingsPages';
import styles from './Menu.less';

type Props = {
    groups: SettingsGroup[],
    profile: Profile,
    selected: string | null,
    query: string,
    onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onNavigate: () => void,
};

const Menu = ({ groups, profile, selected, query, onQueryChange, onNavigate }: Props) => {
    const { t } = useTranslation();

    return (
        <nav className={styles['menu']} aria-label={t('SETTINGS')}>
            <AccountRow profile={profile} selected={selected === PAGES.ACCOUNT} onClick={onNavigate} />
            <SearchField className={styles['search']} value={query} onChange={onQueryChange} />
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
                                    <Icon className={styles['icon']} name={page.icon} />
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
