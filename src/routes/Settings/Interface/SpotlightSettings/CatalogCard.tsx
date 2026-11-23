// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import styles from './CatalogCard.less';

type Props = {
    catalog: BoardCatalog,
    title: string,
    full: boolean,
    onToggle: (catalog: BoardCatalog) => void,
};

const renderNothing = () => null;

const CatalogCard = ({ catalog, title, full, onToggle }: Props) => {
    const { t } = useTranslation();
    const selected = catalog.selected !== null;
    const dimmed = full && !selected;
    const preview = catalog.content?.type === 'Ready' ? catalog.content.content : null;

    return (
        <Button
            className={classNames(styles['card'], { [styles['selected']]: selected, [styles['dimmed']]: dimmed })}
            role={'option'}
            aria-selected={selected}
            aria-disabled={dimmed}
            title={title}
            onClick={() => onToggle(catalog)}
        >
            <div className={styles['art']}>
                {
                    preview !== null ?
                        <Image className={styles['background']} src={preview.background} alt={''} renderFallback={renderNothing} />
                        :
                        null
                }
                <div className={styles['scrim']} />
                {
                    catalog.default ?
                        <div className={styles['tag']}>{t('DEFAULT')}</div>
                        :
                        null
                }
                {
                    preview !== null ?
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
                    {catalog.selected !== null ? catalog.selected + 1 : null}
                </div>
            </div>
            <div className={styles['caption']}>
                <div className={styles['name']}>{title}</div>
                {
                    catalog.content?.type === 'Ready' ?
                        <div className={styles['meta']}>
                            {preview !== null ? t('SETTINGS_SPOTLIGHT_TITLES', { count: preview.count }) : t('SETTINGS_SPOTLIGHT_NO_ARTWORK')}
                        </div>
                        :
                        null
                }
            </div>
        </Button>
    );
};

export default CatalogCard;
