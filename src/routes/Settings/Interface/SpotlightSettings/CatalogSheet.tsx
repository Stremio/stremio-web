// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import BottomSheet from 'stremio/components/BottomSheet';
import Button from 'stremio/components/Button';
import TextInput from 'stremio/components/TextInput';
import CatalogGroups from './CatalogGroups';
import CatalogTray from './CatalogTray';
import CatalogsEmpty from './CatalogsEmpty';
import { MAX_CATALOGS, type Nudge } from './useBoardSpotlight';
import useInitialFocus from './useInitialFocus';
import styles from './CatalogSheet.less';

type Props = {
    show: boolean,
    catalogs: BoardCatalog[],
    empty: boolean,
    picks: BoardCatalog[],
    isDefault: boolean,
    nudge: Nudge | null,
    onToggle: (catalog: BoardCatalog) => void,
    onRemove: (catalog: BoardCatalog) => void,
    onReset: () => void,
    onClose: () => void,
    onExited: () => void,
};

const CatalogSheet = ({ show, catalogs, empty, picks, isDefault, nudge, onToggle, onRemove, onReset, onClose, onExited }: Props) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const selectionRef = useInitialFocus(show, empty || catalogs.length > 0);

    return (
        <BottomSheet
            className={styles['sheet']}
            show={show}
            onCloseRequest={onClose}
            onExited={() => {
                setQuery('');
                onExited();
            }}
            closeOnContentClick={false}
            closeOnOrientationChange={false}
            flush={true}
            ariaLabel={t('SETTINGS_SPOTLIGHT_CATALOGS_TITLE')}
        >
            <div ref={selectionRef} className={styles['selection']}>
                <div className={styles['header']}>
                    <Icon className={styles['heading-icon']} name={'home'} />
                    <div className={styles['heading']}>{t('SETTINGS_SPOTLIGHT_CATALOGS_TITLE')}</div>
                    {
                        !isDefault ?
                            <Button className={styles['reset']} onClick={onReset}>
                                {t('SETTINGS_SPOTLIGHT_USE_DEFAULT')}
                            </Button>
                            :
                            null
                    }
                </div>
                {
                    empty ?
                        <CatalogsEmpty />
                        :
                        <React.Fragment>
                            <p className={styles['description']}>{t('SETTINGS_SPOTLIGHT_CATALOGS_DESCRIPTION')}</p>
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
                            <CatalogTray compact={true} picks={picks} nudge={nudge} onRemove={onRemove} />
                            <CatalogGroups
                                className={styles['body']}
                                compact={true}
                                catalogs={catalogs}
                                query={query}
                                full={picks.length >= MAX_CATALOGS}
                                onToggle={onToggle}
                            />
                        </React.Fragment>
                }
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
