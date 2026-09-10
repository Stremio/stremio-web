// Copyright (C) 2017-2026 Smart code 203358507

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { type EPGChannel, type EPGProgram, HOUR_IN_MS, programStartMs, programEndMs, programTitle } from 'stremio/common/EPG';
import styles from './EpgGuideRow.less';

const DEFAULT_PIXELS_PER_HOUR = 120;

type Props = {
    channel: EPGChannel;
    programs: EPGProgram[];
    dayStart: number;
    dayEnd: number;
    visibleStart: number;
    visibleEnd: number;
    now: number;
    onProgramClick: (program: EPGProgram, channel: EPGChannel) => void;
    pixelsPerHour?: number;
};

const currentProgramKey = (programs: EPGProgram[], now: number): number => {
    return programs.findIndex((program) => {
        const startMs = programStartMs(program);
        const endMs = programEndMs(program);
        return startMs <= now && now < endMs;
    });
};

const EpgGuideRow = ({ channel, programs, dayStart, dayEnd, visibleStart, visibleEnd, now, onProgramClick, pixelsPerHour = DEFAULT_PIXELS_PER_HOUR }: Props) => {
    const { t } = useTranslation();
    const totalPx = ((dayEnd - dayStart) / HOUR_IN_MS) * pixelsPerHour;
    const channelHref = channel.deepLinks?.metaDetailsStreams ?? channel.deepLinks?.metaDetailsVideos ?? null;

    return (
        <div className={styles['epg-row']}>
            <div className={styles['epg-program-list']} style={{ width: `${totalPx}px` }}>
                {programs.filter((program) => programEndMs(program) > visibleStart && programStartMs(program) < visibleEnd).map((program) => {
                    const startMs = programStartMs(program);
                    const endMs = programEndMs(program);
                    const left = Math.max(0, ((startMs - dayStart) / HOUR_IN_MS) * pixelsPerHour);
                    const width = ((Math.min(endMs, dayEnd) - Math.max(startMs, dayStart)) / HOUR_IN_MS) * pixelsPerHour;
                    const compact = width < 80;
                    const isCurrent = startMs <= now && now < endMs;
                    const label = programTitle(program);

                    const key = [
                        channel.id,
                        program.id,
                        startMs,
                        endMs,
                        label,
                    ]
                        .filter((value) => value !== undefined && value !== null && value !== '')
                        .join('-');

                    return (
                        <div
                            key={key}
                            className={`${styles['epg-program-block']}${isCurrent ? ` ${styles['epg-program-block-current']}` : ''}${compact ? ` ${styles['epg-program-block-compact']}` : ''}`}
                            style={{ left, width }}
                        >
                            <Button role={'button'} className={styles['epg-program-block-inner']} style={{ width: width - Math.min(4, width / 4) }} onClick={() => onProgramClick(program, channel)} title={label} aria-label={label}>
                                {compact && width >= 20 && <Icon name={'details'} className={styles['epg-program-icon']} />}
                                {program.thumbnail && (
                                    <div
                                        className={styles['epg-program-thumb']}
                                        style={{ backgroundImage: `url('${program.thumbnail}')` }}
                                    />
                                )}
                                <div className={styles['epg-program-content']}>
                                    <div className={styles['epg-program-title']}>{label}</div>
                                    <div className={styles['epg-program-time']}>
                                        {new Date(startMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        <span>-</span>
                                        {new Date(endMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    );
                })}
                {/* a channel without a program for the day stays reachable -
                    the whole day block links to its streams */}
                {programs.length === 0 && (
                    channelHref !== null ? (
                        <Button className={`${styles['epg-program-block-inner']} ${styles['epg-no-programs']}`} href={channelHref} title={channel.name}>
                            <div className={styles['epg-program-title']}>{channel.name}</div>
                        </Button>
                    ) : (
                        <div className={`${styles['epg-program-block-inner']} ${styles['epg-no-programs']}`}>
                            <div className={styles['epg-program-title']}>{t('NO_STREAM')}</div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

// re-render a row on the clock tick only when its live program changes -
// the now line itself is an overlay owned by the guide
export default memo(EpgGuideRow, (prev, next) => {
    return prev.channel === next.channel &&
        prev.programs === next.programs &&
        prev.dayStart === next.dayStart &&
        prev.dayEnd === next.dayEnd &&
        prev.visibleStart === next.visibleStart &&
        prev.visibleEnd === next.visibleEnd &&
        prev.pixelsPerHour === next.pixelsPerHour &&
        prev.onProgramClick === next.onProgramClick &&
        currentProgramKey(prev.programs, prev.now) === currentProgramKey(next.programs, next.now);
});
