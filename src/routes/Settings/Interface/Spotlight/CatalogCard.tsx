// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import useCatalogPreview from './useCatalogPreview';
import styles from './CatalogCard.less';

type Props = {
    catalog: BoardCatalog,
    title: string,
    isDefault: boolean,
    onSelect: (catalog: BoardCatalog) => void,
};

const renderNothing = () => null;

const CatalogCard = ({ catalog, title, isDefault, onSelect }: Props) => {
    const { t } = useTranslation();
    const preview = useCatalogPreview(catalog.request);

    const onClick = useCallback(() => onSelect(catalog), [catalog, onSelect]);

    return (
        <Button
            className={classNames(styles['card'], { [styles['selected']]: catalog.selected })}
            role={'option'}
            aria-selected={catalog.selected}
            title={title}
            onClick={onClick}
        >
            <div className={styles['art']}>
                {
                    preview ?
                        <Image className={styles['background']} src={preview.background} alt={''} renderFallback={renderNothing} />
                        :
                        null
                }
                <div className={styles['scrim']} />
                {
                    isDefault ?
                        <div className={styles['tag']}>{t('DEFAULT')}</div>
                        :
                        null
                }
                {
                    preview ?
                        <Image
                            className={styles['logo']}
                            src={preview.logo ?? undefined}
                            alt={preview.name}
                            renderFallback={() => <div className={styles['fallback']}>{preview.name}</div>}
                        />
                        :
                        null
                }
                <div className={styles['check']} aria-hidden={'true'}>
                    <Icon className={styles['icon']} name={'checkmark'} />
                </div>
            </div>
            <div className={styles['caption']}>
                <div className={styles['name']}>{title}</div>
                {
                    preview !== undefined ?
                        <div className={styles['meta']}>{t('SETTINGS_SPOTLIGHT_TITLES', { count: preview?.count ?? 0 })}</div>
                        :
                        null
                }
            </div>
        </Button>
    );
};

export default CatalogCard;
