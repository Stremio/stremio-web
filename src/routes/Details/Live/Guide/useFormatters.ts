// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EPGProgram, epgDateKey } from 'stremio/common/EPG';

const useFormatters = (now: number) => {
    const { t, i18n } = useTranslation();

    return useMemo(() => {
        const time = new Intl.DateTimeFormat(i18n.language, { hour: '2-digit', minute: '2-digit' });
        const hour = new Intl.DateTimeFormat(i18n.language, { hour: 'numeric' });
        const day = new Intl.DateTimeFormat(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' });
        const minutes = new Intl.NumberFormat(i18n.language, { style: 'unit', unit: 'minute', unitDisplay: 'short' });
        const today = epgDateKey(new Date(now));

        return {
            time: (value: Date | number) => time.format(value),
            hour: (value: Date | number) => hour.format(value),
            timeRange: (programme: EPGProgram) => `${time.format(programme.startTime)} - ${time.format(programme.endTime)}`,
            duration: (programme: EPGProgram) => minutes.format(Math.ceil((programme.endTime.getTime() - programme.startTime.getTime()) / 60000)),
            dayLabel: (date: Date) => epgDateKey(date) === today ? t('LIVE_TV_TODAY') : day.format(date),
        };
    }, [i18n.language, t, now]);
};

export default useFormatters;
