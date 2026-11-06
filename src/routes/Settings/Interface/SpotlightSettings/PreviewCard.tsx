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
    empty: boolean,
    picks: BoardCatalog[],
    preview: BoardCatalogPreview | null,
    expanded: boolean,
    tabIndex?: number,
    onClick: () => void,
};

const renderNothing = () => null;

const PreviewCard = ({ className, empty, picks, preview, expanded, tabIndex, onClick }: Props) => {
    const { t } = useTranslation();
    const { catalogTitle } = useTranslate();
    const titles = picks.map((pick) => catalogTitle(pick) ?? pick.name).join(', ');
    const addonName = picks.length === 1 ? picks[0].addon.manifest.name : null;
    const loaded = picks.length > 0 && picks.every(({ content }) => content !== null && content.type !== 'Loading');

    return (
        <Button
            className={classNames(className, styles['card'])}
            tabIndex={tabIndex}
            aria-label={`${t('SETTINGS_SPOTLIGHT_CATALOGS_TITLE')}: ${titles}`}
            aria-haspopup={'dialog'}
            aria-expanded={expanded}
            onClick={onClick}
        >
            {
                empty ?
                    <div className={styles['nothing']}>
                        <div className={styles['title']}>{t('SETTINGS_SPOTLIGHT_NOTHING_TO_SHOW')}</div>
                        <div>{t('SETTINGS_SPOTLIGHT_NOTHING_TO_SHOW_DESCRIPTION')}</div>
                    </div>
                    :
                    <React.Fragment>
                        {
                            preview !== null ?
                                <Image className={styles['background']} src={preview.background} alt={''} renderFallback={renderNothing} />
                                :
                                null
                        }
                        <div className={styles['scrim']} />
                        {
                            loaded ?
                                <div className={styles['count']}>
                                    {preview !== null ? t('SETTINGS_SPOTLIGHT_TITLES', { count: preview.count }) : t('SETTINGS_SPOTLIGHT_NO_ARTWORK')}
                                </div>
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
                                    {titles}
                                    {
                                        addonName !== null ?
                                            <span className={styles['addon']}>{addonName}</span>
                                            :
                                            null
                                    }
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
                    </React.Fragment>
            }
        </Button>
    );
};

export default PreviewCard;
