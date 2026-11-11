// Copyright (C) 2017-2026 Smart code 203358507

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useProfile } from 'stremio/common';
import { getInterfaceRect } from 'stremio/common/interfaceScale';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import Popup from 'stremio/components/Popup';
import ProgressBar from 'stremio/components/ProgressBar';
import WatchedBadge from 'stremio/components/WatchedBadge';
import useRowMenu from '../useRowMenu';
import useEpisodeNavigation from '../useEpisodeNavigation';
import { formatDate, hidesSpoiler } from '../format';
import { getScrollParent } from './useScrollMemory';
import styles from './Video.less';

type Props = {
    video: Video,
    selected: boolean,
    seasonWatched: boolean,
    minutesLeft: number | null,
    onSelect: () => void,
    onMarkVideoWatched: (video: Pick<Video, 'id' | 'released'>, watched: boolean) => void,
    onMarkSeasonWatched: (season: number, watched: boolean) => void,
};

type LabelProps = React.ComponentProps<typeof Button> & {
    ref: React.Ref<HTMLDivElement>,
};

const renderThumbnailFallback = () => (
    <div className={styles['thumbnail-empty']}>
        <Icon className={styles['thumbnail-empty-icon']} name={'tv'} />
    </div>
);

const Video = ({ video, selected, seasonWatched, minutesLeft, onSelect, onMarkVideoWatched, onMarkSeasonWatched }: Props) => {
    const { t, i18n } = useTranslation();
    const profile = useProfile();
    const { openEpisode } = useEpisodeNavigation();
    const { open, closeMenu, labelProps, menuProps } = useRowMenu();
    const rowRef = useRef<HTMLDivElement>(null);

    const { id, title, thumbnail, season, episode, released, upcoming, watched, progress, scheduled, deepLinks } = video;
    const hasProgress = typeof progress === 'number' && progress > 0;
    const blurThumbnail = hidesSpoiler(video, profile.settings.hideSpoilers);
    const releasedLabel = formatDate(released, i18n.language);
    const shouldScroll = selected && (!watched || hasProgress);

    useEffect(() => {
        const row = rowRef.current;
        const scrollParent = shouldScroll ? getScrollParent(row) : null;
        if (!row || !scrollParent) {
            return;
        }

        const rowBounds = getInterfaceRect(row);
        const listBounds = getInterfaceRect(scrollParent);
        const offset = rowBounds.top < listBounds.top ?
            rowBounds.top - listBounds.top
            :
            Math.max(0, rowBounds.bottom - listBounds.bottom);
        if (offset !== 0) {
            scrollParent.scrollTo({ top: scrollParent.scrollTop + offset, behavior: 'smooth' });
        }
    }, [shouldScroll]);

    const handleClick = useCallback(() => {
        onSelect();
        openEpisode(deepLinks.metaDetailsStreams);
    }, [onSelect, openEpisode, deepLinks.metaDetailsStreams]);

    const handleWatchClick = useCallback((event: React.MouseEvent) => {
        closeMenu();
        if (deepLinks.player !== null) {
            event.stopPropagation();
            onSelect();
        }
    }, [closeMenu, onSelect, deepLinks.player]);

    const handleToggleWatched = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        closeMenu();
        onMarkVideoWatched({ id, released }, !watched);
    }, [closeMenu, onMarkVideoWatched, id, released, watched]);

    const handleToggleSeasonWatched = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        closeMenu();
        onMarkSeasonWatched(season!, !seasonWatched);
    }, [closeMenu, onMarkSeasonWatched, season, seasonWatched]);

    const renderLabel = useCallback(({ className, children, ref, ...props }: LabelProps) => (
        <Button
            {...props}
            ref={ref}
            className={classNames(className, styles['video'], { [styles['selected']]: selected, [styles['watched']]: watched })}
            title={title}
        >
            <div className={styles['thumbnail']}>
                <Image
                    className={classNames(styles['image'], { [styles['blurred']]: blurThumbnail })}
                    src={thumbnail ?? undefined}
                    alt={''}
                    renderFallback={renderThumbnailFallback}
                />
                {
                    watched ?
                        <WatchedBadge className={styles['watched-badge']} />
                        :
                        null
                }
                {
                    hasProgress ?
                        <ProgressBar className={styles['progress']} value={progress} />
                        :
                        null
                }
            </div>
            <div className={styles['info']}>
                <div className={styles['title']}>
                    {typeof episode === 'number' ? `${episode}. ` : null}
                    {title.length > 0 ? title : id}
                </div>
                <div className={styles['meta']}>
                    {
                        releasedLabel !== null ?
                            <span>{releasedLabel}</span>
                            :
                            scheduled ?
                                <span>{t('TBA')}</span>
                                :
                                null
                    }
                    {
                        hasProgress && minutesLeft !== null ?
                            <span className={styles['time-left']}>{t('CONTINUE_WATCHING_TIME_LEFT', { minutes: minutesLeft })}</span>
                            :
                            null
                    }
                    {
                        upcoming && !watched ?
                            <span className={styles['upcoming']}>{t('UPCOMING')}</span>
                            :
                            null
                    }
                </div>
            </div>
            {children}
        </Button>
    ), [selected, watched, title, thumbnail, blurThumbnail, hasProgress, progress, episode, id, releasedLabel, scheduled, minutesLeft, upcoming, t]);

    const renderMenu = useCallback(() => (
        <div className={styles['menu']} {...menuProps}>
            <Button className={styles['option']} href={deepLinks.player ?? undefined} title={t('CTX_WATCH')} onClick={handleWatchClick}>
                <div className={styles['option-label']}>{t('CTX_WATCH')}</div>
            </Button>
            <Button className={styles['option']} title={watched ? t('CTX_MARK_NON_WATCHED') : t('CTX_MARK_WATCHED')} onClick={handleToggleWatched}>
                <div className={styles['option-label']}>{watched ? t('CTX_MARK_NON_WATCHED') : t('CTX_MARK_WATCHED')}</div>
            </Button>
            {
                typeof season === 'number' ?
                    <Button className={styles['option']} title={seasonWatched ? t('CTX_UNMARK_REST') : t('CTX_MARK_REST')} onClick={handleToggleSeasonWatched}>
                        <div className={styles['option-label']}>{seasonWatched ? t('CTX_UNMARK_REST') : t('CTX_MARK_REST')}</div>
                    </Button>
                    :
                    null
            }
        </div>
    ), [menuProps, deepLinks.player, handleWatchClick, handleToggleWatched, handleToggleSeasonWatched, watched, season, seasonWatched, t]);

    return (
        <div ref={rowRef} className={styles['row']}>
            <Popup
                {...labelProps}
                open={open}
                menuClassName={styles['menu-container']}
                renderLabel={renderLabel}
                renderMenu={renderMenu}
                onClick={handleClick}
                onCloseRequest={closeMenu}
            />
        </div>
    );
};

export default memo(Video);
