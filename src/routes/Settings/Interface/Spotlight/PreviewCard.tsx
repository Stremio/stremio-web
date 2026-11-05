// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import useTranslate from 'stremio/common/useTranslate';
import useCatalogPreview from './useCatalogPreview';
import styles from './PreviewCard.less';

type Props = {
    className?: string,
    catalog: BoardCatalog | null,
    expanded: boolean,
    onClick: () => void,
};

const renderNothing = () => null;

const PreviewCard = ({ className, catalog, expanded, onClick }: Props) => {
    const { t } = useTranslation();
    const { catalogTitle } = useTranslate();
    const preview = useCatalogPreview(catalog?.request ?? null);
    const title = catalog !== null ? catalogTitle(catalog) ?? catalog.name : '';
    const addonName = catalog?.addon.manifest.name ?? '';

    return (
        <Button
            className={classNames(className, styles['card'])}
            aria-label={`${t('SETTINGS_SPOTLIGHT_CATALOG')}: ${title}, ${addonName}`}
            aria-haspopup={'dialog'}
            aria-expanded={expanded}
            onClick={onClick}
        >
            {
                preview ?
                    <Image className={styles['background']} src={preview.background} alt={''} renderFallback={renderNothing} />
                    :
                    null
            }
            <div className={styles['scrim']} />
            {
                preview !== undefined ?
                    <div className={styles['count']}>{t('SETTINGS_SPOTLIGHT_TITLES', { count: preview?.count ?? 0 })}</div>
                    :
                    null
            }
            <div className={styles['caption']}>
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
                <div className={styles['line']}>
                    <div className={styles['name']}>
                        {title}
                        <span className={styles['addon']}>{addonName}</span>
                    </div>
                    <div className={styles['pager']} aria-hidden={'true'}>
                        {
                            Array.from({ length: preview?.count ?? 0 }, (_, index) => (
                                <i key={index} className={classNames({ [styles['on']]: index === 0 })} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </Button>
    );
};

export default PreviewCard;
