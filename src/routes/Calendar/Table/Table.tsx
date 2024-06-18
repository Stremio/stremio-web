// Copyright (C) 2017-2024 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Table.less';
import Cell from './Cell/Cell';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Props = {
    items: CalendarItem[],
    monthInfo: CalendarMonthInfo,
    onChange: (date: CalendarDate) => void,
};

const Table = ({ items, monthInfo, onChange }: Props) => {
    const { t } = useTranslation();

    const cellsOffset = useMemo(() => {
        return Array.from(Array(monthInfo.firstWeekday).keys());
    }, [monthInfo]);

    return (
        <div className={styles['table']}>
            <div className={styles['week']}>
                {
                    WEEK_DAYS.map((day) => (
                        <div className={styles['item']} key={day}>
                            {t(day)}
                        </div>
                    ))
                }
            </div>
            <div className={styles['grid']}>
                {
                    cellsOffset.map((day) => (
                        <span key={day} />
                    ))
                }
                {
                    items.map((item) => (
                        <Cell
                            key={item.date.day}
                            {...item}
                            today={monthInfo.today}
                            onClick={onChange}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Table;
