// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import useTranslate from 'stremio/common/useTranslate';
import styles from './PreviewCard.less';

type Props = {
    className?: string,
    catalog: BoardCatalog | null,
    expanded: boolean,
    tabIndex?: number,
    onClick: () => void,
};

const renderNothing = () => null;

const PreviewCard = ({ className, catalog, expanded, tabIndex, onClick }: Props) => {
    const { t } = useTranslation();
    const { catalogTitle } = useTranslate();
    const title = catalog !== null ? catalogTitle(catalog) ?? catalog.name : '';
    const addonName = catalog?.addon.manifest.name ?? '';
    const loaded = catalog !== null && catalog.content !== null && catalog.content.type !== 'Loading';
    const preview = catalog?.content?.type === 'Ready' ? catalog.content.content : null;

    return (
        <Button
            className={classNames(className, styles['card'])}
            tabIndex={tabIndex}
            aria-label={`${t('SETTINGS_SPOTLIGHT_CATALOG')}: ${title}, ${addonName}`}
            aria-haspopup={'dialog'}
            aria-expanded={expanded}
            onClick={onClick}
        >
            {
                preview !== null ?
                    <Image className={styles['background']} src={preview.background} alt={''} renderFallback={renderNothing} />
                    :
                    null
            }
            <div className={styles['scrim']} />
            {
                loaded ?
                    <div className={styles['count']}>{t('SETTINGS_SPOTLIGHT_TITLES', { count: preview?.count ?? 0 })}</div>
                    :
                    null
            }
            <div className={styles['caption']}>
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
                <div className={styles['line']}>
                    <div className={styles['name']}>
                        {title}
                        <span className={styles['addon']}>{addonName}</span>
                    </div>
                    <div className={styles['pager']} aria-hidden={'true'}>
                        {
                            Array.from({ length: preview?.count ?? 0 }, (_, index) => (
                                <div key={index} className={classNames(styles['dot'], { [styles['on']]: index === 0 })} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </Button>
    );
};

export default PreviewCard;
