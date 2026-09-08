// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import { EPGProgram, HOUR_IN_MS, epgDateKey, epgDayWindow, formatEpgTimeRange } from 'stremio/common/EPG';
import useScheduleViewport from './useScheduleViewport';
import styles from './LiveTvSchedule.less';

const OVERSCAN = 400;
const TICK_MINUTES = [1, 2, 5, 10, 15, 30, 60, 120, 180, 360];

type Props = {
    programs: EPGProgram[];
    now: number;
    onProgramSelect: (program: EPGProgram) => void;
};

const LiveTvSchedule = ({ programs, now, onProgramSelect }: Props) => {
    const { t, i18n } = useTranslation();
    const start = programs.length > 0 ? epgDayWindow(programs[0].startTime).start : 0;
    const end = programs.reduce((latest, program) => Math.max(latest, program.endTime.getTime()), start);
    const active = programs.find((program) => program.endTime.getTime() > now) ?? programs[programs.length - 1];
    const activeStart = active?.startTime.getTime();
    const { viewportRef, viewport, scale, automatic, zoom, fit, canZoomOut, canZoomIn } = useScheduleViewport(programs, start, activeStart);
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

    return (
        <section className={styles['schedule']} aria-label={t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}>
            <header className={styles['schedule-header']}>
                <h2>{t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}</h2>
                {programs.length > 0 && <div className={styles['zoom-controls']}>
                    <Button role={'button'} aria-label={t('LIVE_TV_ZOOM_OUT', { defaultValue: 'Zoom out' })} aria-disabled={!canZoomOut} tabIndex={canZoomOut ? 0 : -1} disabled={!canZoomOut} onClick={() => zoom(0.5)}><span className={styles['zoom-icon']} aria-hidden={'true'} /></Button>
                    <Button role={'button'} aria-pressed={automatic} className={classNames({ [styles['automatic']]: automatic })} onClick={fit}>{t('LIVE_TV_ZOOM_AUTO', { defaultValue: 'Auto' })}</Button>
                    <Button role={'button'} aria-label={t('LIVE_TV_ZOOM_IN', { defaultValue: 'Zoom in' })} aria-disabled={!canZoomIn} tabIndex={canZoomIn ? 0 : -1} disabled={!canZoomIn} onClick={() => zoom(2)}><span className={classNames(styles['zoom-icon'], styles['zoom-in'])} aria-hidden={'true'} /></Button>
                </div>}
            </header>
            <div ref={viewportRef} className={styles['schedule-viewport']} tabIndex={0}>
                {programs.length > 0 ? <div className={styles['timeline']} style={{ width }}>
                    <div className={styles['days']}>
                        {days.map((day) => <div key={day.start} className={styles['day']} style={{ left: position(day.start), width: position(Math.min(day.end, end)) - position(day.start) }}>
                            <span>{epgDateKey(new Date(day.start)) === epgDateKey(new Date(now)) ? t('LIVE_TV_TODAY', { defaultValue: 'Today' }) : new Date(day.start).toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        </div>)}
                    </div>
                    <div className={styles['times']} aria-hidden={'true'}>
                        {ticks.map((time) => <span key={time} style={{ left: position(time) }}>{new Date(time).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>)}
                    </div>
                    <div className={styles['programs']}>
                        {visiblePrograms.map((program) => {
                            const isCurrent = program.startTime.getTime() <= now && now < program.endTime.getTime();
                            const aired = program.endTime.getTime() <= now;
                            const left = position(program.startTime.getTime());
                            const width = position(program.endTime.getTime()) - left;
                            const visibleWidth = Math.max(0, Math.min(left + width, viewport.left + viewport.width) - Math.max(left, viewport.left));
                            const contentWidth = visibleWidth || Math.min(width, viewport.width);
                            return <Button
                                key={program.id}
                                role={'button'}
                                className={classNames(styles['program'], { [styles['current']]: isCurrent, [styles['aired']]: aired, [styles['compact']]: width < 120, [styles['wide']]: contentWidth > 560 })}
                                style={{ left, width, '--content-width': `${contentWidth}px` }}
                                aria-current={isCurrent ? 'true' : undefined}
                                aria-label={`${program.title} · ${formatEpgTimeRange(program.startTime, program.endTime, i18n.language)}`}
                                onClick={() => onProgramSelect(program)}
                            >
                                <div className={styles['program-card']}>
                                    <div className={styles['program-thumbnail']}>
                                        <Image src={program.thumbnail ?? program.channelLogo ?? ''} alt={''} renderFallback={() => <Icon name={'tv'} />} className={program.thumbnail ? undefined : styles['channel-thumbnail']} />
                                    </div>
                                    <div className={styles['program-info']}>
                                        <span>{formatEpgTimeRange(program.startTime, program.endTime, i18n.language)}</span>
                                        <strong>{program.title}</strong>
                                        {program.overview && <p>{program.overview}</p>}
                                        <span>{isCurrent ? t('LIVE_TV_ON_NOW', { defaultValue: 'On now' }) : aired ? t('AIRED') : t('UPCOMING')}</span>
                                        <Icon name={'details'} className={styles['compact-icon']} />
                                    </div>
                                </div>
                            </Button>;
                        })}
                    </div>
                    {now >= start && now < end && <div className={styles['now-line']} style={{ left: position(now) }} aria-hidden={'true'} />}
                </div> : <div className={styles['empty-schedule']}><Icon name={'calendar'} /><p>{t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' })}</p></div>}
            </div>
        </section>
    );
};

export default LiveTvSchedule;
