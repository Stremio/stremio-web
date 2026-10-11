// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import { EPGProgram, getEpgProgress } from 'stremio/common/EPG';
import LiveFlag from '../LiveFlag';
import getProgrammeKey from '../getProgrammeKey';
import useFormatters from './useFormatters';
import useReveal from './useReveal';
import styles from './Timeline.less';

type Props = {
    programmes: EPGProgram[],
    now: number,
    selectedKey: string | null,
    nowToken: number,
    onSelect: (key: string) => void,
};

const MINUTE_IN_MS = 60000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;

const renderFallback = () => null;

const getAnchor = (container: HTMLElement) => {
    return container.querySelector<HTMLElement>('[data-now-line]') ?? container.querySelector<HTMLElement>('[aria-pressed="true"]');
};

const getMinutes = (from: number, to: number) => (to - from) / MINUTE_IN_MS;

const Timeline = ({ programmes, now, selectedKey, nowToken, onSelect }: Props) => {
    const { hour, timeRange } = useFormatters(now);
    const containerRef = useRef<HTMLDivElement>(null);

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

    const onBlockClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const { key } = event.currentTarget.dataset;
        if (typeof key === 'string') {
            onSelect(key);
        }
    }, [onSelect]);

    return (
        <div ref={containerRef} className={styles['timeline']} style={{ height: `calc(var(--minute) * ${total} + 0.5rem)` }}>
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
                            data-key={key}
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
                                    <div className={styles['elapsed']} style={{ width: `${progress}%` }} />
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
