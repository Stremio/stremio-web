// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, MultiselectMenu } from 'stremio/components';
import { useMediaQuery } from 'stremio/common';
import { parseEpgDate } from 'stremio/common/EPG';
import styles from './EpgDaySelector.less';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const abbreviate = (value: string) => Array.from(value).slice(0, 3).join('');

type Props = {
    selectedDate: string | null;
    today: string | null;
    compact?: boolean;
    onDayChange: (day: Date) => void;
};

const EpgDaySelector = ({ selectedDate, today, compact = false, onDayChange }: Props) => {
    const { t } = useTranslation();
    const narrow = useMediaQuery('(max-width: 800px)');
    const todayDate = useMemo(() => parseEpgDate(today) ?? new Date(), [today]);
    const effectiveDay = useMemo(() => parseEpgDate(selectedDate) ?? todayDate, [selectedDate, todayDate]);
    const days = useMemo(() => {
        const range = Array.from({ length: 7 }, (_, index) =>
            new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + index - 3));
        return Array.from(new Set([...range.map((day) => day.getTime()), effectiveDay.getTime()]))
            .sort((a, b) => a - b).map((time) => new Date(time));
    }, [todayDate, effectiveDay]);
    const selectedDayIndex = days.findIndex((day) => day.getTime() === effectiveDay.getTime());
    const visibleDays = narrow ? days.slice(Math.max(0, Math.min(days.length - 3, selectedDayIndex - 1)), Math.max(3, Math.min(days.length, selectedDayIndex + 2))) : days;

    if (compact) {
        return <MultiselectMenu
            className={styles['epg-day-menu']}
            options={days.map((day) => ({
                value: day.getTime(),
                label: `${abbreviate(t(WEEKDAYS[day.getDay()]))}, ${abbreviate(t(MONTHS[day.getMonth()]))} ${day.getDate()}`,
            }))}
            value={effectiveDay.getTime()}
            onSelect={(value: number) => onDayChange(new Date(value))}
        />;
    }

    return (
        <div className={styles['epg-day-selector']}>
            <Button className={styles['epg-day-arrow']} role={'button'} disabled={selectedDayIndex <= 0} aria-disabled={selectedDayIndex <= 0} tabIndex={selectedDayIndex <= 0 ? -1 : 0} onClick={() => selectedDayIndex > 0 && onDayChange(days[selectedDayIndex - 1])} aria-label={t('BUTTON_PREV')}>
                <Icon className={styles['epg-day-arrow-icon']} name={'chevron-back'} />
            </Button>
            {visibleDays.map((day) => (
                <Button key={day.getTime()} role={'button'} className={`${styles['epg-day-btn']}${day.getTime() === effectiveDay.getTime() ? ` ${styles['epg-day-btn-active']}` : ''}`} onClick={() => onDayChange(day)}>
                    <span className={styles['epg-day-weekday']}>{abbreviate(t(WEEKDAYS[day.getDay()]))}</span>
                    <span className={styles['epg-day-date']}>{day.toDateString() === todayDate.toDateString() ? `${abbreviate(t(MONTHS[day.getMonth()]))} ${day.getDate()}` : day.getDate()}</span>
                </Button>
            ))}
            <Button className={styles['epg-day-arrow']} role={'button'} disabled={selectedDayIndex >= days.length - 1} aria-disabled={selectedDayIndex >= days.length - 1} tabIndex={selectedDayIndex >= days.length - 1 ? -1 : 0} onClick={() => selectedDayIndex < days.length - 1 && onDayChange(days[selectedDayIndex + 1])} aria-label={t('BUTTON_NEXT')}>
                <Icon className={styles['epg-day-arrow-icon']} name={'chevron-forward'} />
            </Button>
        </div>
    );
};

export default EpgDaySelector;
