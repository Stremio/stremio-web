// Copyright (C) 2017-2026 Smart code 203358507

import React, { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import Image from 'stremio/components/Image';
import MetaLinks from 'stremio/components/MetaPreview/MetaLinks';
import { EPGChannel, EPGProgram, formatEpgTimeRange, getEpgProgress } from 'stremio/common/EPG';
import styles from './Hero.less';

type Props = {
    channel: EPGChannel;
    addonName: string;
    description?: string | null;
    hasSchedule: boolean;
    selected: EPGProgram | null;
    now: number;
    children?: React.ReactNode;
};

const renderChannelIcon = () => <Icon name={'tv'} />;

const Hero = ({ channel, addonName, description, hasSchedule, selected, now, children }: Props) => {
    const { t, i18n } = useTranslation();
    const informationRef = useRef<HTMLDivElement>(null);
    const selectedStartTime = selected?.startTime.getTime();
    const progress = selected ? getEpgProgress(selected, now) : null;
    const status = progress !== null || selected === null ? 'live' : selected.endTime.getTime() <= now ? 'aired' : 'upcoming';
    const dateLabel = selected?.startTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' });
    const genres = selected?.genres?.length ?
        selected.genres
        :
        selected?.links?.filter(({ category }) => category === 'Genres').map(({ name }) => name) ?? [];
    const ratings = selected?.ratings?.filter((rating) => rating.value.trim()) ?? [];
    const fallbackDescription = hasSchedule ? null : t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' });

    useLayoutEffect(() => {
        if (informationRef.current) informationRef.current.scrollTop = 0;
    }, [selected?.id, selectedStartTime]);

    return (
        <div className={styles['hero']} aria-label={selected?.title ?? channel.name}>
            <div className={styles['hero-content']}>
                <div className={styles['channel-header']}>
                    <div className={styles['channel-logo']}>
                        {
                            channel.logo ?
                                <Image src={channel.logo} alt={''} renderFallback={renderChannelIcon} />
                                :
                                <Icon name={'tv'} />
                        }
                    </div>
                    <div className={styles['channel-identity']}>
                        <div className={styles['channel-name']}>{channel.name}</div>
                        <div className={styles['addon-name']}>{addonName}</div>
                    </div>
                </div>
                <div ref={informationRef} className={styles['current-information']}>
                    <div aria-live={'polite'} aria-atomic={'true'}>
                        <div className={styles['current-time']}>
                            {
                                status === 'live' ?
                                    <div className={styles['live-badge']}>
                                        <div className={styles['live-dot']} />
                                        {t('PLAYER_LIVE')}
                                    </div>
                                    :
                                    <div className={styles['program-status']}>
                                        {status === 'aired' ? t('AIRED') : t('UPCOMING')}
                                    </div>
                            }
                            {
                                dateLabel ?
                                    <div>{dateLabel}</div>
                                    :
                                    null
                            }
                            {
                                selected !== null ?
                                    <div>{formatEpgTimeRange(selected.startTime, selected.endTime, i18n.language)}</div>
                                    :
                                    null
                            }
                            {
                                selected?.runtime ?
                                    <div>{selected.runtime}</div>
                                    :
                                    null
                            }
                            {ratings.map((rating, index) => (
                                <div
                                    key={`${rating.system}:${rating.value}:${index}`}
                                    className={styles['content-rating']}
                                    title={rating.system ? `${rating.system}: ${rating.value}` : rating.value}
                                >
                                    {
                                        rating.icon ?
                                            <Image src={rating.icon} alt={rating.value} renderFallback={() => rating.value} />
                                            :
                                            rating.value
                                    }
                                </div>
                            ))}
                        </div>
                        <div className={styles['title']}>
                            {selected?.title ?? t('LIVE_TV_NO_PROGRAM', { defaultValue: 'No programme information right now' })}
                        </div>
                    </div>
                    <div className={styles['description']}>
                        {selected?.overview ?? description ?? fallbackDescription}
                    </div>
                    {
                        genres.length > 0 ?
                            <MetaLinks className={styles['genres']} label={'Genres'} links={genres.map((genre) => ({ label: genre }))} />
                            :
                            null
                    }
                    {
                        progress !== null && selected !== null ?
                            <div className={styles['broadcast-progress']}>
                                <div className={styles['progress-track']}>
                                    <div style={{ width: `${progress}%` }} />
                                </div>
                                <div>{t('CONTINUE_WATCHING_TIME_LEFT', { minutes: Math.ceil((selected.endTime.getTime() - now) / 60000) })}</div>
                            </div>
                            :
                            null
                    }
                </div>
                {children}
            </div>
        </div>
    );
};

export default Hero;
