// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, MultiselectMenu } from 'stremio/components';
import { EpgGuideRow } from './EpgGuideRow';
import { EPGChannel, EPGProgram, HOUR_IN_MS, programEndMs, programStartMs, getEpgSkeletonPrograms } from 'stremio/common/EPG';
import styles from './EpgGuide.less';

const DAY_IN_MS = 24 * HOUR_IN_MS;
const HALF_HOUR_IN_MS = 30 * 60 * 1000;
const BASE_PIXELS_PER_HOUR = 120; // minimum scale
const MAX_PIXELS_PER_HOUR = 360; // cap — at 720 a 10-min show is 120 px (~17 000 px total grid)
const MIN_PROGRAM_WIDTH = 120; // px — wide enough to show a thumbnail + label
const CHANNEL_COLUMN_WIDTH = 130;
const ROW_HEIGHT = 56;
const MIN_PROGRAM_DURATION_MS = 10 * 60 * 1000; // ignore sub-10-min filler when choosing scale
const COMPACT_DAY_COUNT = 3;
const COMPACT_DAY_SELECTOR_QUERY = '(max-width: 800px)';
const SKELETON_ROWS = 20;
// A scroll counts as user-driven only if real input (wheel/touch/pointer/key)
// arrived within this window before it - long enough to bridge the gaps between
// frames of a drag, short enough that a later programmatic scroll or browser
// clamp is not mistaken for one.
const USER_SCROLL_WINDOW = 400;

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

function getDayStartMs(day: Date): number {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
}

// core dates ('YYYY-MM-DD') are the user's local dates
function parseLocalDate(value: string | null | undefined): Date | null {
    const match = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
    return match !== null ?
        new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        :
        null;
}

function abbreviate(value: string): string {
    return Array.from(value).slice(0, 3).join('');
}

type Props = {
    channels: EPGChannel[];
    // programs come from the core LiveTvGuide model (one day per load)
    programs: Record<string, EPGProgram[]>;
    programsLoading: boolean;
    catalogLoading: boolean;
    // the selected day ('YYYY-MM-DD') of the core LiveTvGuide model
    selectedDate: string | null;
    // today ('YYYY-MM-DD') in the user's timezone, derived core-side
    today: string | null;
    error: string | null;
    onRetry: () => void;
    hasNextPage: boolean;
    loadNextPage: () => void;
    now: number;
    onProgramSelect: (program: EPGProgram, channel: EPGChannel) => void;
    // notifies the parent so it can reload the model with the picked date
    onDayChange?: (day: Date) => void;
};

// a single grid-spanning overlay - the clock tick re-renders only this
// component instead of every guide row
const NowLine = ({ now, day, totalGridWidth }: { now: number, day: Date, totalGridWidth: number }) => {
    const dayStartMs = getDayStartMs(day);

    if (now < dayStartMs || now >= dayStartMs + DAY_IN_MS) {
        return null;
    }

    return (
        <div
            className={styles['epg-now-line']}
            style={{ left: `${((now - dayStartMs) / DAY_IN_MS) * totalGridWidth}px` }}
        />
    );
};

const EpgGuide = ({ channels, programs, programsLoading, catalogLoading, selectedDate, today, error, onRetry, hasNextPage, loadNextPage, now, onProgramSelect, onDayChange }: Props) => {
    const { t } = useTranslation();
    const viewportRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    // The inner wrapper of the channel column is what we translate — the outer clips it
    const channelColumnInnerRef = useRef<HTMLDivElement>(null);
    // Latest clock value, read (not subscribed to) by the centering effect so a
    // minute tick never yanks the viewport out from under the user.
    const nowRef = useRef(now);
    nowRef.current = now;
    // Timestamp of the last genuine user scroll input, used to distinguish a
    // real scroll from a programmatic one or a browser clamp echo.
    const lastUserScrollRef = useRef(0);

    const [selectedSlot, setSelectedSlot] = useState(getCurrentHalfHourIndex);
    const [compactDaySelector, setCompactDaySelector] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia(COMPACT_DAY_SELECTOR_QUERY).matches,
    );

    const loading = catalogLoading || (programsLoading && channels.length === 0);

    const selectDay = useCallback((day: Date) => {
        onDayChange?.(day);
    }, [onDayChange]);

    const todayDate = useMemo(() => {
        if (typeof today === 'string') {
            const date = parseLocalDate(today);
            if (date !== null) return date;
        }
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }, [today]);

    // the selected day is owned by the core model (via the url param) -
    // the strip is derived from selected.date/selectable.today
    const effectiveDay = useMemo(() => {
        return parseLocalDate(selectedDate) ?? todayDate;
    }, [selectedDate, todayDate]);

    const days = useMemo(() => {
        const range = Array.from({ length: 7 }, (_, i) =>
            new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + i - 3),
        );

        return Array.from(new Set([...range.map((day) => day.getTime()), effectiveDay.getTime()]))
            .sort((a, b) => a - b)
            .map((time) => new Date(time));
    }, [todayDate, effectiveDay]);

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

        const markUserScroll = () => {
            lastUserScrollRef.current = performance.now();
        };

        const onScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                // Header/channel sync must track every scroll, programmatic or not.
                if (channelColumnInnerRef.current) {
                    channelColumnInnerRef.current.style.transform =
                        `translateY(-${viewport.scrollTop}px)`;
                }
                if (headerRef.current) {
                    headerRef.current.scrollLeft = viewport.scrollLeft;
                }
                // The menu selection only follows genuine user scrolls - otherwise
                // programmatic centering or a browser clamp echo (e.g. when the grid
                // narrows on a day/scale change) would hijack it to an arbitrary hour.
                if (performance.now() - lastUserScrollRef.current > USER_SCROLL_WINDOW) return;
                lastUserScrollRef.current = performance.now(); // keep the drag session alive between frames
                const slot = Math.max(0, Math.min(TIME_SLOTS.length - 1, Math.floor((viewport.scrollLeft + viewport.clientWidth / 2) / halfHourPx)));
                setSelectedSlot((selectedSlot) => selectedSlot === slot ? selectedSlot : slot);
            });
        };

        viewport.addEventListener('scroll', onScroll, { passive: true });
        viewport.addEventListener('wheel', markUserScroll, { passive: true });
        viewport.addEventListener('touchstart', markUserScroll, { passive: true });
        viewport.addEventListener('touchmove', markUserScroll, { passive: true });
        viewport.addEventListener('pointerdown', markUserScroll, { passive: true });
        viewport.addEventListener('keydown', markUserScroll);
        return () => {
            viewport.removeEventListener('scroll', onScroll);
            viewport.removeEventListener('wheel', markUserScroll);
            viewport.removeEventListener('touchstart', markUserScroll);
            viewport.removeEventListener('touchmove', markUserScroll);
            viewport.removeEventListener('pointerdown', markUserScroll);
            viewport.removeEventListener('keydown', markUserScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [halfHourPx]);

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

    // Scroll the grid so that `centerPx` sits at the horizontal center of the viewport.
    const scrollToCenter = useCallback((centerPx: number) => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const maxScroll = Math.max(0, totalGridWidth - viewport.clientWidth);
        viewport.scrollLeft = Math.max(0, Math.min(maxScroll, centerPx - viewport.clientWidth / 2));
    }, [totalGridWidth]);

    // Center the viewport on the given half-hour slot (its midpoint at the center).
    const slotCenterPx = useCallback((index: number) => index * halfHourPx + halfHourPx / 2, [halfHourPx]);

    // When the shown day changes to one that contains "now" (i.e. the user
    // returns to today), snap the menu back to the current half-hour. This
    // re-arms the now-centering branch of the effect below so the now-line and
    // the time menu line up with the center again. Done during render (not in
    // an effect) so the centering effect reads the reset slot instead of a
    // stale one — otherwise it briefly scrolls to the previously picked slot,
    // which the scroll listener then reads back and sticks on. Keyed on the day
    // alone, so scrolling or paginating while already on today never resets it.
    const effectiveDayTime = effectiveDay.getTime();
    const [prevDayTime, setPrevDayTime] = useState(effectiveDayTime);
    if (effectiveDayTime !== prevDayTime) {
        setPrevDayTime(effectiveDayTime);
        const dayStartMs = getDayStartMs(effectiveDay);
        if (now >= dayStartMs && now < dayStartMs + DAY_IN_MS) {
            setSelectedSlot(Math.floor((now - dayStartMs) / HALF_HOUR_IN_MS));
        }
    }

    // Restore the horizontal position on initial load and whenever the day or
    // scale changes. While the menu is still on the current half-hour we center
    // the now-line itself, so the shows airing now sit dead-center; once the
    // user scrolls or picks another slot we center that slot instead, keeping
    // their position through pagination-driven scale recalculations.
    useEffect(() => {
        if (!viewportRef.current) return;
        const now = nowRef.current;
        const dayStartMs = getDayStartMs(effectiveDay);
        const nowWithinDay = now >= dayStartMs && now < dayStartMs + DAY_IN_MS;
        const nowSlot = nowWithinDay ? Math.floor((now - dayStartMs) / HALF_HOUR_IN_MS) : null;

        if (nowSlot !== null && selectedSlot === nowSlot) {
            scrollToCenter(((now - dayStartMs) / DAY_IN_MS) * totalGridWidth);
        } else {
            scrollToCenter(slotCenterPx(selectedSlot));
        }
    }, [effectiveDay, halfHourPx, selectedSlot, totalGridWidth, scrollToCenter, slotCenterPx]);

    const handleSlotSelect = useCallback((value: string | number | null) => {
        if (value === null) return;

        const index = Number(value);
        if (!Number.isInteger(index)) return;

        setSelectedSlot(index);
        scrollToCenter(slotCenterPx(index));
    }, [scrollToCenter, slotCenterPx]);

    const onViewportScroll = useCallback(() => {
        const viewport = viewportRef.current;
        if (viewport && hasNextPage && viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 400) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);

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
                    onClick={() => selectedDayIndex > 0 && selectDay(days[selectedDayIndex - 1])}
                >
                    <Icon className={styles['epg-day-arrow-icon']} name={'chevron-back'} />
                </button>
                {visibleDays.map((day) => {
                    const active = effectiveDay.getTime() === day.getTime();
                    const today = isSameDay(day, todayDate);
                    return (
                        <button
                            key={day.getTime()}
                            className={`${styles['epg-day-btn']}${active ? ` ${styles['epg-day-btn-active']}` : ''}`}
                            onClick={() => selectDay(day)}
                        >
                            <span className={styles['epg-day-weekday']}>{abbreviate(t(WEEKDAYS[day.getDay()]))}</span>
                            <span className={styles['epg-day-date']}>{today ? `${abbreviate(t(MONTHS[day.getMonth()]))} ${day.getDate()}` : day.getDate()}</span>
                        </button>
                    );
                })}
                <button
                    className={styles['epg-day-arrow']}
                    disabled={selectedDayIndex >= days.length - 1}
                    onClick={() => selectedDayIndex < days.length - 1 && selectDay(days[selectedDayIndex + 1])}
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
                            ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
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
                        <NowLine now={now} day={effectiveDay} totalGridWidth={totalGridWidth} />
                        {loading
                            ? Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className={styles['epg-skeleton-row']}
                                    style={{ height: `${ROW_HEIGHT}px`, width: `${totalGridWidth}px` }}
                                >
                                    {getEpgSkeletonPrograms(rowIndex).map((program) => {
                                        const left = (program.startMinutes / 60) * pixelsPerHour;
                                        const width = (program.durationMinutes / 60) * pixelsPerHour;

                                        return (
                                            <div
                                                key={program.index}
                                                className={styles['epg-skeleton-program']}
                                                style={{
                                                    left: `${left}px`,
                                                    width: `${Math.max(4, width)}px`,
                                                }}
                                            >
                                                <div className={styles['epg-skeleton-program-inner']}>
                                                    <div className={styles['epg-skeleton-thumb']} />
                                                    <div className={styles['epg-skeleton-content']}>
                                                        <div className={styles['epg-skeleton-title']} />
                                                        <div className={styles['epg-skeleton-time']} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                            : channels.length > 0
                                ? (
                                    <React.Fragment>
                                        {channels.map((channel) => (
                                            <EpgGuideRow
                                                key={channel.id}
                                                channel={channel}
                                                programs={programs[channel.id] ?? []}
                                                selectedDay={effectiveDay}
                                                now={now}
                                                onProgramClick={onProgramSelect}
                                                pixelsPerHour={pixelsPerHour}
                                            />
                                        ))}
                                        {error !== null && (
                                            <div className={styles['epg-error-banner']}>
                                                <div className={styles['epg-error-message']}>{error}</div>
                                                <Button className={styles['epg-error-retry']} onClick={onRetry}>
                                                    {t('TRY_AGAIN')}
                                                </Button>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )
                                : error !== null
                                    ? (
                                        <div className={styles['epg-error']}>
                                            <div className={styles['epg-error-message']}>{error}</div>
                                            <Button className={styles['epg-error-retry']} onClick={onRetry}>
                                                {t('TRY_AGAIN')}
                                            </Button>
                                        </div>
                                    )
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
