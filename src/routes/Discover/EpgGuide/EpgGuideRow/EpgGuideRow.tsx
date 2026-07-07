// Copyright (C) 2017-2026 Smart code 203358507

import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type EPGChannel, type EPGProgram, HOUR_IN_MS, programStartMs, programEndMs, programTitle } from 'stremio/common/EPG';
import styles from './EpgGuideRow.less';

const DAY_IN_MS = 24 * HOUR_IN_MS;
const DEFAULT_PIXELS_PER_HOUR = 120;

type Props = {
    channel: EPGChannel;
    programs: EPGProgram[];
    selectedDay: Date;
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

const EpgGuideRow = ({ channel, programs, selectedDay, now, onProgramClick, pixelsPerHour = DEFAULT_PIXELS_PER_HOUR }: Props) => {
    const { t } = useTranslation();
    const dayStart = useMemo(() => {
        const start = new Date(selectedDay);
        start.setHours(0, 0, 0, 0);
        return start.getTime();
    }, [selectedDay]);

    const totalPx = 24 * pixelsPerHour;

    return (
        <div className={styles['epg-row']}>
            <div className={styles['epg-program-list']} style={{ width: `${totalPx}px` }}>
                {/* core buckets the shows into the selected day - no re-filtering,
                    blocks spilling over the day edges are pixel-clamped instead */}
                {programs.map((program, index) => {
                    const startMs = programStartMs(program);
                    const endMs = programEndMs(program);
                    const left = Math.max(0, ((startMs - dayStart) / DAY_IN_MS) * totalPx);
                    const width = Math.max(4, ((Math.min(endMs, dayStart + DAY_IN_MS) - Math.max(startMs, dayStart)) / DAY_IN_MS) * totalPx);
                    const isCurrent = startMs <= now && now < endMs;
                    const label = programTitle(program);

                    const key = [
                        channel.id,
                        program.id,
                        startMs,
                        endMs,
                        label,
                        index,
                    ]
                        .filter((value) => value !== undefined && value !== null && value !== '')
                        .join('-');

                    return (
                        <button
                            key={key}
                            className={`${styles['epg-program-block']}${isCurrent ? ` ${styles['epg-program-block-current']}` : ''}`}
                            style={{ left: `${left}px`, width: `${width}px` }}
                            onClick={() => onProgramClick(program, channel)}
                            title={label}
                        >
                            <div className={styles['epg-program-block-inner']}>
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
                            </div>
                        </button>
                    );
                })}
                {programs.length === 0 && (
                    <div className={styles['epg-no-programs']}>{t('NO_STREAM')}</div>
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
        prev.selectedDay.getTime() === next.selectedDay.getTime() &&
        prev.pixelsPerHour === next.pixelsPerHour &&
        prev.onProgramClick === next.onProgramClick &&
        currentProgramKey(prev.programs, prev.now) === currentProgramKey(next.programs, next.now);
});
