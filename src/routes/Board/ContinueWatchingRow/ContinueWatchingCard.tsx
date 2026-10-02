// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { toPath, useNavigateWithOrigin } from 'stremio-router';
import { useCore } from 'stremio/core';
import { Button, Image } from 'stremio/components';
import getMetaDetailsHref from 'stremio/common/getMetaDetailsHref';
import styles from './ContinueWatchingRow.less';

const IMDB_ID_REGEXP = /^tt\d+$/;

export type ContinueWatchingItem = {
    _id: string,
    name: string,
    type: string,
    poster: string | null,
    progress: number,
    notifications: number,
    deepLinks: LibraryItemDeepLinks,
    state: {
        videoId: string | null,
    },
};

type Props = {
    className?: string,
    item: ContinueWatchingItem,
};

// Video ids are `tt<id>:<season>:<episode>` for IMDb series and `kitsu:<id>:<episode>` for anime.
const getEpisodeLabel = (videoId: string | null | undefined) => {
    const parts = (videoId ?? '').split(':');
    if (parts.length !== 3 || !parts.slice(1).every((part) => /^\d+$/.test(part))) {
        return null;
    }

    const [prefix, season, episode] = parts;
    if (IMDB_ID_REGEXP.test(prefix)) {
        return `S${season}E${episode}`;
    }

    return prefix === 'kitsu' ? `E${episode}` : null;
};

const ContinueWatchingCard = ({ className, item }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const navigate = useNavigate();
    const { navigateWithOrigin } = useNavigateWithOrigin();

    const episodeLabel = useMemo(() => getEpisodeLabel(item.state?.videoId), [item.state]);
    const detailsHref = useMemo(() => getMetaDetailsHref(item.deepLinks), [item.deepLinks]);
    const playerHref = typeof item.deepLinks?.player === 'string' ? item.deepLinks.player : null;
    const progress = Math.min(Math.max(item.progress ?? 0, 0), 100);
    const newVideos = Math.min(Math.max(item.notifications ?? 0, 0), 99);

    const onClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && typeof detailsHref === 'string') {
            event.preventDefault();
            navigateWithOrigin(detailsHref);
        }
    }, [detailsHref, navigateWithOrigin]);

    const onPlayClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (playerHref !== null) {
            navigate(toPath(playerHref));
        }
    }, [playerHref, navigate]);

    const onDismissClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RewindLibraryItem',
                args: item._id
            }
        });
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'DismissNotificationItem',
                args: item._id
            }
        });
    }, [item._id, core.transport]);

    return (
        <Button className={classnames(className, styles['card'])} href={detailsHref ?? undefined} title={item.name} onClick={onClick}>
            <div className={styles['artwork']}>
                <Image className={styles['backdrop']} src={item.poster ?? undefined} alt={' '} />
                <Image className={styles['poster']} src={item.poster ?? undefined} alt={' '} />
                <div className={styles['artwork-shade']} />
                {
                    newVideos > 0 ?
                        <div className={styles['new-videos']}>
                            <Icon className={styles['new-videos-icon']} name={'add'} />
                            {newVideos}
                        </div>
                        :
                        null
                }
                <div className={styles['dismiss']} title={t('LIBRARY_RESUME_DISMISS')} onClick={onDismissClick}>
                    <Icon className={styles['dismiss-icon']} name={'close'} />
                </div>
                {
                    playerHref !== null && progress > 0 ?
                        <div className={styles['play']} title={t('CONTINUE_WATCHING')} onClick={onPlayClick}>
                            <Icon className={styles['play-icon']} name={'play'} />
                        </div>
                        :
                        null
                }
                {
                    episodeLabel !== null ?
                        <div className={styles['episode']}>{episodeLabel}</div>
                        :
                        null
                }
                {
                    progress > 0 ?
                        <div className={styles['progress']}>
                            <div className={styles['progress-bar']} style={{ width: `${progress}%` }} />
                        </div>
                        :
                        null
                }
            </div>
            <div className={styles['name']}>{item.name}</div>
        </Button>
    );
};

export default ContinueWatchingCard;
