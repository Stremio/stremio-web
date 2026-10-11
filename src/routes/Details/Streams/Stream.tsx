// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import Popup from 'stremio/components/Popup';
import ProgressBar from 'stremio/components/ProgressBar';
import { useCore } from 'stremio/core';
import { usePlatform, useProfile } from 'stremio/common';
import useToast from 'stremio/common/Toast/useToast';
import useRowMenu from '../useRowMenu';
import useStreamHref from './useStreamHref';
import styles from './Stream.less';

type Props = {
    className?: string,
    stream: Stream,
    addonName: string,
    videoId?: string | null,
    videoReleased?: string | null,
    canMarkWatched?: boolean,
    card?: boolean,
    onPlay?: (stream: Stream) => void,
};

type LabelProps = React.ComponentProps<typeof Button> & {
    ref: React.Ref<HTMLDivElement>,
};

type CopyKind = 'streaming' | 'magnet' | 'download';

const COPY_MESSAGES: Record<CopyKind, { success: string, error: string }> = {
    streaming: { success: 'PLAYER_COPY_STREAM_SUCCESS', error: 'PLAYER_COPY_STREAM_ERROR' },
    magnet: { success: 'PLAYER_COPY_MAGNET_LINK_SUCCESS', error: 'PLAYER_COPY_MAGNET_LINK_ERROR' },
    download: { success: 'PLAYER_COPY_DOWNLOAD_LINK_SUCCESS', error: 'PLAYER_COPY_DOWNLOAD_LINK_ERROR' },
};

const renderThumbnailFallback = () => <Icon className={styles['thumbnail-fallback']} name={'ic_broken_link'} />;

const Stream = ({ className, stream, addonName, videoId, videoReleased, canMarkWatched, card, onPlay }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const profile = useProfile();
    const platform = usePlatform();
    const toast = useToast();
    const { open, closeMenu, labelProps, menuProps } = useRowMenu();
    const { href, target, download, external } = useStreamHref(stream.deepLinks);
    const externalPlayer = stream.deepLinks?.externalPlayer;
    const name = stream.name || addonName;
    const lastUsed = stream.lastUsed === true;
    const progress = typeof stream.progress === 'number' && stream.progress > 0 ? stream.progress : null;
    const thumbnail = typeof stream.thumbnail === 'string' && stream.thumbnail.length > 0 ? stream.thumbnail : null;

    const play = useCallback(() => {
        if (profile.settings.playerType !== null) {
            if (profile.settings.playerType !== 'infuse' || !platform.shell.active || !canMarkWatched) {
                if (typeof videoId === 'string') {
                    core.transport.dispatch({
                        action: 'MetaDetails',
                        args: {
                            action: 'MarkVideoAsWatched',
                            args: [{ id: videoId, released: videoReleased }, true],
                        },
                    });
                }
            }

            core.transport.dispatch({
                action: 'MetaDetails',
                args: {
                    action: 'ExternalPlayerStreamOpened',
                    args: stream,
                },
            });
            toast.show({
                type: 'success',
                title: 'Stream opened in external player',
                timeout: 4000,
            });
        }

        core.transport.analytics({
            event: 'StreamClicked',
            args: { stream },
        });
        onPlay?.(stream);
    }, [core, profile.settings.playerType, platform.shell.active, canMarkWatched, videoId, videoReleased, stream, toast, onPlay]);

    const onClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!(event.nativeEvent as Event & { togglePopupPrevented?: boolean }).togglePopupPrevented) {
            play();
        }
    }, [play]);

    const onMenuPlay = useCallback(() => {
        closeMenu();
        play();
    }, [closeMenu, play]);

    const onCopy = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        closeMenu();
        const kind = event.currentTarget.dataset.link as CopyKind;
        const link = externalPlayer?.[kind];
        if (!link) {
            return;
        }

        navigator.clipboard.writeText(link)
            .then(() => {
                toast.show({ type: 'success', title: t(COPY_MESSAGES[kind].success), timeout: 4000 });
            })
            .catch(() => {
                toast.show({ type: 'error', title: t(COPY_MESSAGES[kind].error), timeout: 4000 });
            });
    }, [externalPlayer, closeMenu, toast, t]);

    const renderLabel = useCallback(({ className: labelClassName, children, ref, ...props }: LabelProps) => (
        <Button
            {...props}
            ref={ref}
            className={classNames(labelClassName, styles['stream'], { [styles['last-used']]: lastUsed, [styles['card']]: card })}
            title={addonName}
            href={href ?? undefined}
            target={target}
            download={download}
            onClick={onClick}
        >
            <div className={styles['info']}>
                <div className={styles['heading']}>
                    {
                        thumbnail !== null ?
                            <div className={styles['thumbnail-container']} title={name}>
                                <Image
                                    className={styles['thumbnail']}
                                    src={thumbnail}
                                    alt={' '}
                                    renderFallback={renderThumbnailFallback}
                                />
                            </div>
                            :
                            <div className={styles['name']} title={name}>{name}</div>
                    }
                    {
                        lastUsed ?
                            <div className={styles['flag']}>{t('DETAILS_LAST_USED', { defaultValue: 'Last used' })}</div>
                            :
                            null
                    }
                </div>
                {
                    stream.description ?
                        <div className={styles['description']} title={stream.description}>{stream.description}</div>
                        :
                        null
                }
                {
                    progress !== null ?
                        <ProgressBar className={styles['progress']} value={progress} />
                        :
                        null
                }
            </div>
            <div className={styles['play']} aria-hidden={'true'}>
                <Icon className={styles['icon']} name={external ? 'external-player' : 'play'} />
            </div>
            {children}
        </Button>
    ), [lastUsed, card, addonName, href, target, download, onClick, thumbnail, name, stream.description, progress, external, t]);

    const renderMenu = useCallback(() => (
        <div className={styles['menu']} {...menuProps}>
            {
                stream.description ?
                    <div className={styles['menu-title']}>{stream.description}</div>
                    :
                    null
            }
            <Button
                className={styles['menu-option']}
                title={t('CTX_PLAY')}
                href={href ?? undefined}
                target={target}
                download={download}
                onClick={onMenuPlay}
            >
                <Icon className={styles['menu-icon']} name={'play'} />
                <div className={styles['menu-label']}>{t('CTX_PLAY')}</div>
            </Button>
            {
                externalPlayer?.streaming ?
                    <Button className={styles['menu-option']} title={t('CTX_COPY_STREAM_LINK')} data-link={'streaming'} onClick={onCopy}>
                        <Icon className={styles['menu-icon']} name={'link'} />
                        <div className={styles['menu-label']}>{t('CTX_COPY_STREAM_LINK')}</div>
                    </Button>
                    :
                    null
            }
            {
                externalPlayer?.magnet ?
                    <Button className={styles['menu-option']} title={t('CTX_COPY_MAGNET_LINK')} data-link={'magnet'} onClick={onCopy}>
                        <Icon className={styles['menu-icon']} name={'magnet-link'} />
                        <div className={styles['menu-label']}>{t('CTX_COPY_MAGNET_LINK')}</div>
                    </Button>
                    :
                    null
            }
            {
                externalPlayer?.download ?
                    <Button className={styles['menu-option']} title={t('CTX_COPY_VIDEO_DOWNLOAD_LINK')} data-link={'download'} onClick={onCopy}>
                        <Icon className={styles['menu-icon']} name={'download'} />
                        <div className={styles['menu-label']}>{t('CTX_COPY_VIDEO_DOWNLOAD_LINK')}</div>
                    </Button>
                    :
                    null
            }
        </div>
    ), [menuProps, stream.description, href, target, download, onMenuPlay, externalPlayer, onCopy, t]);

    return (
        <Popup
            {...labelProps}
            className={className}
            open={open}
            portal={true}
            onCloseRequest={closeMenu}
            renderLabel={renderLabel}
            renderMenu={renderMenu}
        />
    );
};

export default Stream;
