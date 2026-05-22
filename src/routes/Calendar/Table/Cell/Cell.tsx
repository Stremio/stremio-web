// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useMemo, MouseEvent } from 'react';
import Icon from '@stremio/stremio-icons/react';
import classNames from 'classnames';
import { useNavigateWithOrigin } from 'stremio/common/useNavigateWithOrigin';
import { Button, HorizontalScroll, Image } from 'stremio/components';
import styles from './Cell.less';

type Props = {
    selected: CalendarDate | null,
    monthInfo: CalendarMonthInfo,
    date: CalendarDate,
    items: CalendarContentItem[],
    onClick: (date: CalendarDate) => void,
};

const Cell = ({ selected, monthInfo, date, items, onClick }: Props) => {
    const { setOriginPath } = useNavigateWithOrigin();
    const [active, today] = useMemo(() => [
        date.day === selected?.day,
        date.day === monthInfo.today,
    ], [selected, monthInfo, date]);

    const onCellClick = () => {
        onClick && onClick(date);
    };

    const onPosterClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
        setOriginPath();
        event.stopPropagation();
    }, []);

    return (
        <Button
            className={classNames(styles['cell'], { [styles['active']]: active, [styles['today']]: today })}
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
                        <Button key={id} className={styles['item']} href={deepLinks.metaDetailsStreams} tabIndex={-1} onClick={onPosterClick}>
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
