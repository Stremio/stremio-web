// Copyright (C) 2017-2023 Smart code 203358507

type ClockFormat = 'auto' | '12h' | '24h';
type ClockPosition = 'top-left' | 'top-center' | 'top-right';

const formatClockTime = (format: ClockFormat, date: Date = new Date()): string => {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
    if (format === '12h') options.hour12 = true;
    if (format === '24h') options.hour12 = false;
    // 'auto' omits hour12, Intl uses the locale default
    return new Intl.DateTimeFormat(navigator.language, options).format(date);
};

export type { ClockFormat, ClockPosition };
export { formatClockTime };
