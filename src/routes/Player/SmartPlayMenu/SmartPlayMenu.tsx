import React, { forwardRef, memo, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Button } from 'stremio/components';
import styles from './SmartPlayMenu.less';

type QualityOption = {
    height: number,
    label: string,
};

type Details = {
    title: string,
    description: string,
    addonName: string,
    height: number,
    hdr: boolean,
    sizeBytes: number,
    downloadedBytes: number,
    totalBytes: number,
    speed: number,
    speedEstimated: boolean,
    peers: number,
    bufferedMs: number,
    durationMs: number,
    connectionMbps: number,
};

type Props = {
    className?: string,
    details: Details,
    qualityOptions: QualityOption[],
    selectedHeight: number,
    hdrPreference: 'auto' | 'hdr' | 'sdr',
    ignoredStreams: IgnoredStream[],
    onQualitySelect: (height: number) => void,
    onHdrPreferenceChange: (value: 'auto' | 'hdr' | 'sdr') => void,
    onIgnoreCurrent: () => void,
    onRestore: (key: string) => void,
    onOpenAudio: () => void,
};

const formatDuration = (ms: number): string => {
    if (!Number.isFinite(ms) || ms <= 0) {
        return '00:00';
    }
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0
        ? `${hours}:${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`
        : `${minutes}:${`${seconds}`.padStart(2, '0')}`;
};

const formatBytes = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit += 1;
    }
    return `${value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${units[unit]}`;
};

const SmartPlayMenu = memo(forwardRef<HTMLDivElement, Props>(({
    className,
    details,
    qualityOptions,
    selectedHeight,
    hdrPreference,
    ignoredStreams,
    onQualitySelect,
    onHdrPreferenceChange,
    onIgnoreCurrent,
    onRestore,
    onOpenAudio,
}: Props, ref) => {
    const { t } = useTranslation();

    const onMouseDown = useCallback((event: MouseEvent) => {
        // @ts-expect-error: Property 'smartPlayMenuClosePrevented' does not exist on type 'MouseEvent'.
        event.nativeEvent.smartPlayMenuClosePrevented = true;
    }, []);

    const onQualityClick = useCallback((event: MouseEvent) => {
        onQualitySelect(Number(event.currentTarget.getAttribute('data-height')) || 0);
    }, [onQualitySelect]);

    const onHdrClick = useCallback((event: MouseEvent) => {
        onHdrPreferenceChange(event.currentTarget.getAttribute('data-preference') as 'auto' | 'hdr' | 'sdr');
    }, [onHdrPreferenceChange]);

    const onRestoreClick = useCallback((event: MouseEvent) => {
        const key = event.currentTarget.getAttribute('data-key');
        if (key) {
            onRestore(key);
        }
    }, [onRestore]);

    const totalBytes = details.totalBytes > 0 ? details.totalBytes : 0;
    const downloadedBytes = totalBytes > 0 ? Math.min(details.downloadedBytes, totalBytes) : 0;
    const downloadedPercent = totalBytes > 0 ? Math.round((downloadedBytes / totalBytes) * 100) : null;
    const bufferedPercent = details.durationMs > 0 && details.bufferedMs > 0
        ? Math.min(100, Math.round((details.bufferedMs / details.durationMs) * 100))
        : null;
    const speedLabel = details.speed > 0
        ? `${details.speedEstimated ? '~' : ''}${details.speed} MB/s`
        : details.connectionMbps > 0 ? `~${details.connectionMbps.toFixed(1)} Mbps` : '—';
    const qualityLabel = details.height > 0
        ? `${details.height}p${details.hdr ? ' · HDR' : ''}`
        : details.hdr ? 'HDR' : '';

    const hdrLabel = (value: 'auto' | 'hdr' | 'sdr') => {
        switch (value) {
            case 'hdr':
                return t('SETTINGS_SMART_PLAY_HDR_PREFER_HDR', { defaultValue: 'Prefer HDR' });
            case 'sdr':
                return t('SETTINGS_SMART_PLAY_HDR_PREFER_SDR', { defaultValue: 'Prefer SDR' });
            default:
                return t('SETTINGS_SMART_PLAY_HDR_AUTO', { defaultValue: 'Auto' });
        }
    };

    return (
        <div ref={ref} className={classNames(className, styles['smart-play-menu'])} onMouseDown={onMouseDown}>
            <div className={styles['container']}>
                <div className={styles['header']}>
                    {t('PLAYER_SMART_PLAY', { defaultValue: 'Playback' })}
                </div>
                <div className={styles['details']}>
                    {
                        details.title ?
                            <div className={styles['details-title']} title={details.title}>{details.title}</div>
                            :
                            null
                    }
                    {
                        details.description ?
                            <div className={styles['details-description']}>{details.description}</div>
                            :
                            null
                    }
                    {
                        details.addonName ?
                            <div className={styles['detail-row']}>
                                <div className={styles['detail-label']}>{t('PLAYER_ADDON', { defaultValue: 'Addon' })}</div>
                                <div className={styles['detail-value']} title={details.addonName}>{details.addonName}</div>
                            </div>
                            :
                            null
                    }
                    {
                        qualityLabel ?
                            <div className={styles['detail-row']}>
                                <div className={styles['detail-label']}>{t('PLAYER_QUALITY', { defaultValue: 'Quality' })}</div>
                                <div className={styles['detail-value']}>{qualityLabel}</div>
                            </div>
                            :
                            null
                    }
                    {
                        details.sizeBytes > 0 ?
                            <div className={styles['detail-row']}>
                                <div className={styles['detail-label']}>{t('PLAYER_FILE_SIZE', { defaultValue: 'Size' })}</div>
                                <div className={styles['detail-value']}>{formatBytes(details.sizeBytes)}</div>
                            </div>
                            :
                            null
                    }
                    {
                        downloadedPercent !== null ?
                            <div className={styles['detail-row']}>
                                <div className={styles['detail-label']}>{t('PLAYER_DOWNLOADED', { defaultValue: 'Downloaded' })}</div>
                                <div className={styles['detail-value']}>
                                    {`${formatBytes(downloadedBytes)} / ${formatBytes(totalBytes)} (${downloadedPercent}%)`}
                                </div>
                            </div>
                            :
                            bufferedPercent !== null ?
                                <div className={styles['detail-row']}>
                                    <div className={styles['detail-label']}>{t('PLAYER_BUFFERED', { defaultValue: 'Buffered' })}</div>
                                    <div className={styles['detail-value']}>
                                        {`${formatDuration(details.bufferedMs)} / ${formatDuration(details.durationMs)} (${bufferedPercent}%)`}
                                    </div>
                                </div>
                                :
                                null
                    }
                    <div className={styles['detail-row']}>
                        <div className={styles['detail-label']}>{t('PLAYER_SPEED', { defaultValue: 'Speed' })}</div>
                        <div className={styles['detail-value']}>{speedLabel}</div>
                    </div>
                    {
                        details.peers > 0 ?
                            <div className={styles['detail-row']}>
                                <div className={styles['detail-label']}>{t('PLAYER_PEERS', { defaultValue: 'Peers' })}</div>
                                <div className={styles['detail-value']}>{details.peers}</div>
                            </div>
                            :
                            null
                    }
                </div>
                <div className={styles['section']}>
                    <div className={styles['section-title']}>
                        {t('PLAYER_QUALITY', { defaultValue: 'Quality' })}
                    </div>
                    <Button
                        className={classNames(styles['option'], { [styles['selected']]: selectedHeight <= 0 })}
                        data-height={0}
                        onClick={onQualityClick}
                    >
                        <div className={styles['label']}>
                            {t('PLAYER_QUALITY_AUTO', { defaultValue: 'Auto' })}
                        </div>
                    </Button>
                    {
                        qualityOptions.map((option) => (
                            <Button
                                key={option.height}
                                className={classNames(styles['option'], { [styles['selected']]: option.height === selectedHeight })}
                                data-height={option.height}
                                onClick={onQualityClick}
                            >
                                <div className={styles['label']}>{option.label || `${option.height}p`}</div>
                            </Button>
                        ))
                    }
                </div>
                <div className={styles['section']}>
                    <div className={styles['section-title']}>
                        {t('PLAYER_HDR', { defaultValue: 'HDR' })}
                    </div>
                    {
                        (['auto', 'hdr', 'sdr'] as const).map((value) => (
                            <Button
                                key={value}
                                className={classNames(styles['option'], { [styles['selected']]: hdrPreference === value })}
                                data-preference={value}
                                onClick={onHdrClick}
                            >
                                <div className={styles['label']}>{hdrLabel(value)}</div>
                            </Button>
                        ))
                    }
                </div>
                <div className={styles['section']}>
                    <Button className={styles['option']} onClick={onOpenAudio}>
                        <div className={styles['label']}>{t('AUDIO_TRACKS')}</div>
                    </Button>
                    <Button className={styles['option']} onClick={onIgnoreCurrent}>
                        <div className={styles['label']}>
                            {t('PLAYER_IGNORE_SOURCE', { defaultValue: 'Ignore this file' })}
                        </div>
                    </Button>
                </div>
                {
                    ignoredStreams.length > 0 ?
                        <div className={styles['section']}>
                            <div className={styles['section-title']}>
                                {t('PLAYER_IGNORED_SOURCES', { defaultValue: 'Ignored files' })}
                            </div>
                            {
                                ignoredStreams.map((ignored) => (
                                    <div key={ignored.key} className={styles['ignored-row']}>
                                        <div className={styles['label']} title={ignored.label}>{ignored.label}</div>
                                        <Button className={styles['restore']} data-key={ignored.key} onClick={onRestoreClick}>
                                            {t('PLAYER_RESTORE_SOURCE', { defaultValue: 'Restore' })}
                                        </Button>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        null
                }
            </div>
        </div>
    );
}));

export default SmartPlayMenu;
