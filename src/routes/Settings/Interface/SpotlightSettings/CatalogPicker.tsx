// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import ModalDialog from 'stremio/components/ModalDialog';
import Button from 'stremio/components/Button';
import TextInput from 'stremio/components/TextInput';
import CatalogGroups from './CatalogGroups';
import styles from './CatalogPicker.less';

type Props = {
    catalogs: BoardCatalog[],
    isDefault: boolean,
    onSelect: (catalog: BoardCatalog | null) => void,
    onClose: () => void,
};

const CatalogPicker = ({ catalogs, isDefault, onSelect, onClose }: Props) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');

    return (
        <ModalDialog className={styles['picker']} onCloseRequest={onClose}>
            <div className={styles['header']}>
                <div className={styles['title']}>{t('SETTINGS_SPOTLIGHT_CATALOG')}</div>
                <Button className={styles['reset']} disabled={isDefault} onClick={() => onSelect(null)}>
                    {t('SETTINGS_SPOTLIGHT_USE_DEFAULT')}
                </Button>
            </div>
            <div className={styles['intro']}>
                <p className={styles['description']}>{t('SETTINGS_SPOTLIGHT_CATALOG_DESCRIPTION')}</p>
                <label className={styles['search']}>
                    <TextInput
                        className={styles['input']}
                        type={'search'}
                        value={query}
                        placeholder={t('SETTINGS_SPOTLIGHT_SEARCH')}
                        aria-label={t('SETTINGS_SPOTLIGHT_SEARCH')}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <Icon className={styles['icon']} name={'search'} />
                </label>
            </div>
            <CatalogGroups className={styles['body']} catalogs={catalogs} query={query} onSelect={onSelect} />
        </ModalDialog>
    );
};

export default CatalogPicker;
