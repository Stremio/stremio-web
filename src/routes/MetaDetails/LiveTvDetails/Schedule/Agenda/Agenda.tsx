// Copyright (C) 2017-2026 Smart code 203358507

import React, { forwardRef } from 'react';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import { EPGProgram, epgDateKey } from 'stremio/common/EPG';
import useFormatters from '../useFormatters';
import styles from './Agenda.less';

type Props = {
    programs: EPGProgram[];
    now: number;
    selected: EPGProgram | null;
    visible: boolean;
    onSelect: (program: EPGProgram) => void;
};

const renderThumbnailFallback = () => <Icon name={'tv'} />;

const Agenda = forwardRef<HTMLDivElement, Props>(({ programs, now, selected, visible, onSelect }, ref) => {
    const { time, timeRange, duration, dayLabel } = useFormatters(now);

    return (
        <div ref={ref} className={styles['agenda']} hidden={!visible}>
            {
                visible ?
                    programs.map((program, index) => {
                        const startTime = program.startTime.getTime();
                        const endTime = program.endTime.getTime();
                        const startsNewDay = index === 0 || epgDateKey(program.startTime) !== epgDateKey(programs[index - 1].startTime);
                        return (
                            <React.Fragment key={program.id ?? startTime}>
                                {
                                    startsNewDay ?
                                        <div className={styles['day']}>{dayLabel(program.startTime)}</div>
                                        :
                                        null
                                }
                                <Button
                                    role={'button'}
                                    className={styles['program']}
                                    aria-pressed={program === selected}
                                    aria-current={startTime <= now && now < endTime ? 'true' : undefined}
                                    aria-label={`${program.title} · ${timeRange(program)} · ${duration(program)}`}
                                    onClick={() => onSelect(program)}
                                >
                                    <div className={styles['time']}>
                                        <div>{time(program.startTime)}</div>
                                        <div>{time(program.endTime)}</div>
                                    </div>
                                    <div className={styles['thumbnail']}>
                                        <Image src={program.thumbnail ?? program.channelLogo ?? ''} alt={''} renderFallback={renderThumbnailFallback} />
                                    </div>
                                    <div className={styles['title']}>{program.title}</div>
                                    <div className={styles['duration']}>{duration(program)}</div>
                                </Button>
                            </React.Fragment>
                        );
                    })
                    :
                    null
            }
        </div>
    );
});

Agenda.displayName = 'Agenda';

export default Agenda;
