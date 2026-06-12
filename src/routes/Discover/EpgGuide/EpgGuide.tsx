// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { MultiselectMenu } from 'stremio/components';
import { EpgGuideRow } from './EpgGuideRow';
import { useEPG, EPGChannel, EPGProgram } from './useEPG';
import { programStartMs, programEndMs } from './epgUtils';
import styles from './EpgGuide.less';

const BASE_PIXELS_PER_HOUR = 120; // minimum scale
const MAX_PIXELS_PER_HOUR = 360; // cap — at 720 a 10-min show is 120 px (~17 000 px total grid)
const MIN_PROGRAM_WIDTH = 120; // px — wide enough to show a thumbnail + label
const CHANNEL_COLUMN_WIDTH = 130;
const ROW_HEIGHT = 56;
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const MIN_PROGRAM_DURATION_MS = 10 * 60 * 1000; // ignore sub-10-min filler when choosing scale
const COMPACT_DAY_COUNT = 3;
const COMPACT_DAY_SELECTOR_QUERY = '(max-width: 800px)';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => ({
    index: i,
    label: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
}));

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function getCurrentHalfHourIndex(): number {
    const now = new Date();
    return Math.floor((now.getHours() * 60 + now.getMinutes()) / 30);
}

function generateDayRange(before: number, after: number): Date[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: before + after + 1 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i - before);
        return d;
    });
}

function abbreviate(value: string): string {
    return Array.from(value).slice(0, 3).join('');
}

type Props = {
    requestBase: string | null;
    channels: EPGChannel[];
    catalogLoading: boolean;
    hasNextPage: boolean;
    loadNextPage: () => void;
    onProgramSelect: (program: EPGProgram, channel: EPGChannel) => void;
};

const EpgGuide = ({ requestBase, channels, catalogLoading, hasNextPage, loadNextPage, onProgramSelect }: Props) => {
    const { t } = useTranslation();
    const viewportRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    // The inner wrapper of the channel column is what we translate — the outer clips it
    const channelColumnInnerRef = useRef<HTMLDivElement>(null);

    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState(getCurrentHalfHourIndex);
    const [compactDaySelector, setCompactDaySelector] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia(COMPACT_DAY_SELECTOR_QUERY).matches,
    );

    const { programs, loading: programsLoading } = useEPG(requestBase, channels);
    const loading = catalogLoading || (programsLoading && channels.length === 0);

    const days = useMemo(() => {
        const baseDays = generateDayRange(3, 3);
        const programDays = Array.from(
            new Set(Object.values(programs).flat().map((program) => {
                const day = new Date(program.startTime);
                day.setHours(0, 0, 0, 0);
                return day.getTime();
            })),
        );

        return Array.from(
            new Set([
                ...baseDays.map((day) => day.getTime()),
                ...programDays,
            ]),
        )
            .sort((a, b) => a - b)
            .map((time) => new Date(time));
    }, [programs]);

    const effectiveDay = useMemo(() => {
        if (selectedDay && days.some((day) => day.getTime() === selectedDay.getTime())) return selectedDay;
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return days.find((d) => d.getTime() === todayStart.getTime()) ?? days[0];
    }, [selectedDay, days]);

    // Compute a scale that guarantees every program (≥ 5 min) is at least
    // MIN_PROGRAM_WIDTH pixels wide, so thumbnails always fit.
    const pixelsPerHour = useMemo(() => {
        const allPrograms = Object.values(programs).flat();
        if (allPrograms.length === 0) return BASE_PIXELS_PER_HOUR;
        let minDurationHours = Infinity;
        for (const p of allPrograms) {
            const dur = programEndMs(p) - programStartMs(p);
            if (dur >= MIN_PROGRAM_DURATION_MS) {
                minDurationHours = Math.min(minDurationHours, dur / HOUR_IN_MS);
            }
        }
        if (!isFinite(minDurationHours)) return BASE_PIXELS_PER_HOUR;
        const required = MIN_PROGRAM_WIDTH / minDurationHours;
        return Math.min(MAX_PIXELS_PER_HOUR, Math.max(BASE_PIXELS_PER_HOUR, required));
    }, [programs]);

    const halfHourPx = pixelsPerHour / 2;
    const totalGridWidth = 24 * pixelsPerHour;

    // Attach a native passive scroll listener and sync via requestAnimationFrame +
    // CSS transform (compositor-thread, no layout cost → zero visible lag).
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        let rafId: number | null = null;

        const onScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                if (channelColumnInnerRef.current) {
                    channelColumnInnerRef.current.style.transform =
                        `translateY(-${viewport.scrollTop}px)`;
                }
                if (headerRef.current) {
                    headerRef.current.scrollLeft = viewport.scrollLeft;
                }
            });
        };

        viewport.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            viewport.removeEventListener('scroll', onScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, []);

    // Reset channel column translation when the day changes (viewport scroll resets)
    useEffect(() => {
        if (channelColumnInnerRef.current) {
            channelColumnInnerRef.current.style.transform = 'translateY(0)';
        }
    }, [effectiveDay]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.shiftKey && viewportRef.current) {
            e.preventDefault();
            viewportRef.current.scrollLeft += e.deltaY;
        }
    }, []);

    // Scroll to current time when the effective day is today
    useEffect(() => {
        if (!viewportRef.current) return;
        const now = new Date();
        const start = new Date(effectiveDay);
        start.setHours(0, 0, 0, 0);
        if (now >= start && now.getTime() < start.getTime() + DAY_IN_MS) {
            viewportRef.current.scrollLeft = Math.max(0, ((now.getTime() - start.getTime()) / HOUR_IN_MS) * pixelsPerHour - 200);
        }
    }, [effectiveDay, pixelsPerHour]);

    const handleSlotSelect = useCallback((value: string | number | null) => {
        const index = Number(value);
        if (!Number.isInteger(index)) return;

        setSelectedSlot(index);
        if (viewportRef.current) {
            viewportRef.current.scrollLeft = index * halfHourPx;
        }
    }, [halfHourPx]);

    const onViewportScroll = useCallback(() => {
        const viewport = viewportRef.current;
        if (viewport && hasNextPage && viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 400) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);

    // Reset selected day when the request changes
    useEffect(() => {
        setSelectedDay(null);
    }, [requestBase]);

    const selectedDayIndex = useMemo(
        () => days.findIndex((d) => effectiveDay && d.getTime() === effectiveDay.getTime()),
        [days, effectiveDay],
    );

    const visibleDays = useMemo(() => {
        if (!compactDaySelector || days.length <= COMPACT_DAY_COUNT) return days;

        const selectedIndex = Math.max(0, selectedDayIndex);
        const start = Math.min(
            Math.max(0, selectedIndex - Math.floor(COMPACT_DAY_COUNT / 2)),
            Math.max(0, days.length - COMPACT_DAY_COUNT),
        );

        return days.slice(start, start + COMPACT_DAY_COUNT);
    }, [compactDaySelector, days, selectedDayIndex]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(COMPACT_DAY_SELECTOR_QUERY);
        const onChange = () => setCompactDaySelector(mediaQuery.matches);

        onChange();
        mediaQuery.addEventListener('change', onChange);

        return () => mediaQuery.removeEventListener('change', onChange);
    }, []);

    return (
        <div className={styles['epg-guide']} onWheel={handleWheel}>
            {/* Day selector */}
            <div className={styles['epg-day-selector']}>
                <button
                    className={styles['epg-day-arrow']}
                    disabled={selectedDayIndex <= 0}
                    onClick={() => selectedDayIndex > 0 && setSelectedDay(days[selectedDayIndex - 1])}
                >
                    <Icon className={styles['epg-day-arrow-icon']} name={'chevron-back'} />
                </button>
                {visibleDays.map((day) => {
                    const active = effectiveDay.getTime() === day.getTime();
                    const today = isSameDay(day, new Date());
                    return (
                        <button
                            key={day.getTime()}
                            className={`${styles['epg-day-btn']}${active ? ` ${styles['epg-day-btn-active']}` : ''}`}
                            onClick={() => setSelectedDay(day)}
                        >
                            <span className={styles['epg-day-weekday']}>{abbreviate(t(WEEKDAYS[day.getDay()]))}</span>
                            <span className={styles['epg-day-date']}>{today ? `${abbreviate(t(MONTHS[day.getMonth()]))} ${day.getDate()}` : day.getDate()}</span>
                        </button>
                    );
                })}
                <button
                    className={styles['epg-day-arrow']}
                    disabled={selectedDayIndex >= days.length - 1}
                    onClick={() => selectedDayIndex < days.length - 1 && setSelectedDay(days[selectedDayIndex + 1])}
                >
                    <Icon className={styles['epg-day-arrow-icon']} name={'chevron-forward'} />
                </button>
            </div>

            {/* Time header */}
            <div className={styles['epg-header-row']}>
                <div className={styles['epg-channel-column-header']}>
                    <MultiselectMenu
                        className={styles['epg-time-menu']}
                        options={TIME_SLOTS.map((slot) => ({
                            label: slot.label,
                            value: slot.index,
                        }))}
                        value={selectedSlot}
                        onSelect={handleSlotSelect}
                    />
                </div>
                <div ref={headerRef} className={styles['epg-header-viewport']}>
                    <div className={styles['epg-header-time-slots']} style={{ width: `${totalGridWidth}px` }}>
                        {TIME_SLOTS.map((slot) => (
                            <div
                                key={slot.index}
                                className={styles['epg-time-slot']}
                                style={{ width: `${halfHourPx}px` }}
                            >
                                {slot.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className={styles['epg-body-row']}>
                {/* Channel column — outer clips, inner translates via rAF transform */}
                <div
                    className={styles['epg-channel-column']}
                    style={{ width: `${CHANNEL_COLUMN_WIDTH}px` }}
                >
                    <div ref={channelColumnInnerRef} className={styles['epg-channel-column-inner']}>
                        {loading
                            ? Array.from({ length: 6 }, (_, i) => (
                                <div key={i} className={styles['epg-channel-cell']} style={{ height: `${ROW_HEIGHT}px` }}>
                                    <div className={styles['epg-skeleton']} style={{ width: '60%', height: '18px', borderRadius: '4px' }} />
                                </div>
                            ))
                            : channels.map((channel) => (
                                <div key={channel.id} className={styles['epg-channel-cell']} style={{ height: `${ROW_HEIGHT}px` }}>
                                    {channel.logo ? (
                                        <img
                                            className={styles['epg-channel-logo']}
                                            src={channel.logo}
                                            alt={channel.name}
                                        />
                                    ) : (
                                        <div className={styles['epg-channel-name']}>{channel.name}</div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Scrollable program grid */}
                <div ref={viewportRef} className={styles['epg-viewport']} onScroll={onViewportScroll}>
                    <div className={styles['epg-program-grid']} style={{ width: `${totalGridWidth}px` }}>
                        {loading
                            ? Array.from({ length: 6 }, (_, i) => (
                                <div key={i} className={styles['epg-skeleton-row']} style={{ height: `${ROW_HEIGHT}px` }}>
                                    <div className={styles['epg-skeleton-programs']}>
                                        <div className={styles['epg-skeleton']} style={{ flex: 2 }} />
                                        <div className={styles['epg-skeleton']} style={{ flex: 3 }} />
                                        <div className={styles['epg-skeleton']} style={{ flex: 1 }} />
                                    </div>
                                </div>
                            ))
                            : channels.length > 0
                                ? channels.map((channel) => (
                                    <EpgGuideRow
                                        key={channel.id}
                                        channel={channel}
                                        programs={programs[channel.id] ?? []}
                                        selectedDay={effectiveDay}
                                        onProgramClick={onProgramSelect}
                                        pixelsPerHour={pixelsPerHour}
                                    />
                                ))
                                : (
                                    <div className={styles['epg-empty']}>
                                        {t('NO_STREAM')}
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EpgGuide;
