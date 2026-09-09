// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import { EPGProgram, HOUR_IN_MS, epgDateKey, epgDayWindow } from 'stremio/common/EPG';
import useScheduleViewport from './useScheduleViewport';
import styles from './LiveTvSchedule.less';

const OVERSCAN = 400;
const TICK_MINUTES = [1, 2, 5, 10, 15, 30, 60, 120, 180, 360];

type Props = {
    programs: EPGProgram[];
    now: number;
    selected: EPGProgram | null;
    onProgramSelect: (program: EPGProgram | null) => void;
};

const LiveTvSchedule = ({ programs, now, selected, onProgramSelect }: Props) => {
    const { t, i18n } = useTranslation();
    const [view, setView] = useState<'agenda' | 'timeline'>('agenda');
    const agendaRef = useRef<HTMLDivElement>(null);
    const agendaScrollRef = useRef<'start' | 'nearest' | null>('start');
    const start = programs.length > 0 ? epgDayWindow(programs[0].startTime).start : 0;
    const end = programs.reduce((latest, program) => Math.max(latest, program.endTime.getTime()), start);
    const active = programs.find((program) => program.endTime.getTime() > now) ?? programs[programs.length - 1];
    const selectedIndex = selected ? programs.indexOf(selected) : -1;
    const { viewportRef, viewport, scale, zoom, focus, showTime, canZoomOut, canZoomIn } = useScheduleViewport(start, view === 'timeline');
    const width = ((end - start) / HOUR_IN_MS) * scale;
    const visibleStart = start + ((viewport.left - OVERSCAN) / scale) * HOUR_IN_MS;
    const visibleEnd = start + ((viewport.left + viewport.width + OVERSCAN) / scale) * HOUR_IN_MS;
    const visiblePrograms = programs.filter((program) => program.endTime.getTime() > visibleStart && program.startTime.getTime() < visibleEnd);
    const tickSize = (TICK_MINUTES.find((minutes) => minutes * scale / 60 >= 75) ?? 360) * 60000;
    const firstTick = start + Math.max(0, Math.floor((visibleStart - start) / tickSize)) * tickSize;
    const ticks = Array.from({ length: Math.max(0, Math.ceil((Math.min(end, visibleEnd) - firstTick) / tickSize)) }, (_, index) => firstTick + index * tickSize);
    const days = [];
    for (let day = epgDayWindow(new Date(Math.max(start, visibleStart))); day.start < Math.min(end, visibleEnd); day = epgDayWindow(new Date(day.end))) {
        days.push(day);
    }
    const position = (time: number) => ((time - start) / HOUR_IN_MS) * scale;
    const formatters = useMemo(() => ({
        time: new Intl.DateTimeFormat(i18n.language, { hour: '2-digit', minute: '2-digit' }),
        day: new Intl.DateTimeFormat(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' }),
        minutes: new Intl.NumberFormat(i18n.language, { style: 'unit', unit: 'minute', unitDisplay: 'short' })
    }), [i18n.language]);
    const timeRange = (program: EPGProgram) => `${formatters.time.format(program.startTime)} - ${formatters.time.format(program.endTime)}`;
    const duration = (program: EPGProgram) => formatters.minutes.format(Math.ceil((program.endTime.getTime() - program.startTime.getTime()) / 60000));
    const dayLabel = (date: Date) => epgDateKey(date) === epgDateKey(new Date(now)) ? t('LIVE_TV_TODAY', { defaultValue: 'Today' })
        : formatters.day.format(date);

    const revealAgenda = useCallback(() => {
        if (agendaScrollRef.current === null) return;
        const element = agendaRef.current;
        const row = element?.querySelector<HTMLElement>('[aria-pressed="true"]');
        if (!element || !row || element.clientHeight === 0) return;
        const headingHeight = element.querySelector<HTMLElement>('[data-day]')?.offsetHeight ?? 0;
        const top = row.offsetTop - headingHeight;
        if (agendaScrollRef.current === 'start' || top < element.scrollTop) element.scrollTop = top;
        else if (row.offsetTop + row.offsetHeight > element.scrollTop + element.clientHeight) {
            element.scrollTop = row.offsetTop + row.offsetHeight - element.clientHeight;
        }
        agendaScrollRef.current = null;
    }, []);

    useLayoutEffect(revealAgenda, [selected?.id, selected?.startTime.getTime(), view, revealAgenda]);

    const select = (program: EPGProgram | null) => {
        agendaScrollRef.current = program ? 'nearest' : 'start';
        onProgramSelect(program);
        const target = program ?? active;
        if (view === 'timeline') {
            if (program) focus(program);
            else showTime(now);
        }
        else if (target === selected) revealAgenda();
    };
    const changeView = (nextView: 'agenda' | 'timeline') => {
        if (nextView === view) return;
        if (nextView === 'agenda') agendaScrollRef.current = 'start';
        setView(nextView);
        if (nextView === 'timeline' && selected) {
            if (selected.startTime.getTime() <= now && now < selected.endTime.getTime()) showTime(now);
            else focus(selected);
        }
    };

    return (
        <section className={styles['schedule']} aria-label={t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}>
            <header className={styles['schedule-header']}>
                <h2>{t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}</h2>
                {programs.length > 0 && <div className={styles['view-controls']}>
                    <Button role={'button'} aria-pressed={view === 'agenda'} onClick={() => changeView('agenda')}>{t('LIVE_TV_AGENDA', { defaultValue: 'Agenda' })}</Button>
                    <Button role={'button'} aria-pressed={view === 'timeline'} onClick={() => changeView('timeline')}>{t('LIVE_TV_TIMELINE', { defaultValue: 'Timeline' })}</Button>
                </div>}
            </header>
            {programs.length > 0 && <div className={styles['navigation']}>
                <div className={styles['program-navigation']}>
                    <Button role={'button'} aria-label={t('LIVE_TV_PREVIOUS_PROGRAM', { defaultValue: 'Previous programme' })} aria-disabled={selectedIndex <= 0} tabIndex={selectedIndex > 0 ? 0 : -1} disabled={selectedIndex <= 0} onClick={() => select(programs[selectedIndex - 1])}><Icon name={'chevron-back'} /></Button>
                    <Button role={'button'} onClick={() => select(null)}>{t('LIVE_TV_NOW', { defaultValue: 'Now' })}</Button>
                    <Button role={'button'} aria-label={t('LIVE_TV_NEXT_PROGRAM', { defaultValue: 'Next programme' })} aria-disabled={selectedIndex >= programs.length - 1} tabIndex={selectedIndex < programs.length - 1 ? 0 : -1} disabled={selectedIndex >= programs.length - 1} onClick={() => select(programs[selectedIndex + 1])}><Icon name={'chevron-forward'} /></Button>
                </div>
                {view === 'timeline' && <div className={styles['zoom-controls']}>
                    <Button role={'button'} aria-label={t('LIVE_TV_ZOOM_OUT', { defaultValue: 'Zoom out' })} aria-disabled={!canZoomOut} tabIndex={canZoomOut ? 0 : -1} disabled={!canZoomOut} onClick={() => zoom(0.5)}><span className={styles['zoom-icon']} aria-hidden={'true'} /></Button>
                    <Button role={'button'} onClick={() => selected && focus(selected, true)}>{t('LIVE_TV_FIT_SELECTED', { defaultValue: 'Fit selected' })}</Button>
                    <Button role={'button'} aria-label={t('LIVE_TV_ZOOM_IN', { defaultValue: 'Zoom in' })} aria-disabled={!canZoomIn} tabIndex={canZoomIn ? 0 : -1} disabled={!canZoomIn} onClick={() => zoom(2)}><span className={classNames(styles['zoom-icon'], styles['zoom-in'])} aria-hidden={'true'} /></Button>
                </div>}
            </div>}
            <div ref={agendaRef} className={styles['agenda']} hidden={view !== 'agenda' || programs.length === 0}>
                {view === 'agenda' && programs.map((program, index) => <React.Fragment key={program.id ?? program.startTime.getTime()}>
                    {(index === 0 || epgDateKey(program.startTime) !== epgDateKey(programs[index - 1].startTime)) && <div className={styles['agenda-day']} data-day={true}>{dayLabel(program.startTime)}</div>}
                    <Button
                        role={'button'}
                        className={styles['agenda-program']}
                        aria-pressed={program === selected}
                        aria-current={program.startTime.getTime() <= now && now < program.endTime.getTime() ? 'true' : undefined}
                        aria-label={`${program.title} · ${timeRange(program)} · ${duration(program)}`}
                        onClick={() => select(program)}
                    >
                        <div className={styles['agenda-time']}>
                            <span>{formatters.time.format(program.startTime)}</span>
                            <span>{formatters.time.format(program.endTime)}</span>
                        </div>
                        <div className={styles['agenda-thumbnail']}><Image src={program.thumbnail ?? program.channelLogo ?? ''} alt={''} renderFallback={() => <Icon name={'tv'} />} /></div>
                        <strong>{program.title}</strong>
                        <span className={styles['duration']}>{duration(program)}</span>
                    </Button>
                </React.Fragment>)}
            </div>
            <div ref={viewportRef} className={styles['schedule-viewport']} tabIndex={0} hidden={view !== 'timeline' || programs.length === 0}>
                <div className={styles['timeline']} style={{ width }}>
                    <div className={styles['days']}>
                        {days.map((day) => <div key={day.start} className={styles['day']} style={{ left: position(day.start), width: position(Math.min(day.end, end)) - position(day.start) }}><span>{dayLabel(new Date(day.start))}</span></div>)}
                    </div>
                    <div className={styles['times']} aria-hidden={'true'}>
                        {ticks.map((time) => <span key={time} style={{ left: position(time) }}>{formatters.time.format(time)}</span>)}
                    </div>
                    <div className={styles['programs']}>
                        {visiblePrograms.map((program) => {
                            const isCurrent = program.startTime.getTime() <= now && now < program.endTime.getTime();
                            const left = position(program.startTime.getTime());
                            const width = position(program.endTime.getTime()) - left;
                            return <div key={program.id ?? program.startTime.getTime()} className={classNames(styles['program'], { [styles['compact']]: width < 100, [styles['tiny']]: width < 24 })} style={{ left, width }}>
                                <Button
                                    role={'button'}
                                    className={styles['program-card']}
                                    style={{ '--content-width': `${Math.min(width, viewport.width)}px` }}
                                    tabIndex={width < 24 ? -1 : 0}
                                    aria-current={isCurrent ? 'true' : undefined}
                                    aria-pressed={program === selected}
                                    aria-label={`${program.title} · ${timeRange(program)} · ${duration(program)}`}
                                    onClick={() => onProgramSelect(program)}
                                >
                                    <span className={styles['program-label']}><strong>{program.title}</strong><span>{duration(program)}</span></span>
                                    <Icon name={'details'} className={styles['compact-icon']} />
                                </Button>
                            </div>;
                        })}
                    </div>
                    {now >= start && now < end && <div className={styles['now-line']} style={{ left: position(now) }} aria-hidden={'true'} />}
                </div>
            </div>
            {programs.length === 0 && <div className={styles['empty-schedule']}><Icon name={'calendar'} /><p>{t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' })}</p></div>}
        </section>
    );
};

export default LiveTvSchedule;
