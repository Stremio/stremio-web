// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import ProgressBar from 'stremio/components/ProgressBar';
import { EPGProgram, getEpgProgress } from 'stremio/common/EPG';
import { getInterfaceRect } from 'stremio/common/interfaceScale';
import LiveFlag from '../LiveFlag';
import getProgrammeKey from '../getProgrammeKey';
import useFormatters from './useFormatters';
import useReveal from './useReveal';
import { getScrollParent, scrollToFraction } from './scroll';
import styles from './Timeline.less';

type Props = {
    programmes: EPGProgram[],
    now: number,
    selectedKey: string | null,
    nowToken: number,
    fitToken: number,
    scale: number,
    onSelect: (key: string) => void,
    onScale: (scale: number) => void,
};

const MINUTE_IN_MS = 60000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const FIT_FRACTION = 0.55;
const FIT_ANCHOR = 0.25;

const renderFallback = () => null;

const getAnchor = (container: HTMLElement) => {
    return container.querySelector<HTMLElement>('[data-now-line]') ?? container.querySelector<HTMLElement>('[aria-pressed="true"]');
};

const getSelected = (container: HTMLElement) => {
    return container.querySelector<HTMLElement>('[aria-pressed="true"]') ?? container.querySelector<HTMLElement>('[aria-current="true"]');
};

const getMinutes = (from: number, to: number) => (to - from) / MINUTE_IN_MS;

const getRootFontSize = () => parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;

const Timeline = ({ programmes, now, selectedKey, nowToken, fitToken, scale, onSelect, onScale }: Props) => {
    const { hour, timeRange } = useFormatters(now);
    const containerRef = useRef<HTMLDivElement>(null);
    const appliedScaleRef = useRef(scale);
    const fitTokenRef = useRef<number | null>(null);
    const revealAfterScaleRef = useRef(false);

    const { origin, total, hours } = useMemo(() => {
        const first = Math.min(...programmes.map((programme) => programme.startTime.getTime()));
        const last = Math.max(...programmes.map((programme) => programme.endTime.getTime()));
        const origin = Math.floor(first / HOUR_IN_MS) * HOUR_IN_MS;
        const end = Math.ceil(last / HOUR_IN_MS) * HOUR_IN_MS;

        return {
            origin,
            total: getMinutes(origin, end),
            hours: Array.from({ length: Math.round((end - origin) / HOUR_IN_MS) + 1 }, (_, index) => origin + index * HOUR_IN_MS),
        };
    }, [programmes]);

    useReveal(containerRef, selectedKey, nowToken, getAnchor, true);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const parent = container !== null ? getScrollParent(container) : null;
        const previous = appliedScaleRef.current;
        appliedScaleRef.current = scale;
        if (!container || !parent || previous === scale) {
            return;
        }

        const containerTop = getInterfaceRect(container).top - getInterfaceRect(parent).top + parent.scrollTop;
        const rootFontSize = getRootFontSize();
        const centerMinute = (parent.scrollTop + parent.clientHeight / 2 - containerTop) / (previous * rootFontSize);
        parent.scrollTop = containerTop + centerMinute * scale * rootFontSize - parent.clientHeight / 2;

        if (revealAfterScaleRef.current) {
            revealAfterScaleRef.current = false;
            const selected = getSelected(container);
            if (selected) {
                scrollToFraction(selected, FIT_ANCHOR, true);
            }
        }
    }, [scale]);

    useLayoutEffect(() => {
        if (fitTokenRef.current === fitToken) {
            return;
        }

        const mounting = fitTokenRef.current === null;
        fitTokenRef.current = fitToken;
        const container = containerRef.current;
        const parent = container !== null ? getScrollParent(container) : null;
        const selected = container !== null ? getSelected(container) : null;
        const minutes = selected !== null ? Number(selected.dataset.minutes) : 0;
        if (!parent || !selected || !(minutes > 0)) {
            return;
        }

        const target = (parent.clientHeight * FIT_FRACTION) / minutes / getRootFontSize();
        if (Math.abs(target - scale) < 0.0001) {
            if (!mounting) {
                scrollToFraction(selected, FIT_ANCHOR, true);
            }
            return;
        }

        revealAfterScaleRef.current = !mounting;
        onScale(target);
    }, [fitToken, scale, onScale]);

    const onBlockClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const { key } = event.currentTarget.dataset;
        if (typeof key === 'string') {
            onSelect(key);
        }
    }, [onSelect]);

    return (
        <div ref={containerRef} className={styles['timeline']} style={{ '--minute': `${scale}rem`, height: `calc(var(--minute) * ${total} + 0.5rem)` } as React.CSSProperties}>
            {
                hours.map((value) => (
                    <div key={value} className={styles['hour']} style={{ top: `calc(var(--minute) * ${getMinutes(origin, value)})` }} aria-hidden={'true'}>
                        <div className={styles['hour-label']}>{hour(value)}</div>
                    </div>
                ))
            }
            {
                programmes.map((programme) => {
                    const key = getProgrammeKey(programme);
                    const progress = getEpgProgress(programme, now);
                    const live = progress !== null;
                    const past = programme.endTime.getTime() <= now;
                    const start = getMinutes(origin, programme.startTime.getTime());
                    const length = getMinutes(programme.startTime.getTime(), programme.endTime.getTime());

                    return (
                        <Button
                            key={key}
                            className={classNames(styles['block'], { [styles['past']]: past })}
                            style={{
                                top: `calc(var(--minute) * ${start} + 0.1875rem)`,
                                height: `max(1.5rem, calc(var(--minute) * ${length} - 0.375rem))`,
                            }}
                            role={'button'}
                            aria-pressed={key === selectedKey}
                            aria-current={live ? 'true' : undefined}
                            aria-label={`${programme.title}, ${timeRange(programme)}`}
                            title={`${programme.title}, ${timeRange(programme)}`}
                            data-key={key}
                            data-minutes={length}
                            onClick={onBlockClick}
                        >
                            {
                                typeof programme.thumbnail === 'string' && programme.thumbnail.length > 0 ?
                                    <Image className={styles['image']} src={programme.thumbnail} alt={''} renderFallback={renderFallback} />
                                    :
                                    null
                            }
                            <div className={styles['scrim']} />
                            <div className={styles['title']}>{programme.title}</div>
                            <div className={styles['meta']}>
                                {
                                    live ?
                                        <LiveFlag />
                                        :
                                        null
                                }
                                <div className={styles['range']}>{timeRange(programme)}</div>
                            </div>
                            {
                                live ?
                                    <ProgressBar className={styles['progress']} value={progress} />
                                    :
                                    null
                            }
                        </Button>
                    );
                })
            }
            {
                now >= origin && now <= origin + total * MINUTE_IN_MS ?
                    <div
                        className={styles['now-line']}
                        style={{ top: `calc(var(--minute) * ${getMinutes(origin, now)})` }}
                        data-now-line={'true'}
                        aria-hidden={'true'}
                    />
                    :
                    null
            }
        </div>
    );
};

export default Timeline;
