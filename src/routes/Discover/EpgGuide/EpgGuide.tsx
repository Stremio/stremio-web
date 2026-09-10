// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState, useMemo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, MultiselectMenu } from 'stremio/components';
import { useMediaQuery } from 'stremio/common';
import { EpgGuideRow } from './EpgGuideRow';
import { EPGChannel, EPGProgram, EPG_PIXELS_PER_HOUR, HOUR_IN_MS, epgDayWindow, parseEpgDate, getEpgSkeletonPrograms } from 'stremio/common/EPG';
import styles from './EpgGuide.less';

const HALF_HOUR_IN_MS = HOUR_IN_MS / 2;
const MIN_SCALE = 60;
const MAX_SCALE = 9600;
const TICK_MINUTES = [1, 2, 5, 10, 15, 30, 60, 120];
const CHANNEL_COLUMN_WIDTH = 130;
const ROW_HEIGHT = 56;
const ROW_STRIDE = 60;
const OVERSCAN_ROWS = 3;
const TIME_OVERSCAN_PX = 300;
const SKELETON_ROWS = 20;
const EMPTY_PROGRAMS: EPGProgram[] = [];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const abbreviate = (value: string) => Array.from(value).slice(0, 3).join('');

type Props = {
    channels: EPGChannel[];
    programs: Record<string, EPGProgram[]>;
    loading: boolean;
    selectedDate: string | null;
    today: string | null;
    dayWindow?: { start: string; end: string } | null;
    error: string | null;
    onRetry: () => void;
    hasNextPage: boolean;
    loadNextPage: () => void;
    now: number;
    onProgramSelect: (program: EPGProgram, channel: EPGChannel) => void;
    onDayChange: (day: Date) => void;
};

const EpgGuide = ({ channels, programs, loading, selectedDate, today, dayWindow, error, onRetry, hasNextPage, loadNextPage, now, onProgramSelect, onDayChange }: Props) => {
    const { t } = useTranslation();
    const viewportRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const channelColumnInnerRef = useRef<HTMLDivElement>(null);
    const nowRef = useRef(now);
    const positionRef = useRef<{ day: string; center: number | null }>({ day: '', center: null });
    const [viewport, setViewport] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const [pixelsPerHour, setPixelsPerHour] = useState(EPG_PIXELS_PER_HOUR);
    const compact = useMediaQuery('(max-width: 800px)');
    const todayDate = useMemo(() => parseEpgDate(today) ?? new Date(), [today]);
    const effectiveDay = useMemo(() => parseEpgDate(selectedDate) ?? todayDate, [selectedDate, todayDate]);
    const { start: dayStart, end: dayEnd } = useMemo(() => dayWindow ? {
        start: Date.parse(dayWindow.start), end: Date.parse(dayWindow.end),
    } : epgDayWindow(effectiveDay), [dayWindow, effectiveDay]);
    const totalGridWidth = ((dayEnd - dayStart) / HOUR_IN_MS) * pixelsPerHour;
    const halfHourPx = pixelsPerHour / 2;
    const slots = useMemo(() => {
        const times = Array.from({ length: Math.ceil((dayEnd - dayStart) / HALF_HOUR_IN_MS) }, (_, index) => {
            const date = new Date(dayStart + index * HALF_HOUR_IN_MS);
            return { index, date, label: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        });
        // Fall-back days contain repeated local times. Include the offset for those choices.
        return times.map((slot) => ({ ...slot, label: times.some((other) => other.index !== slot.index && other.label === slot.label) ?
            slot.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'shortOffset' }) : slot.label }));
    }, [dayStart, dayEnd]);
    const selectedSlot = Math.max(0, Math.min(slots.length - 1, Math.floor((viewport.left + viewport.width / 2) / halfHourPx)));
    const tickSize = (TICK_MINUTES.find((minutes) => minutes * pixelsPerHour / 60 >= 75) ?? 120) * 60000;
    const tickWidth = tickSize * pixelsPerHour / HOUR_IN_MS;
    const firstTick = Math.max(0, Math.floor((viewport.left - TIME_OVERSCAN_PX) / tickWidth));
    const lastTick = Math.min(Math.ceil((dayEnd - dayStart) / tickSize), Math.ceil((viewport.left + viewport.width + TIME_OVERSCAN_PX) / tickWidth));
    const ticks = Array.from({ length: Math.max(0, lastTick - firstTick) }, (_, index) => firstTick + index);
    const days = useMemo(() => {
        const range = Array.from({ length: 7 }, (_, index) =>
            new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + index - 3));
        return Array.from(new Set([...range.map((day) => day.getTime()), effectiveDay.getTime()]))
            .sort((a, b) => a - b).map((time) => new Date(time));
    }, [todayDate, effectiveDay]);
    const selectedDayIndex = days.findIndex((day) => day.getTime() === effectiveDay.getTime());
    const visibleDays = compact ? days.slice(Math.max(0, Math.min(days.length - 3, selectedDayIndex - 1)), Math.max(3, Math.min(days.length, selectedDayIndex + 2))) : days;

    useEffect(() => {
        nowRef.current = now;
    }, [now]);

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        let frame: number | null = null;
        const measure = () => {
            frame = null;
            if (headerRef.current) headerRef.current.scrollLeft = element.scrollLeft;
            if (channelColumnInnerRef.current) channelColumnInnerRef.current.style.transform = `translateY(-${element.scrollTop}px)`;
            setViewport({ left: element.scrollLeft, top: element.scrollTop, width: element.clientWidth, height: element.clientHeight });
        };
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(measure);
        };
        const observer = new ResizeObserver(onScroll);
        observer.observe(element);
        element.addEventListener('scroll', onScroll, { passive: true });
        measure();
        return () => {
            observer.disconnect();
            element.removeEventListener('scroll', onScroll);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    const scrollToTime = useCallback((time: number) => {
        const element = viewportRef.current;
        if (!element) return;
        element.scrollLeft = Math.max(0, ((time - dayStart) / HOUR_IN_MS) * pixelsPerHour - element.clientWidth / 2);
    }, [dayStart, pixelsPerHour]);
    // Day changes select Now; zoom preserves the time at the viewport centre.
    useLayoutEffect(() => {
        const element = viewportRef.current;
        if (!element) return;
        const day = `${dayStart}:${dayEnd}`;
        let time = positionRef.current.center;
        if (positionRef.current.day !== day) {
            element.scrollTop = 0;
            time = nowRef.current >= dayStart && nowRef.current < dayEnd ? nowRef.current : dayStart;
        }
        positionRef.current = { day, center: null };
        if (time === null) return;
        element.scrollLeft = Math.max(0, ((time - dayStart) / HOUR_IN_MS) * pixelsPerHour - element.clientWidth / 2);
        if (headerRef.current) headerRef.current.scrollLeft = element.scrollLeft;
        setViewport((previous) => ({ ...previous, left: element.scrollLeft, top: element.scrollTop }));
    }, [dayStart, dayEnd, pixelsPerHour]);
    const zoom = (factor: number) => {
        const element = viewportRef.current;
        if (!element) return;
        const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pixelsPerHour * factor));
        if (next === pixelsPerHour) return;
        positionRef.current.center = dayStart + (element.scrollLeft + element.clientWidth / 2) * HOUR_IN_MS / pixelsPerHour;
        setPixelsPerHour(next);
    };
    const handleSlotSelect = useCallback((value: string | number | null) => {
        if (value === null) return;
        const index = Number(value);
        if (Number.isInteger(index) && index >= 0 && index < slots.length) {
            scrollToTime(dayStart + (index + 0.5) * HALF_HOUR_IN_MS);
        }
    }, [dayStart, slots.length, scrollToTime]);

    useEffect(() => {
        if (hasNextPage && !loading && viewport.height > 0 && viewport.top + viewport.height >= channels.length * ROW_STRIDE - 400) {
            loadNextPage();
        }
    }, [hasNextPage, loading, viewport.top, viewport.height, channels.length, loadNextPage]);

    const initialLoading = loading && channels.length === 0;
    const firstRow = Math.max(0, Math.floor(viewport.top / ROW_STRIDE) - OVERSCAN_ROWS);
    const lastRow = Math.min(channels.length, Math.ceil((viewport.top + viewport.height) / ROW_STRIDE) + OVERSCAN_ROWS);
    const visibleChannels = channels.slice(firstRow, lastRow);
    const rowPadding = { paddingTop: firstRow * ROW_STRIDE, paddingBottom: Math.max(0, channels.length - lastRow) * ROW_STRIDE };
    // Quantize horizontal overscan so small scrolls do not remount programme cells.
    const visibleStart = dayStart + firstTick * tickSize;
    const visibleEnd = dayStart + lastTick * tickSize;

    return (
        <div className={styles['epg-guide']}>
            <div className={styles['epg-day-selector']}>
                <Button className={styles['epg-day-arrow']} role={'button'} disabled={selectedDayIndex <= 0} aria-disabled={selectedDayIndex <= 0} tabIndex={selectedDayIndex <= 0 ? -1 : 0} onClick={() => selectedDayIndex > 0 && onDayChange(days[selectedDayIndex - 1])} aria-label={t('BUTTON_PREV')}>
                    <Icon className={styles['epg-day-arrow-icon']} name={'chevron-back'} />
                </Button>
                {visibleDays.map((day) => (
                    <Button key={day.getTime()} role={'button'} className={`${styles['epg-day-btn']}${day.getTime() === effectiveDay.getTime() ? ` ${styles['epg-day-btn-active']}` : ''}`} onClick={() => onDayChange(day)}>
                        <span className={styles['epg-day-weekday']}>{abbreviate(t(WEEKDAYS[day.getDay()]))}</span>
                        <span className={styles['epg-day-date']}>{day.toDateString() === todayDate.toDateString() ? `${abbreviate(t(MONTHS[day.getMonth()]))} ${day.getDate()}` : day.getDate()}</span>
                    </Button>
                ))}
                <Button className={styles['epg-day-arrow']} role={'button'} disabled={selectedDayIndex >= days.length - 1} aria-disabled={selectedDayIndex >= days.length - 1} tabIndex={selectedDayIndex >= days.length - 1 ? -1 : 0} onClick={() => selectedDayIndex < days.length - 1 && onDayChange(days[selectedDayIndex + 1])} aria-label={t('BUTTON_NEXT')}>
                    <Icon className={styles['epg-day-arrow-icon']} name={'chevron-forward'} />
                </Button>
            </div>
            {error !== null && (
                <div className={styles['epg-error-banner']}>
                    <div className={styles['epg-error-message']}>{error}</div>
                    <Button className={styles['epg-error-retry']} onClick={onRetry}>{t('TRY_AGAIN')}</Button>
                </div>
            )}
            <div className={styles['epg-header-row']}>
                <div className={styles['epg-channel-column-header']} style={{ width: CHANNEL_COLUMN_WIDTH }}>
                    <MultiselectMenu className={styles['epg-time-menu']} options={slots.map((slot) => ({ label: slot.label, value: slot.index }))} value={selectedSlot} onSelect={handleSlotSelect} />
                </div>
                <div ref={headerRef} className={styles['epg-header-viewport']}>
                    <div className={styles['epg-header-time-slots']} style={{ width: totalGridWidth }}>
                        {ticks.map((index) => <div key={index} className={styles['epg-time-slot']} style={{ left: index * tickWidth, width: tickWidth }}>{new Date(dayStart + index * tickSize).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>)}
                    </div>
                </div>
                <div className={styles['epg-zoom-controls']}>
                    <Button role={'button'} aria-label={t('LIVE_TV_ZOOM_OUT', { defaultValue: 'Zoom out' })} disabled={pixelsPerHour <= MIN_SCALE} aria-disabled={pixelsPerHour <= MIN_SCALE} tabIndex={pixelsPerHour > MIN_SCALE ? 0 : -1} onClick={() => zoom(0.5)}><span className={styles['epg-zoom-icon']} aria-hidden={'true'} /></Button>
                    <Button role={'button'} aria-label={t('LIVE_TV_ZOOM_IN', { defaultValue: 'Zoom in' })} disabled={pixelsPerHour >= MAX_SCALE} aria-disabled={pixelsPerHour >= MAX_SCALE} tabIndex={pixelsPerHour < MAX_SCALE ? 0 : -1} onClick={() => zoom(2)}><span className={`${styles['epg-zoom-icon']} ${styles['epg-zoom-in']}`} aria-hidden={'true'} /></Button>
                </div>
            </div>
            <div className={styles['epg-body-row']}>
                <div className={styles['epg-channel-column']} style={{ width: CHANNEL_COLUMN_WIDTH }}>
                    <div ref={channelColumnInnerRef} className={styles['epg-channel-column-inner']} style={initialLoading ? undefined : rowPadding}>
                        {initialLoading ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                            <div key={index} className={styles['epg-channel-cell']} style={{ height: ROW_HEIGHT }}><div className={styles['epg-skeleton']} style={{ width: '60%', height: 18 }} /></div>
                        )) : visibleChannels.map((channel) => (
                            <Button key={channel.id} className={styles['epg-channel-cell']} style={{ height: ROW_HEIGHT }} href={channel.deepLinks?.metaDetailsStreams ?? channel.deepLinks?.metaDetailsVideos ?? undefined} title={channel.name}>
                                {channel.logo ? <img className={styles['epg-channel-logo']} src={channel.logo} alt={channel.name} loading={'lazy'} /> : <div className={styles['epg-channel-name']}>{channel.name}</div>}
                            </Button>
                        ))}
                    </div>
                </div>
                <div ref={viewportRef} className={styles['epg-viewport']} aria-busy={loading} tabIndex={0}>
                    <div className={styles['epg-program-grid']} style={{ width: totalGridWidth }}>
                        {now >= dayStart && now < dayEnd && <div className={styles['epg-now-line']} style={{ left: ((now - dayStart) / HOUR_IN_MS) * pixelsPerHour }} />}
                        {initialLoading ? Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
                            <div key={rowIndex} className={styles['epg-skeleton-row']} style={{ height: ROW_HEIGHT, width: totalGridWidth }}>
                                {getEpgSkeletonPrograms(rowIndex).map((program) => (
                                    <div key={program.index} className={styles['epg-skeleton-program']} style={{ left: (program.startMinutes / 60) * pixelsPerHour, width: (program.durationMinutes / 60) * pixelsPerHour }}>
                                        <div className={styles['epg-skeleton-program-inner']}><div className={styles['epg-skeleton-thumb']} /><div className={styles['epg-skeleton-content']}><div className={styles['epg-skeleton-title']} /><div className={styles['epg-skeleton-time']} /></div></div>
                                    </div>
                                ))}
                            </div>
                        )) : <div style={rowPadding}>
                            {visibleChannels.map((channel) => <EpgGuideRow key={channel.id} channel={channel} programs={programs[channel.id] ?? EMPTY_PROGRAMS} dayStart={dayStart} dayEnd={dayEnd} visibleStart={visibleStart} visibleEnd={visibleEnd} now={now} onProgramClick={onProgramSelect} pixelsPerHour={pixelsPerHour} />)}
                        </div>}
                        {!initialLoading && channels.length === 0 && error === null && <div className={styles['epg-empty']}>{t('NO_STREAM')}</div>}
                        {loading && channels.length > 0 && <div className={styles['epg-loading-more']} role={'status'}>{t('STREAM_LOADING')}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EpgGuide;
