// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import ModalDialog from 'stremio/components/ModalDialog';
import Button from 'stremio/components/Button';
import TextInput from 'stremio/components/TextInput';
import CatalogGroups from './CatalogGroups';
import CatalogTray from './CatalogTray';
import CatalogsEmpty from './CatalogsEmpty';
import { MAX_CATALOGS, type Nudge } from './useBoardSpotlight';
import styles from './CatalogPicker.less';

type Props = {
    catalogs: BoardCatalog[],
    empty: boolean,
    picks: BoardCatalog[],
    isDefault: boolean,
    nudge: Nudge | null,
    onToggle: (catalog: BoardCatalog) => void,
    onRemove: (catalog: BoardCatalog) => void,
    onReset: () => void,
    onClose: () => void,
};

const CatalogPicker = ({ catalogs, empty, picks, isDefault, nudge, onToggle, onRemove, onReset, onClose }: Props) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');

    return (
        <ModalDialog className={styles['picker']} onCloseRequest={onClose}>
            <div className={styles['header']}>
                <div className={styles['title']}>{t('SETTINGS_SPOTLIGHT_CATALOGS_TITLE')}</div>
                <Button className={styles['reset']} disabled={isDefault} onClick={onReset}>
                    {t('SETTINGS_SPOTLIGHT_USE_DEFAULT')}
                </Button>
            </div>
            {
                empty ?
                    <CatalogsEmpty />
                    :
                    <React.Fragment>
                        <div className={styles['intro']}>
                            <p className={styles['description']}>{t('SETTINGS_SPOTLIGHT_CATALOGS_DESCRIPTION')}</p>
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
                        <CatalogTray picks={picks} nudge={nudge} onRemove={onRemove} />
                        <CatalogGroups
                            className={styles['body']}
                            catalogs={catalogs}
                            query={query}
                            full={picks.length >= MAX_CATALOGS}
                            onToggle={onToggle}
                        />
                    </React.Fragment>
            }
        </ModalDialog>
    );
};

export default CatalogPicker;
