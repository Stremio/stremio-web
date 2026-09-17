// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import { EPGProgram, epgDayWindow } from 'stremio/common/EPG';
import useScheduleViewport from './useScheduleViewport';
import Agenda from './Agenda';
import Timeline from './Timeline';
import styles from './Schedule.less';

type View = 'agenda' | 'timeline';

type Props = {
    programs: EPGProgram[];
    now: number;
    selected: EPGProgram | null;
    onProgramSelect: (program: EPGProgram | null) => void;
};

const Schedule = ({ programs, now, selected, onProgramSelect }: Props) => {
    const { t } = useTranslation();
    const [view, setView] = useState<View>('agenda');
    const agendaRef = useRef<HTMLDivElement>(null);
    const agendaScrollRef = useRef<'start' | 'nearest' | null>('start');
    const start = programs.length > 0 ? epgDayWindow(programs[0].startTime).start : 0;
    const end = programs.reduce((latest, program) => Math.max(latest, program.endTime.getTime()), start);
    const active = programs.find((program) => program.endTime.getTime() > now) ?? programs[programs.length - 1];
    const selectedIndex = selected ? programs.indexOf(selected) : -1;
    const canGoBack = selectedIndex > 0;
    const canGoForward = selectedIndex < programs.length - 1;
    const { viewportRef, viewport, scale, zoom, focus, showTime, canZoomOut, canZoomIn } = useScheduleViewport(start, view === 'timeline');

    const revealAgenda = useCallback(() => {
        if (agendaScrollRef.current === null) return;
        const element = agendaRef.current;
        const row = element?.querySelector<HTMLElement>('[aria-pressed="true"]');
        if (!element || !row || element.clientHeight === 0) return;
        const style = window.getComputedStyle(element);
        const top = row.offsetTop - (parseFloat(style.scrollPaddingTop) || 0);
        const bottom = row.offsetTop + row.offsetHeight + (parseFloat(style.scrollPaddingBottom) || 0);
        if (agendaScrollRef.current === 'start' || top < element.scrollTop) {
            element.scrollTop = top;
        } else if (bottom > element.scrollTop + element.clientHeight) {
            element.scrollTop = bottom - element.clientHeight;
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
        } else if (target === selected) {
            revealAgenda();
        }
    };
    const changeView = (nextView: View) => {
        if (nextView === view) return;
        if (nextView === 'agenda') agendaScrollRef.current = 'start';
        setView(nextView);
        if (nextView === 'timeline' && selected) {
            if (selected.startTime.getTime() <= now && now < selected.endTime.getTime()) showTime(now);
            else focus(selected);
        }
    };
    const onPreviousProgram = () => select(programs[selectedIndex - 1]);
    const onNextProgram = () => select(programs[selectedIndex + 1]);
    const onNow = () => select(null);
    const onZoomOut = () => zoom(0.5);
    const onZoomIn = () => zoom(2);
    const onFitSelected = () => {
        if (selected) focus(selected, true);
    };

    return (
        <div className={styles['schedule']} aria-label={t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}>
            <div className={styles['header']}>
                <div className={styles['title']}>{t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}</div>
                {
                    programs.length > 0 ?
                        <div className={styles['view-controls']}>
                            <Button role={'button'} aria-pressed={view === 'agenda'} onClick={() => changeView('agenda')}>
                                {t('LIVE_TV_AGENDA', { defaultValue: 'Agenda' })}
                            </Button>
                            <Button role={'button'} aria-pressed={view === 'timeline'} onClick={() => changeView('timeline')}>
                                {t('LIVE_TV_TIMELINE', { defaultValue: 'Timeline' })}
                            </Button>
                        </div>
                        :
                        null
                }
            </div>
            {
                programs.length > 0 ?
                    <div className={styles['navigation']}>
                        <div className={styles['program-navigation']}>
                            <Button
                                role={'button'}
                                aria-label={t('LIVE_TV_PREVIOUS_PROGRAM', { defaultValue: 'Previous programme' })}
                                disabled={!canGoBack}
                                aria-disabled={!canGoBack}
                                tabIndex={canGoBack ? 0 : -1}
                                onClick={onPreviousProgram}
                            >
                                <Icon name={'chevron-back'} />
                            </Button>
                            <Button role={'button'} onClick={onNow}>
                                {t('LIVE_TV_NOW', { defaultValue: 'Now' })}
                            </Button>
                            <Button
                                role={'button'}
                                aria-label={t('LIVE_TV_NEXT_PROGRAM', { defaultValue: 'Next programme' })}
                                disabled={!canGoForward}
                                aria-disabled={!canGoForward}
                                tabIndex={canGoForward ? 0 : -1}
                                onClick={onNextProgram}
                            >
                                <Icon name={'chevron-forward'} />
                            </Button>
                        </div>
                        <div className={styles['zoom-controls']} aria-hidden={view !== 'timeline'}>
                            <Button
                                role={'button'}
                                aria-label={t('LIVE_TV_ZOOM_OUT', { defaultValue: 'Zoom out' })}
                                disabled={!canZoomOut}
                                aria-disabled={!canZoomOut}
                                tabIndex={canZoomOut ? 0 : -1}
                                onClick={onZoomOut}
                            >
                                <div className={styles['zoom-icon']} aria-hidden={'true'} />
                            </Button>
                            <Button role={'button'} onClick={onFitSelected}>
                                {t('LIVE_TV_FIT_SELECTED', { defaultValue: 'Fit selected' })}
                            </Button>
                            <Button
                                role={'button'}
                                aria-label={t('LIVE_TV_ZOOM_IN', { defaultValue: 'Zoom in' })}
                                disabled={!canZoomIn}
                                aria-disabled={!canZoomIn}
                                tabIndex={canZoomIn ? 0 : -1}
                                onClick={onZoomIn}
                            >
                                <div className={classNames(styles['zoom-icon'], styles['zoom-in'])} aria-hidden={'true'} />
                            </Button>
                        </div>
                    </div>
                    :
                    null
            }
            <Agenda
                ref={agendaRef}
                programs={programs}
                now={now}
                selected={selected}
                visible={view === 'agenda' && programs.length > 0}
                onSelect={select}
            />
            <Timeline
                viewportRef={viewportRef}
                viewport={viewport}
                scale={scale}
                start={start}
                end={end}
                programs={programs}
                now={now}
                selected={selected}
                visible={view === 'timeline' && programs.length > 0}
                onSelect={onProgramSelect}
            />
            {
                programs.length === 0 ?
                    <div className={styles['empty']}>
                        <Icon name={'calendar'} />
                        <div>{t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' })}</div>
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default Schedule;
