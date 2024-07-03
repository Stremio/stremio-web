// Copyright (C) 2017-2024 Smart code 203358507

import React, { useState } from 'react';
import { MainNavBars, PaginationInput, useProfile, withCoreSuspender } from 'stremio/common';
import useCalendar from './useCalendar';
import useSelectableInputs from './useSelectableInputs';
import Table from './Table/Table';
import List from './List/List';
import Placeholder from './Placeholder/Placeholder';
import styles from './Calendar.less';

type Props = {
    urlParams: UrlParams,
};

const Calendar = ({ urlParams }: Props) => {
    const calendar = useCalendar(urlParams);
    const profile = useProfile();

    const [paginationInput] = useSelectableInputs(calendar, profile);

    const [selected, setSelected] = useState<CalendarDate | null>(null);

    return (
        <MainNavBars className={styles['calendar']} route={'calendar'}>
            {
                profile.auth !== null ?
                    <div className={styles['content']}>
                        <div className={styles['main']}>
                            <div className={styles['inputs']}>
                                {
                                    paginationInput !== null ?
                                        <PaginationInput {...paginationInput} className={styles['pagination-input']} />
                                        :
                                        null
                                }
                            </div>
                            <Table
                                items={calendar.items}
                                selected={selected}
                                monthInfo={calendar.monthInfo}
                                onChange={setSelected}
                            />
                        </div>
                        <List
                            items={calendar.items}
                            selected={selected}
                            monthInfo={calendar.monthInfo}
                            profile={profile}
                            onChange={setSelected}
                        />
                    </div>
                    :
                    <Placeholder />
            }
        </MainNavBars>
    );
};

const CalendarFallback = () => (
    <MainNavBars className={styles['calendar']} />
);

export default withCoreSuspender(Calendar, CalendarFallback);
