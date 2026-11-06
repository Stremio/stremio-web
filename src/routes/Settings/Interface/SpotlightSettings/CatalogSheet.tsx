// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import BottomSheet from 'stremio/components/BottomSheet';
import Button from 'stremio/components/Button';
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

    return (
        <BottomSheet
            className={styles['sheet']}
            show={show}
            onCloseRequest={onClose}
            onExited={() => setQuery('')}
            closeOnContentClick={false}
            closeOnOrientationChange={false}
            flush={true}
            ariaLabel={t('SETTINGS_SPOTLIGHT_CATALOG')}
        >
            <div className={styles['selection']}>
                <div className={styles['header']}>
                    <Icon className={styles['heading-icon']} name={'home'} />
                    <div className={styles['heading']}>{t('SETTINGS_SPOTLIGHT_CATALOG')}</div>
                    <Button className={styles['reset']} disabled={isDefault} onClick={() => onSelect(null)}>
                        {t('SETTINGS_SPOTLIGHT_USE_DEFAULT')}
                    </Button>
                </div>
                <p className={styles['description']}>{t('SETTINGS_SPOTLIGHT_CATALOG_DESCRIPTION')}</p>
                <div className={styles['search']}>
                    <Icon name={'search'} />
                    <TextInput
                        type={'search'}
                        value={query}
                        placeholder={t('SETTINGS_SPOTLIGHT_SEARCH')}
                        aria-label={t('SETTINGS_SPOTLIGHT_SEARCH')}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>
                <CatalogGroups className={styles['body']} compact={true} catalogs={catalogs} query={query} onSelect={onSelect} />
                <div className={styles['footer']}>
                    <Button className={styles['done']} onClick={onClose}>
                        {t('DONE')}
                    </Button>
                </div>
            </div>
        </BottomSheet>
    );
};

export default CatalogSheet;
