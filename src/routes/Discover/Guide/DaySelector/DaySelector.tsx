// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import useMediaQuery from 'stremio/common/useMediaQuery';
import screenSizes from 'stremio/common/screen-sizes.less';
import { parseEpgDate } from 'stremio/common/EPG';
import styles from './DaySelector.less';

const DAYS_BEFORE_TODAY = 3;
const DAYS_IN_RANGE = 7;

type Props = {
    selectedDate: string | null;
    today: string | null;
    compact?: boolean;
    onDayChange: (day: Date) => void;
};

const DaySelector = ({ selectedDate, today, compact = false, onDayChange }: Props) => {
    const { t, i18n } = useTranslation();
    const narrow = useMediaQuery(`(max-width: ${screenSizes.xxsmall})`);
    const todayDate = useMemo(() => parseEpgDate(today) ?? new Date(), [today]);
    const effectiveDay = useMemo(() => parseEpgDate(selectedDate) ?? todayDate, [selectedDate, todayDate]);
    const days = useMemo(() => {
        const range = Array.from({ length: DAYS_IN_RANGE }, (_, index) => {
            return new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + index - DAYS_BEFORE_TODAY);
        });
        return Array.from(new Set([...range.map((day) => day.getTime()), effectiveDay.getTime()]))
            .sort((a, b) => a - b)
            .map((time) => new Date(time));
    }, [todayDate, effectiveDay]);
    const formatters = useMemo(() => ({
        weekday: new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }),
        date: new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric' }),
    }), [i18n.language]);
    const selectedDayIndex = days.findIndex((day) => day.getTime() === effectiveDay.getTime());
    const visibleDayCount = compact ? (narrow ? 1 : 3) : (narrow ? 3 : days.length);
    const firstVisibleDay = Math.max(0, Math.min(days.length - visibleDayCount, selectedDayIndex - Math.floor(visibleDayCount / 2)));
    const visibleDays = days.slice(firstVisibleDay, firstVisibleDay + visibleDayCount);
    const canGoBack = selectedDayIndex > 0;
    const canGoForward = selectedDayIndex < days.length - 1;

    const onPreviousDay = () => {
        if (canGoBack) onDayChange(days[selectedDayIndex - 1]);
    };
    const onNextDay = () => {
        if (canGoForward) onDayChange(days[selectedDayIndex + 1]);
    };

    return (
        <div className={classNames(styles['day-selector'], { [styles['compact']]: compact })}>
            <Button
                className={styles['arrow']}
                role={'button'}
                disabled={!canGoBack}
                aria-disabled={!canGoBack}
                tabIndex={canGoBack ? 0 : -1}
                aria-label={t('BUTTON_PREV')}
                onClick={onPreviousDay}
            >
                <Icon className={styles['arrow-icon']} name={'chevron-back'} />
            </Button>
            {visibleDays.map((day) => (
                <Button
                    key={day.getTime()}
                    className={classNames(styles['day'], { [styles['active']]: day.getTime() === effectiveDay.getTime() })}
                    role={'button'}
                    onClick={() => onDayChange(day)}
                >
                    <div className={styles['weekday']}>{formatters.weekday.format(day)}</div>
                    <div className={styles['date']}>
                        {day.getTime() === todayDate.getTime() ? formatters.date.format(day) : day.getDate()}
                    </div>
                </Button>
            ))}
            <Button
                className={styles['arrow']}
                role={'button'}
                disabled={!canGoForward}
                aria-disabled={!canGoForward}
                tabIndex={canGoForward ? 0 : -1}
                aria-label={t('BUTTON_NEXT')}
                onClick={onNextDay}
            >
                <Icon className={styles['arrow-icon']} name={'chevron-forward'} />
            </Button>
        </div>
    );
};

export default DaySelector;
