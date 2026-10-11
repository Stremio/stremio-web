// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ProgressBar from 'stremio/components/ProgressBar';
import { EPGProgram, formatEpgTimeRange, getEpgProgress } from 'stremio/common/EPG';
import { parseDate } from '../format';
import Rating from './Rating';
import useFormatters from './Guide/useFormatters';
import getRelativeTime from './getRelativeTime';
import styles from './Programme.less';

type Props = {
    className?: string,
    programme: EPGProgram | null,
    now: number,
    part?: 'full' | 'headline' | 'details',
};

const Programme = ({ className, programme, now, part = 'full' }: Props) => {
    const { t, i18n } = useTranslation();
    const { dayLabel } = useFormatters(now);
    const relativeFormatter = useMemo(() => new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' }), [i18n.language]);

    const progress = programme !== null ? getEpgProgress(programme, now) : null;
    const live = progress !== null;
    const past = programme !== null && programme.endTime.getTime() <= now;
    const year = parseDate(programme?.released)?.getFullYear();
    const facts = [programme?.releaseInfo ?? year?.toString(), programme?.runtime].filter((fact): fact is string => typeof fact === 'string' && fact.length > 0);
    const ratings = programme?.ratings?.filter((rating) => rating.value.trim().length > 0) ?? [];
    const genres = programme?.genres?.length ?
        programme.genres
        :
        programme?.links?.filter(({ category }) => category === 'Genres').map(({ name }) => name) ?? [];
    const timeRange = programme !== null ? formatEpgTimeRange(programme.startTime, programme.endTime, i18n.language) : null;
    const overview = programme !== null ? programme.overview : t('LIVE_TV_NO_SCHEDULE');

    return (
        <div className={classNames(className, styles['programme'])} aria-live={'polite'}>
            {
                part !== 'details' ?
                    <div className={styles['headline']}>
                        {
                            programme !== null ?
                                <div className={styles['status']}>
                                    {
                                        live ?
                                            <div className={styles['live']}>{t('PLAYER_LIVE')}</div>
                                            :
                                            <div className={styles['aired']}>{past ? t('AIRED') : t('UPCOMING')}</div>
                                    }
                                    <div className={styles['when']}>
                                        {dayLabel(programme.startTime)}{timeRange !== null ? ` · ${timeRange}` : ''}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <h1 className={styles['title']}>{programme?.title ?? t('LIVE_TV_NO_PROGRAM')}</h1>
                    </div>
                    :
                    null
            }
            {
                part !== 'headline' ?
                    <div className={styles['details']}>
                        {
                            facts.length > 0 || ratings.length > 0 ?
                                <div className={styles['facts']}>
                                    {
                                        facts.map((fact) => (
                                            <div key={fact}>{fact}</div>
                                        ))
                                    }
                                    {
                                        ratings.map((rating, index) => (
                                            <Rating key={`${rating.system}:${rating.value}:${index}`} rating={rating} />
                                        ))
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            typeof overview === 'string' && overview.length > 0 ?
                                <p className={styles['overview']}>{overview}</p>
                                :
                                null
                        }
                        {
                            genres.length > 0 ?
                                <div className={styles['genres']}>
                                    {
                                        genres.map((genre) => (
                                            <div key={genre} className={styles['genre']}>{genre}</div>
                                        ))
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            programme !== null ?
                                <div className={styles['timing']}>
                                    {
                                        live ?
                                            <ProgressBar className={styles['progress']} value={progress} />
                                            :
                                            null
                                    }
                                    <div className={styles['relative']}>
                                        {
                                            live ?
                                                t('CONTINUE_WATCHING_TIME_LEFT', { minutes: Math.ceil((programme.endTime.getTime() - now) / 60000) })
                                                :
                                                getRelativeTime(past ? programme.endTime.getTime() : programme.startTime.getTime(), now, relativeFormatter)
                                        }
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default Programme;
