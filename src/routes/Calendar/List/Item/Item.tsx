// Copyright (C) 2017-2024 Smart code 203358507

import React, { useEffect, useMemo, useRef } from 'react';
import Icon from '@stremio/stremio-icons/react';
import classNames from 'classnames';
import { useNavigateWithOrigin } from 'stremio/common/useNavigateWithOrigin';
import { Button } from 'stremio/components';
import useCalendarDate from '../../useCalendarDate';
import styles from './Item.less';

type Props = {
    selected: CalendarDate | null,
    monthInfo: CalendarMonthInfo,
    date: CalendarDate,
    items: CalendarContentItem[],
    profile: Profile,
    onClick: (date: CalendarDate) => void,
};

const Item = ({ selected, monthInfo, date, items, profile, onClick }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const { setOriginPath } = useNavigateWithOrigin();
    const { toDayMonth } = useCalendarDate(profile);

    const [active, today] = useMemo(() => [
        date.day === selected?.day,
        date.day === monthInfo.today,
    ], [selected, monthInfo, date]);

    const onItemClick = () => {
        setOriginPath();
        onClick && onClick(date);
    };

    useEffect(() => {
        active && ref.current?.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
        });
    }, [active]);

    return (
        <div
            ref={ref}
            className={classNames(styles['item'], { [styles['active']]: active, [styles['today']]: today })}
            key={date.day}
            onClick={onItemClick}
        >
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
                            <Icon className={styles['icon']} name={'play'} />
                        </Button>
                    ))
                }
            </div>
        </div>
    );
};

export default Item;
