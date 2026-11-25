// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ContextMenu } from 'stremio/components';
import { languages, useToast } from 'stremio/common';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './SubtitleVariant.less';

type SubtitlesTrack = {
    id: string,
    addonSubtitleId?: string,
    lang: string,
    origin: string,
    label?: string,
    url?: string,
    fallbackUrl?: string,
    embedded?: boolean,
    local?: boolean,
    exclusive?: boolean,
    ass?: boolean,
};

type Props = {
    track: SubtitlesTrack,
    selected: boolean,
    loadStatus?: ExtraSubtitleLoadStatus,
    onSelect: (track: SubtitlesTrack) => void,
};

const hasValidLabel = (label?: string) => label && label.length > 0 && !label.startsWith('http');
const ASS_BADGE = 'ASS';

const SubtitleVariant = ({ track, selected, loadStatus, onSelect }: Props) => {
    const { t } = useTranslation();
    const toast = useToast();
    const buttonRef = useRef<HTMLElement>(null);
    const triggers = useMemo(() => [buttonRef], []);
    const isActive = selected && !loadStatus;

    const downloadUrl = track.fallbackUrl || track.url;
    const variantLabel = hasValidLabel(track.label) ? track.label : languages.label(track.lang);
    const downloadFileName = hasValidLabel(track.label) ? track.label : `subtitle-${track.lang || 'unknown'}`;
    const canCopyUrl = typeof downloadUrl === 'string' && !downloadUrl.startsWith('blob:');
    const hoverTitle = hasValidLabel(track.label)
        ? track.label
        : downloadUrl?.split('/').pop()?.split('?')[0] || variantLabel;

    const onSelectClick = useCallback(() => {
        onSelect(track);
    }, [onSelect, track]);

    const copyToClipboard = useCallback((value: string, successKey: string, errorKey: string) => {
        navigator.clipboard.writeText(value)
            .then(() => toast.show({ type: 'success', title: t(successKey), timeout: 4000 }))
            .catch(() => toast.show({ type: 'error', title: t(errorKey), timeout: 4000 }));
    }, [toast, t]);

    const onCopyUrlClick = useCallback(() => {
        if (downloadUrl) {
            copyToClipboard(downloadUrl, 'PLAYER_COPY_SUBTITLE_URL_SUCCESS', 'PLAYER_COPY_SUBTITLE_URL_ERROR');
        }
    }, [downloadUrl, copyToClipboard]);

    const onCopyIdClick = useCallback(() => {
        if (track.addonSubtitleId) {
            copyToClipboard(track.addonSubtitleId, 'PLAYER_COPY_SUBTITLE_ID_SUCCESS', 'PLAYER_COPY_SUBTITLE_ID_ERROR');
        }
    }, [track.addonSubtitleId, copyToClipboard]);

    return (
        <Button
            ref={buttonRef}
            title={hoverTitle}
            onClick={onSelectClick}
            className={classNames(styles['variant-option'], { 'selected': isActive })}
        >
            <div className={styles['info']}>
                <div className={styles['variant-title']}>
                    <div className={styles['variant-label']}>
                        {variantLabel}
                    </div>
                    {track.ass ? <div className={styles['ass-badge']}>{ASS_BADGE}</div> : null}
                </div>
                <div className={styles['variant-origin']}>
                    {
                        loadStatus ?
                            <span role={'status'}>{t(loadStatus === 'loading' ? 'SUBTITLES_LOADING' : 'ERR_SUBS_LOADING_TITLE')}</span>
                            :
                            t(track.origin)
                    }
                </div>
            </div>
            {isActive ? <div className={styles['icon']} /> : null}
            {!track.embedded &&
                <ContextMenu on={triggers} autoClose={true} lock={'bottom'}>
                    {downloadUrl ?
                        <Button
                            className={styles['context-menu-option']}
                            title={t('CTX_DOWNLOAD_SUBTITLE')}
                            href={downloadUrl}
                            target={'_blank'}
                            download={downloadFileName}
                        >
                            <Icon className={styles['menu-icon']} name={'download'} />
                            <div className={styles['context-menu-option-label']}>
                                {t('CTX_DOWNLOAD_SUBTITLE')}
                            </div>
                        </Button>
                        :
                        null
                    }
                    {canCopyUrl ?
                        <Button
                            className={styles['context-menu-option']}
                            title={t('CTX_COPY_SUBTITLE_URL')}
                            onClick={onCopyUrlClick}
                        >
                            <Icon className={styles['menu-icon']} name={'link'} />
                            <div className={styles['context-menu-option-label']}>
                                {t('CTX_COPY_SUBTITLE_URL')}
                            </div>
                        </Button>
                        :
                        null
                    }
                    {track.addonSubtitleId ?
                        <Button
                            className={styles['context-menu-option']}
                            title={t('CTX_COPY_SUBTITLE_ID')}
                            onClick={onCopyIdClick}
                        >
                            <Icon className={styles['menu-icon']} name={'share'} />
                            <div className={styles['context-menu-option-label']}>
                                {t('CTX_COPY_SUBTITLE_ID')}
                            </div>
                        </Button>
                        :
                        null
                    }
                </ContextMenu>
            }
        </Button>
    );
};

export default SubtitleVariant;
