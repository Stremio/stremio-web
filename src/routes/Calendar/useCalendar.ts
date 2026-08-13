// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import { Params } from 'react-router';
import { useModelState } from 'stremio/common';

const useCalendar = (urlParams: Readonly<Params<string>>) => {
    const action = React.useMemo(() => {
        const args = urlParams.year && urlParams.month ? {
            year: parseInt(urlParams.year),
            month: parseInt(urlParams.month),
            day: urlParams.day ? parseInt(urlParams.day) : null,
        } : null;

        return {
            action: 'Load',
            args: {
                model: 'Calendar',
                args,
            },
        };
    }, [urlParams]);

    const calendar = useModelState({ model: 'calendar', action }) as Calendar;
    return calendar;
};

export default useCalendar;
