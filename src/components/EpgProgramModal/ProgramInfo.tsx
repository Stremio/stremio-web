// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { EPGProgram, formatEpgTimeRange, getEpgProgress } from 'stremio/common/EPG';
import Image from 'stremio/components/Image';
import styles from './ProgramInfo.less';

type Props = {
    program: EPGProgram,
    now: number,
};

const ProgramInfo = ({ program, now }: Props) => {
    const { t, i18n } = useTranslation();
    const progress = getEpgProgress(program, now);
    const date = program.startTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <div className={styles['info']}>
            <div className={styles['channel']}>
                {
                    program.channelLogo &&
                        <Image className={styles['channel-logo']} src={program.channelLogo} alt={''} />
                }
                <span>{program.channelName}</span>
            </div>
            <div className={styles['status-line']}>
                <span className={progress !== null ? styles['live'] : styles['status']}>
                    {
                        progress !== null ?
                            t('LIVE_TV_ON_NOW', { defaultValue: 'On now' })
                            :
                            program.startTime.getTime() > now ? t('UPCOMING') : t('AIRED')
                    }
                </span>
                <span>{date}</span>
            </div>
            <div className={styles['time']}>
                <Icon name={'clock'} className={styles['time-icon']} />
                <span>{formatEpgTimeRange(program.startTime, program.endTime, i18n.language)}</span>
                {
                    program.runtime &&
                        <span className={styles['runtime']}>{program.runtime}</span>
                }
                {
                    program.ratings?.filter((rating) => rating.value.trim()).map((rating, index) => (
                        <span
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
                        </span>
                    ))
                }
            </div>
            {
                progress !== null &&
                    <div className={styles['progress']}>
                        <div style={{ width: `${progress}%` }} />
                    </div>
            }
        </div>
    );
};

export default ProgramInfo;
