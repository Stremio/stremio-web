// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Button, Image } from 'stremio/common';
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
        <div
            className={classNames(styles['cell'], { [styles['active']]: active, [styles['today']]: today, [styles['past']]: past })}
            key={date.day}
            onClick={onCellClick}
        >
            <div className={styles['heading']}>
                <div className={styles['day']}>
                    {date.day}
                </div>
            </div>
            <div className={styles['body']}>
                {
                    items.map(({ id, name, poster, deepLinks }) => (
                        <Button key={id} className={styles['item']} href={deepLinks.metaDetailsStreams}>
                            <Image
                                className={styles['poster']}
                                src={poster}
                                alt={name}
                            />
                        </Button>
                    ))
                }
            </div>
        </div>
    );
};

export default Cell;
