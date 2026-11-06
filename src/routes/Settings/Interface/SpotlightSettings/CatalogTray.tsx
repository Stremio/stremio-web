// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import useTranslate from 'stremio/common/useTranslate';
import { MAX_CATALOGS, type Nudge } from './useBoardSpotlight';
import styles from './CatalogTray.less';

type Props = {
    className?: string,
    compact?: boolean,
    picks: BoardCatalog[],
    nudge: Nudge | null,
    onRemove: (catalog: BoardCatalog) => void,
};

const CatalogTray = ({ className, compact = false, picks, nudge, onRemove }: Props) => {
    const { t } = useTranslation();
    const { catalogTitle } = useTranslate();
    const full = picks.length >= MAX_CATALOGS;
    const picked = t('SETTINGS_SPOTLIGHT_PICKED', { picked: picks.length, max: MAX_CATALOGS });
    const status = full ? `${picked} · ${t('SETTINGS_SPOTLIGHT_MAX_REACHED')}` : picked;

    return (
        <div className={classNames(className, styles['tray'], { [styles['compact']]: compact })}>
            <div className={styles['picks']} role={'list'} aria-label={t('SETTINGS_SPOTLIGHT_SELECTED')}>
                {
                    picks.map((pick, index) => {
                        const title = catalogTitle(pick) ?? pick.name;
                        return (
                            <div key={`${pick.request.base}/${pick.type}/${pick.id}`} className={classNames(styles['pick'], { [styles['solo']]: picks.length === 1 })} role={'listitem'}>
                                <div className={styles['number']}>{index + 1}</div>
                                <div className={styles['title']}>{title}</div>
                                {
                                    picks.length > 1 ?
                                        <Button className={styles['remove']} aria-label={t('SETTINGS_SPOTLIGHT_REMOVE', { name: title })} onClick={() => onRemove(pick)}>
                                            <Icon className={styles['icon']} name={'close'} />
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                        );
                    })
                }
            </div>
            <div
                key={nudge?.id}
                className={classNames(styles['status'], { [styles['full']]: full, [styles['nudge']]: nudge !== null })}
                role={'status'}
            >
                {nudge?.keepOne ? t('SETTINGS_SPOTLIGHT_KEEP_ONE') : status}
            </div>
        </div>
    );
};

export default CatalogTray;
