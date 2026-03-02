// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import styles from './Details.less';

type Props = {
    selected: CalendarDate | null,
    items: CalendarItem[],
};

const Details = ({ selected, items }: Props) => {
    const { t } = useTranslation();
    const videos = useMemo(() => {
        return items.find(({ date }) => date.day === selected?.day)?.items ?? [];
    }, [selected, items]);

    return (
        <div className={styles['details']}>
            {
                videos.map(({ id, name, season, episode, deepLinks }) => (
                    <Button className={styles['video']} key={id} href={deepLinks.metaDetailsStreams}>
                        <div className={styles['name']}>
                            {name}
                        </div>
                        <div className={styles['info']}>
                            S{season}E{episode}
                        </div>
                        <Icon className={styles['icon']} name={'play'} />
                    </Button>
                ))
            }
            {
                !videos.length ?
                    <div className={styles['placeholder']}>
                        {t('CALENDAR_NO_NEW_EPISODES')}
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default Details;
