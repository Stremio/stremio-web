// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import ProgressBar from 'stremio/components/ProgressBar';
import { EPGProgram, epgDateKey, getEpgProgress } from 'stremio/common/EPG';
import LiveFlag from '../LiveFlag';
import getProgrammeKey from '../getProgrammeKey';
import useFormatters from './useFormatters';
import useReveal from './useReveal';
import useLiveVisible from './useLiveVisible';
import styles from './Agenda.less';

type Props = {
    programmes: EPGProgram[],
    now: number,
    selectedKey: string | null,
    nowToken: number,
    isMobile: boolean,
    onSelect: (key: string) => void,
    onLiveVisible?: (visible: boolean) => void,
};

type Day = {
    key: string,
    label: string,
    programmes: EPGProgram[],
};

const renderFallback = () => null;

const getSelectedRow = (container: HTMLElement) => container.querySelector<HTMLElement>('[aria-pressed="true"]');

const Agenda = ({ programmes, now, selectedKey, nowToken, isMobile, onSelect, onLiveVisible }: Props) => {
    const { time, timeRange, duration, dayLabel } = useFormatters(now);
    const containerRef = useRef<HTMLDivElement>(null);

    const days = useMemo(() => {
        return programmes.reduce<Day[]>((days, programme) => {
            const key = epgDateKey(programme.startTime);
            const day = days[days.length - 1];
            if (day?.key === key) {
                day.programmes.push(programme);
            } else {
                days.push({ key, label: dayLabel(programme.startTime), programmes: [programme] });
            }

            return days;
        }, []);
    }, [programmes, dayLabel]);

    useReveal(containerRef, selectedKey, nowToken, getSelectedRow, !isMobile);
    useLiveVisible(containerRef, now, onLiveVisible);

    const onRowClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const { key } = event.currentTarget.dataset;
        if (typeof key === 'string') {
            onSelect(key);
        }
    }, [onSelect]);

    return (
        <div ref={containerRef} className={styles['agenda']}>
            {
                days.map((day) => (
                    <div key={day.key} className={styles['day']} role={'group'} aria-label={day.label}>
                        <div className={styles['day-label']}>{day.label}</div>
                        {
                            day.programmes.map((programme) => {
                                const key = getProgrammeKey(programme);
                                const progress = getEpgProgress(programme, now);
                                const live = progress !== null;
                                const past = programme.endTime.getTime() <= now;

                                return (
                                    <Button
                                        key={key}
                                        className={classNames(styles['row'], { [styles['past']]: past })}
                                        role={'button'}
                                        aria-pressed={key === selectedKey}
                                        aria-current={live ? 'true' : undefined}
                                        aria-label={`${programme.title}, ${timeRange(programme)}`}
                                        data-key={key}
                                        onClick={onRowClick}
                                    >
                                        <div className={styles['start']}>{time(programme.startTime)}</div>
                                        {
                                            !isMobile ?
                                                <div className={styles['thumbnail']}>
                                                    {
                                                        typeof programme.thumbnail === 'string' && programme.thumbnail.length > 0 ?
                                                            <Image className={styles['image']} src={programme.thumbnail} alt={''} renderFallback={renderFallback} />
                                                            :
                                                            null
                                                    }
                                                </div>
                                                :
                                                null
                                        }
                                        <div className={styles['info']}>
                                            <div className={styles['title']}>{programme.title}</div>
                                            <div className={styles['meta']}>
                                                {
                                                    live ?
                                                        <LiveFlag />
                                                        :
                                                        null
                                                }
                                                <div className={styles['range']}>{duration(programme)}</div>
                                            </div>
                                            {
                                                live ?
                                                    <ProgressBar className={styles['progress']} value={progress} />
                                                    :
                                                    null
                                            }
                                        </div>
                                        {
                                            isMobile ?
                                                <Icon className={styles['chevron']} name={'chevron-forward'} />
                                                :
                                                null
                                        }
                                    </Button>
                                );
                            })
                        }
                    </div>
                ))
            }
        </div>
    );
};

export default Agenda;
