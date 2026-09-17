// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import { EPGProgram, EPG_TICK_MINUTES, HOUR_IN_MS, epgDayWindow } from 'stremio/common/EPG';
import useFormatters from '../useFormatters';
import styles from './Timeline.less';

const OVERSCAN_PX = 400;
const MIN_TICK_WIDTH_PX = 75;
const COMPACT_WIDTH_PX = 100;
const ICON_ONLY_WIDTH_PX = 56;
const TINY_WIDTH_PX = 24;
const THUMBNAIL_WIDTH_PX = 180;

type Props = {
    viewportRef: React.RefObject<HTMLDivElement>;
    viewport: { left: number; width: number };
    scale: number;
    start: number;
    end: number;
    programs: EPGProgram[];
    now: number;
    selected: EPGProgram | null;
    visible: boolean;
    onSelect: (program: EPGProgram) => void;
};

const renderThumbnailFallback = () => <Icon name={'tv'} />;

const Timeline = ({ viewportRef, viewport, scale, start, end, programs, now, selected, visible, onSelect }: Props) => {
    const { time, timeRange, duration, dayLabel } = useFormatters(now);
    const width = ((end - start) / HOUR_IN_MS) * scale;
    const visibleStart = start + ((viewport.left - OVERSCAN_PX) / scale) * HOUR_IN_MS;
    const visibleEnd = start + ((viewport.left + viewport.width + OVERSCAN_PX) / scale) * HOUR_IN_MS;
    const tickMinutes = EPG_TICK_MINUTES.find((minutes) => minutes * scale / 60 >= MIN_TICK_WIDTH_PX) ?? EPG_TICK_MINUTES[EPG_TICK_MINUTES.length - 1];
    const tickSize = tickMinutes * 60000;
    const firstTick = start + Math.max(0, Math.floor((visibleStart - start) / tickSize)) * tickSize;
    const ticks = Array.from({ length: Math.max(0, Math.ceil((Math.min(end, visibleEnd) - firstTick) / tickSize)) }, (_, index) => firstTick + index * tickSize);
    const days = [];
    for (let day = epgDayWindow(new Date(Math.max(start, visibleStart))); day.start < Math.min(end, visibleEnd); day = epgDayWindow(new Date(day.end))) {
        days.push(day);
    }
    const position = (value: number) => ((value - start) / HOUR_IN_MS) * scale;

    return (
        <div ref={viewportRef} className={styles['viewport']} tabIndex={0} hidden={!visible}>
            <div className={styles['timeline']} style={{ width }}>
                <div className={styles['days']}>
                    {days.map((day) => (
                        <div
                            key={day.start}
                            className={styles['day']}
                            style={{ left: position(day.start), width: position(Math.min(day.end, end)) - position(day.start) }}
                        >
                            <div className={styles['day-label']}>{dayLabel(new Date(day.start))}</div>
                        </div>
                    ))}
                </div>
                <div className={styles['times']} aria-hidden={'true'}>
                    {ticks.map((tick) => (
                        <div key={tick} className={styles['time']} style={{ left: position(tick) }}>
                            {time(tick)}
                        </div>
                    ))}
                </div>
                <div className={styles['programs']}>
                    {programs.map((program) => {
                        const startTime = program.startTime.getTime();
                        const endTime = program.endTime.getTime();
                        if (endTime <= visibleStart || startTime >= visibleEnd) {
                            return null;
                        }

                        const left = position(startTime);
                        const programWidth = position(endTime) - left;
                        const contentWidth = Math.min(programWidth, viewport.width);
                        const inView = left + programWidth > viewport.left && left < viewport.left + viewport.width;
                        const isCurrent = startTime <= now && now < endTime;
                        return (
                            <div
                                key={program.id ?? startTime}
                                className={classNames(styles['program'], {
                                    [styles['visible']]: inView,
                                    [styles['selected']]: program === selected,
                                    [styles['current']]: isCurrent,
                                    [styles['compact']]: programWidth < COMPACT_WIDTH_PX,
                                    [styles['icon-only']]: programWidth < ICON_ONLY_WIDTH_PX,
                                    [styles['tiny']]: programWidth < TINY_WIDTH_PX,
                                    [styles['with-thumbnail']]: contentWidth >= THUMBNAIL_WIDTH_PX,
                                })}
                                style={{ left, width: programWidth }}
                            >
                                <Button
                                    role={'button'}
                                    className={styles['card']}
                                    style={{
                                        '--content-width': `${contentWidth}px`,
                                        '--viewport-width': `${viewport.width}px`,
                                        '--preview-left': `${Math.max(0, viewport.left - left)}px`,
                                        '--preview-space': `${viewport.width - Math.max(0, left - viewport.left)}px`,
                                    }}
                                    tabIndex={programWidth < TINY_WIDTH_PX ? -1 : 0}
                                    aria-current={isCurrent ? 'true' : undefined}
                                    aria-pressed={program === selected}
                                    aria-label={`${program.title} · ${timeRange(program)} · ${duration(program)}`}
                                    onClick={() => onSelect(program)}
                                >
                                    <div className={styles['thumbnail']}>
                                        <Image src={program.thumbnail ?? program.channelLogo ?? ''} alt={''} renderFallback={renderThumbnailFallback} />
                                    </div>
                                    <div className={styles['label']}>
                                        <div className={styles['name']}>{program.title}</div>
                                        <div className={styles['duration']}>{duration(program)}</div>
                                    </div>
                                    <Icon className={styles['compact-icon']} name={'details'} />
                                </Button>
                            </div>
                        );
                    })}
                </div>
                {
                    now >= start && now < end ?
                        <div className={styles['now-line']} style={{ left: position(now) }} aria-hidden={'true'} />
                        :
                        null
                }
            </div>
        </div>
    );
};

export default Timeline;
