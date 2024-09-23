// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import Icon from '@stremio/stremio-icons/react';
import classNames from 'classnames';
import { Button, Image, HorizontalScroll } from 'stremio/common';
import styles from './Cell.less';

type Props = {
    selected: CalendarDate | null,
    monthInfo: CalendarMonthInfo,
    date: CalendarDate,
    items: CalendarContentItem[],
    onClick: (date: CalendarDate) => void,
};

const Cell = ({ selected, monthInfo, date, items, onClick }: Props) => {
    const [active, today, past] = useMemo(() => {
        const active = date.day === selected?.day;
        const today = date.day === monthInfo.today;
        const past = date.day < (monthInfo.today ?? 1);

        return [active, today, past];
    }, [selected, monthInfo, date]);

    const onCellClick = () => {
        onClick && onClick(date);
    };

    return (
        <Button
            className={classNames(styles['cell'], { [styles['active']]: active, [styles['today']]: today, [styles['past']]: past })}
            onClick={onCellClick}
        >
            <div className={styles['heading']}>
                <div className={styles['day']}>
                    {date.day}
                </div>
            </div>
            <HorizontalScroll className={styles['items']}>
                {
                    items.map(({ id, name, poster, deepLinks }) => (
                        <Button key={id} className={styles['item']} href={deepLinks.metaDetailsStreams}>
                            <Icon className={styles['icon']} name={'play'} />
                            <Image
                                className={styles['poster']}
                                src={poster}
                                alt={name}
                            />
                        </Button>
                    ))
                }
            </HorizontalScroll>
            {
                items.length > 0 ?
                    <Icon className={styles['more']} name={'more-horizontal'} />
                    :
                    null
            }
        </Button>
    );
};

export default Cell;
