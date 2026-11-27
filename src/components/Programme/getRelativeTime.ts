// Copyright (C) 2017-2026 Smart code 203358507

const getRelativeTime = (target: number, now: number, formatter: Intl.RelativeTimeFormat) => {
    const minutes = Math.round((target - now) / 60000);
    if (Math.abs(minutes) < 60) {
        return formatter.format(minutes, 'minute');
    }

    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 48) {
        return formatter.format(hours, 'hour');
    }

    return formatter.format(Math.round(hours / 24), 'day');
};

export default getRelativeTime;
