type CalendarDeepLinks = {
    calendar: string,
};

type CalendarItemDeepLinks = {
    metaDetailsStreams: string,
};

type CalendarSelectableDate = {
    month: number,
    year: number,
    selected: boolean,
    deepLinks: CalendarDeepLinks,
};

type CalendarSelectable = {
    prev: CalendarSelectableDate,
    next: CalendarSelectableDate,
};

type CalendarDate = {
    day: number,
    month: number,
    year: number,
};

type CalendarSelected = CalendarDate | null;

type CalendarMonthInfo = {
    today: number | null,
    days: number,
    firstWeekday: number,
};

type CalendarContentItem = {
    id: string,
    name: string,
    poster?: string,
    title: string,
    season?: number,
    episode?: number,
    deepLinks: CalendarItemDeepLinks,
};

type CalendarItem = {
    date: CalendarDate,
    items: CalendarContentItem[],
};

type Calendar = {
    selectable: CalendarSelectable,
    selected: CalendarSelected,
    monthInfo: CalendarMonthInfo,
    items: CalendarItem[],
};
