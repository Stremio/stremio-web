const useCalendarDate = (profile: Profile) => {
    const toMonthYear = (calendarDate: CalendarDate | null): string => {
        if (!calendarDate) return '';

        const date = new Date();
        date.setMonth(calendarDate.month - 1);
        date.setFullYear(calendarDate.year);

        return date.toLocaleString(profile.settings.interfaceLanguage, {
            month: 'long',
            year: 'numeric',
        });
    };

    const toDayMonth = (calendarDate: CalendarDate | null): string => {
        if (!calendarDate) return '';

        const date = new Date();
        date.setDate(calendarDate.day);
        date.setMonth(calendarDate.month - 1);

        return date.toLocaleString(profile.settings.interfaceLanguage, {
            day: 'numeric',
            month: 'short',
        });
    };

    return {
        toMonthYear,
        toDayMonth,
    };
};

export default useCalendarDate;
