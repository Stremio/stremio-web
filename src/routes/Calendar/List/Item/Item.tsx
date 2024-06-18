// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { Button } from 'stremio/common';
import useCalendarDate from '../../useCalendarDate';
import styles from './Item.less';

type Props = {
    today: number | null,
    date: CalendarDate,
    items: CalendarContentItem[],
    profile: Profile,
    onClick: (date: CalendarDate) => void,
};

const Item = ({ today, date, items, profile, onClick }: Props) => {
    const { toDayMonth } = useCalendarDate(profile);

    const onItemClick = () => {
        onClick && onClick(date);
    };

    return (
        <div className={classNames(styles['item'], { 'current': today === date.day, 'past': date.day < (today ?? 1) })} key={date.day} onClick={onItemClick}>
            <div className={styles['heading']}>
                {toDayMonth(date)}
            </div>
            <div className={styles['body']}>
                {
                    items.map(({ id, name, season, episode, deepLinks }) => (
                        <Button className={styles['video']} key={id} href={deepLinks.metaDetailsStreams}>
                            <div className={styles['name']}>
                                {name}
                            </div>
                            <div className={styles['info']}>
                                S{season}E{episode}
                            </div>
                        </Button>
                    ))
                }
            </div>
        </div>
    );
};

export default Item;
