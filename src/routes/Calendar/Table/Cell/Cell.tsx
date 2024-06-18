// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { Button, Image } from 'stremio/common';
import styles from './Cell.less';

type Props = {
    today: number | null,
    date: CalendarDate,
    items: CalendarContentItem[],
    onClick: (date: CalendarDate) => void,
};

const Cell = ({ today, date, items, onClick }: Props) => {
    const onCellClick = () => {
        onClick && onClick(date);
    };

    return (
        <div className={classNames(styles['cell'], { 'current': today === date.day, 'past': date.day < (today ?? 1) })} key={date.day} onClick={onCellClick}>
            <div className={styles['heading']}>
                <div className={styles['day']}>
                    {date.day}
                </div>
            </div>
            <div className={styles['body']}>
                {
                    items.map(({ id, name, poster, deepLinks }) => (
                        <Button key={id} href={deepLinks.metaDetailsStreams}>
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
