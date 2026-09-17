// Copyright (C) 2017-2026 Smart code 203358507

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { type EPGChannel, type EPGProgram, HOUR_IN_MS, programStartMs, programEndMs } from 'stremio/common/EPG';
import styles from './Row.less';

const COMPACT_WIDTH = 80;
const ICON_MIN_WIDTH = 20;

type Props = {
    channel: EPGChannel;
    programs: EPGProgram[];
    currentProgramIndex: number;
    dayStart: number;
    dayEnd: number;
    visibleStart: number;
    visibleEnd: number;
    pixelsPerHour: number;
    onProgramClick: (program: EPGProgram, channel: EPGChannel) => void;
};

const formatTime = (time: number) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Row = ({ channel, programs, currentProgramIndex, dayStart, dayEnd, visibleStart, visibleEnd, pixelsPerHour, onProgramClick }: Props) => {
    const { t } = useTranslation();
    const totalWidth = ((dayEnd - dayStart) / HOUR_IN_MS) * pixelsPerHour;
    const channelHref = channel.deepLinks?.metaDetailsStreams ?? channel.deepLinks?.metaDetailsVideos ?? null;

    return (
        <div className={styles['row']}>
            <div className={styles['programs']} style={{ width: totalWidth }}>
                {programs.map((program, index) => {
                    const startMs = programStartMs(program);
                    const endMs = programEndMs(program);
                    if (endMs <= visibleStart || startMs >= visibleEnd) {
                        return null;
                    }

                    const left = Math.max(0, ((startMs - dayStart) / HOUR_IN_MS) * pixelsPerHour);
                    const width = ((Math.min(endMs, dayEnd) - Math.max(startMs, dayStart)) / HOUR_IN_MS) * pixelsPerHour;
                    const compact = width < COMPACT_WIDTH;
                    return (
                        <div
                            key={program.id ?? startMs}
                            className={classNames(styles['program'], { [styles['current']]: index === currentProgramIndex, [styles['compact']]: compact })}
                            style={{ left, width }}
                        >
                            <Button
                                role={'button'}
                                className={styles['program-inner']}
                                style={{ width: width - Math.min(4, width / 4) }}
                                title={program.title}
                                onClick={() => onProgramClick(program, channel)}
                            >
                                {
                                    compact && width >= ICON_MIN_WIDTH ?
                                        <Icon className={styles['program-icon']} name={'details'} />
                                        :
                                        null
                                }
                                {
                                    program.thumbnail ?
                                        <div className={styles['program-thumb']} style={{ backgroundImage: `url('${program.thumbnail}')` }} />
                                        :
                                        null
                                }
                                <div className={styles['program-content']}>
                                    <div className={styles['program-title']}>{program.title}</div>
                                    <div className={styles['program-time']}>
                                        {formatTime(startMs)}
                                        <span>-</span>
                                        {formatTime(endMs)}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    );
                })}
                {
                    programs.length === 0 ?
                        <Button className={classNames(styles['program-inner'], styles['no-programs'])} href={channelHref ?? undefined} title={channel.name}>
                            <div className={styles['program-content']}>
                                <div className={styles['program-title']}>{channel.name}</div>
                                <div className={styles['program-time']}>
                                    {t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' })}
                                </div>
                            </div>
                        </Button>
                        :
                        null
                }
            </div>
        </div>
    );
};

export default memo(Row);
