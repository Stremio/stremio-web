// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Episode from '../Episode';
import styles from './Details.less';

type Props = {
    selected: CalendarDate | null,
    items: CalendarItem[],
    hideSpoilers: boolean,
};

const Details = ({ selected, items, hideSpoilers }: Props) => {
    const { t } = useTranslation();
    const videos = useMemo(() => {
        return items.find(({ date }) => date.day === selected?.day)?.items ?? [];
    }, [selected, items]);

    return (
        <div className={styles['details']}>
            {
                videos.map((video) => (
                    <Episode key={video.id} {...video} hideSpoilers={hideSpoilers} />
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
