// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import BottomSheet from 'stremio/components/BottomSheet';
import TextInput from 'stremio/components/TextInput';
import CatalogGroups from './CatalogGroups';
import styles from './CatalogSheet.less';

type Props = {
    show: boolean,
    catalogs: BoardCatalog[],
    isDefault: boolean,
    onSelect: (catalog: BoardCatalog | null) => void,
    onClose: () => void,
};

const CatalogSheet = ({ show, catalogs, isDefault, onSelect, onClose }: Props) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');

    const onQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, []);
    const onUseDefault = useCallback(() => onSelect(null), [onSelect]);
    const onExited = useCallback(() => setQuery(''), []);

    return (
        <BottomSheet
            className={styles['sheet']}
            show={show}
            onCloseRequest={onClose}
            onExited={onExited}
            closeOnContentClick={false}
            closeOnOrientationChange={false}
            flush={true}
            ariaLabel={t('SETTINGS_SPOTLIGHT_CATALOG')}
        >
            <div className={styles['selection']}>
                <div className={styles['header']}>
                    <Icon className={styles['heading-icon']} name={'home'} />
                    <div className={styles['heading']}>{t('SETTINGS_SPOTLIGHT_CATALOG')}</div>
                    {
                        !isDefault ?
                            <button type={'button'} className={styles['reset']} onClick={onUseDefault}>
                                {t('SETTINGS_SPOTLIGHT_USE_DEFAULT')}
                            </button>
                            :
                            null
                    }
                </div>
                <p className={styles['description']}>{t('SETTINGS_SPOTLIGHT_CATALOG_DESCRIPTION')}</p>
                <div className={styles['search']}>
                    <Icon name={'search'} />
                    <TextInput
                        type={'search'}
                        value={query}
                        placeholder={t('SETTINGS_SPOTLIGHT_SEARCH')}
                        aria-label={t('SETTINGS_SPOTLIGHT_SEARCH')}
                        onChange={onQueryChange}
                    />
                </div>
                <CatalogGroups className={styles['body']} compact={true} catalogs={catalogs} query={query} onSelect={onSelect} />
                <div className={styles['footer']}>
                    <button type={'button'} className={styles['done']} onClick={onClose}>
                        {t('DONE')}
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
};

export default CatalogSheet;
