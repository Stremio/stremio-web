// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type EPGChannel, type EPGProgram } from '../useEPG';
import { programStartMs, programEndMs, programTitle } from '../epgUtils';
import styles from './EpgGuideRow.less';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PIXELS_PER_HOUR = 120;

type Props = {
    channel: EPGChannel;
    programs: EPGProgram[];
    selectedDay: Date;
    now: number;
    onProgramClick: (program: EPGProgram, channel: EPGChannel) => void;
    pixelsPerHour?: number;
};

const EpgGuideRow = ({ channel, programs: allPrograms, selectedDay, now, onProgramClick, pixelsPerHour = DEFAULT_PIXELS_PER_HOUR }: Props) => {
    const { t } = useTranslation();
    const timeRange = useMemo(() => {
        const start = new Date(selectedDay);
        start.setHours(0, 0, 0, 0);
        return { start: start.getTime(), end: start.getTime() + DAY_IN_MS };
    }, [selectedDay]);

    const programs = useMemo(() =>
        allPrograms.filter((p) => {
            const s = programStartMs(p);
            const e = programEndMs(p);
            return !isNaN(s) && !isNaN(e) && e > timeRange.start && s < timeRange.end;
        }),
    [allPrograms, timeRange],
    );

    const totalPx = 24 * pixelsPerHour;

    return (
        <div className={styles['epg-row']}>
            <div className={styles['epg-program-list']} style={{ width: `${totalPx}px` }}>
                {programs.map((program, index) => {
                    const startMs = programStartMs(program);
                    const endMs = programEndMs(program);
                    const left = Math.max(0, ((startMs - timeRange.start) / DAY_IN_MS) * totalPx);
                    const width = Math.max(4, ((endMs - startMs) / DAY_IN_MS) * totalPx);
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
                {timeRange.start <= now && now < timeRange.end && (
                    <div
                        className={styles['epg-now-line']}
                        style={{ left: `${((now - timeRange.start) / DAY_IN_MS) * totalPx}px` }}
                    />
                )}
            </div>
        </div>
    );
};

export default EpgGuideRow;
