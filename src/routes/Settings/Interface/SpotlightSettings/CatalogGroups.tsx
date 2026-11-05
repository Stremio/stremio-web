// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import useTranslate from 'stremio/common/useTranslate';
import CatalogCard from './CatalogCard';
import styles from './CatalogGroups.less';

type Props = {
    className?: string,
    compact?: boolean,
    catalogs: BoardCatalog[],
    query: string,
    onSelect: (catalog: BoardCatalog) => void,
};

type Group = {
    id: string,
    name: string,
    catalogs: { catalog: BoardCatalog, title: string }[],
};

const CatalogGroups = ({ className, compact = false, catalogs, query, onSelect }: Props) => {
    const { t } = useTranslation();
    const { catalogTitle } = useTranslate();

    const groups = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();
        return catalogs.reduce<Group[]>((groups, catalog) => {
            const title = catalogTitle(catalog) ?? catalog.name;
            const addonName = catalog.addon.manifest.name;
            if (!`${title} ${addonName}`.toLocaleLowerCase().includes(normalizedQuery)) {
                return groups;
            }

            const group = groups.find(({ id }) => id === catalog.addon.manifest.id);
            if (group) {
                group.catalogs.push({ catalog, title });
            } else {
                groups.push({ id: catalog.addon.manifest.id, name: addonName, catalogs: [{ catalog, title }] });
            }

            return groups;
        }, []);
    }, [catalogs, query, catalogTitle]);

    return (
        <div className={classNames(className, styles['groups'], { [styles['compact']]: compact })}>
            {
                groups.map((group) => (
                    <div key={group.id} className={styles['group']}>
                        <div className={styles['heading']}>
                            <Icon className={styles['icon']} name={'addons'} />
                            <div className={styles['addon']}>{group.name}</div>
                            <div className={styles['count']}>{t('SETTINGS_SPOTLIGHT_CATALOGS', { count: group.catalogs.length })}</div>
                        </div>
                        <div className={styles['grid']} role={'listbox'} aria-label={group.name}>
                            {
                                group.catalogs.map(({ catalog, title }) => (
                                    <CatalogCard
                                        key={`${catalog.type}/${catalog.id}`}
                                        catalog={catalog}
                                        title={title}
                                        onSelect={onSelect}
                                    />
                                ))
                            }
                        </div>
                    </div>
                ))
            }
            {
                groups.length === 0 ?
                    <div className={styles['empty']} role={'status'}>{t('SEARCH_NO_RESULTS')}</div>
                    :
                    null
            }
        </div>
    );
};

export default CatalogGroups;
