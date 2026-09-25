// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Button, MultiselectMenu } from 'stremio/components';
import { EPG_MAX_PIXELS_PER_HOUR, EPG_MIN_PIXELS_PER_HOUR, HOUR_IN_MS } from 'stremio/common/EPG';
import styles from './Header.less';

const HALF_HOUR_IN_MS = HOUR_IN_MS / 2;

type Props = {
    headerRef: React.RefObject<HTMLDivElement>;
    channelColumnWidth: number;
    dayStart: number;
    dayEnd: number;
    pixelsPerHour: number;
    viewport: { left: number; width: number };
    ticks: { first: number; last: number; size: number; width: number };
    totalGridWidth: number;
    onZoom: (factor: number) => void;
    onScrollToTime: (time: number) => void;
};

const Header = ({ headerRef, channelColumnWidth, dayStart, dayEnd, pixelsPerHour, viewport, ticks, totalGridWidth, onZoom, onScrollToTime }: Props) => {
    const { t } = useTranslation();
    const slots = useMemo(() => {
        const times = Array.from({ length: Math.ceil((dayEnd - dayStart) / HALF_HOUR_IN_MS) }, (_, index) => {
            const date = new Date(dayStart + index * HALF_HOUR_IN_MS);
            return { index, date, label: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        });
        // Fall-back days contain repeated local times. Include the offset for those choices.
        return times.map((slot) => ({
            label: times.some((other) => other.index !== slot.index && other.label === slot.label) ?
                slot.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'shortOffset' })
                :
                slot.label,
            value: slot.index,
        }));
    }, [dayStart, dayEnd]);
    const selectedSlot = Math.max(0, Math.min(slots.length - 1, Math.floor((viewport.left + viewport.width / 2) / (pixelsPerHour / 2))));
    const canZoomOut = pixelsPerHour > EPG_MIN_PIXELS_PER_HOUR;
    const canZoomIn = pixelsPerHour < EPG_MAX_PIXELS_PER_HOUR;
    const tickIndexes = Array.from({ length: Math.max(0, ticks.last - ticks.first) }, (_, index) => ticks.first + index);

    const onSlotSelect = useCallback((value: string | number | null) => {
        const index = Number(value);
        if (value !== null && Number.isInteger(index) && index >= 0 && index < slots.length) {
            onScrollToTime(dayStart + (index + 0.5) * HALF_HOUR_IN_MS);
        }
    }, [dayStart, slots.length, onScrollToTime]);
    const onZoomOut = useCallback(() => onZoom(0.5), [onZoom]);
    const onZoomIn = useCallback(() => onZoom(2), [onZoom]);

    return (
        <div className={styles['header']}>
            <div className={styles['controls']} style={{ width: channelColumnWidth }}>
                <MultiselectMenu
                    className={styles['time-menu']}
                    icon={'clock'}
                    portal={true}
                    options={slots}
                    value={selectedSlot}
                    onSelect={onSlotSelect}
                />
                <div className={styles['zoom-controls']}>
                    <Button
                        role={'button'}
                        aria-label={t('LIVE_TV_ZOOM_OUT', { defaultValue: 'Zoom out' })}
                        disabled={!canZoomOut}
                        aria-disabled={!canZoomOut}
                        tabIndex={canZoomOut ? 0 : -1}
                        onClick={onZoomOut}
                    >
                        <div className={styles['zoom-icon']} aria-hidden={'true'} />
                    </Button>
                    <Button
                        role={'button'}
                        aria-label={t('LIVE_TV_ZOOM_IN', { defaultValue: 'Zoom in' })}
                        disabled={!canZoomIn}
                        aria-disabled={!canZoomIn}
                        tabIndex={canZoomIn ? 0 : -1}
                        onClick={onZoomIn}
                    >
                        <div className={classNames(styles['zoom-icon'], styles['zoom-in'])} aria-hidden={'true'} />
                    </Button>
                </div>
            </div>
            <div ref={headerRef} className={styles['viewport']} style={{ width: viewport.width }}>
                <div className={styles['time-slots']} style={{ width: totalGridWidth }}>
                    {tickIndexes.map((index) => (
                        <div key={index} className={styles['time-slot']} style={{ left: index * ticks.width, width: ticks.width }}>
                            {new Date(dayStart + index * ticks.size).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Header;
