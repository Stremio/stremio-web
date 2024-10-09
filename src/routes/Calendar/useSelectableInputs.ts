// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import useCalendarDate from './useCalendarDate';

const mapSelectableInputs = (calendar: Calendar, toMonthYear: (date: CalendarDate | null) => string) => {
    const paginationInput = (calendar.selectable.prev ?? calendar.selectable.next) ?
        {
            label: toMonthYear(calendar.selected),
            onSelect: ({ value }: { value: string }) => {
                if (value === 'prev' && calendar.selectable.prev) {
                    window.location.href = calendar.selectable.prev.deepLinks.calendar;
                }
                if (value === 'next' && calendar.selectable.next) {
                    window.location.href = calendar.selectable.next.deepLinks.calendar;
                }
            }
        }
        :
        null;

    return [paginationInput];
};

const useSelectableInputs = (calendar: Calendar, profile: Profile) => {
    const { toMonthYear } = useCalendarDate(profile);

    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(calendar, toMonthYear);
    }, [calendar]);

    return selectableInputs;
};

export default useSelectableInputs;
