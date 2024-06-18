// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import Item from './Item/Item';
import styles from './List.less';

type Props = {
    items: CalendarItem[],
    monthInfo: CalendarMonthInfo,
    profile: Profile,
    onChange: (date: CalendarDate) => void,
};

const List = ({ items, monthInfo, profile, onChange }: Props) => {
    const filteredItems = useMemo(() => {
        return items.filter(({ items }) => items.length);
    }, [items]);

    return (
        <div className={styles['list']}>
            {
                filteredItems.map((item) => (
                    <Item
                        key={item.date.day}
                        {...item}
                        today={monthInfo.today}
                        profile={profile}
                        onClick={onChange}
                    />
                ))
            }
        </div>
    );
};

export default List;
