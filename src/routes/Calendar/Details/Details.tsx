// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/common/Button';
import styles from './Details.less';

type Props = {
    selected: CalendarDate | null,
    items: CalendarItem[],
};

const Details = ({ selected, items }: Props) => {
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
                        No new episodes for this day
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default Details;
