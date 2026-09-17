// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'stremio/components';
import { EPGChannel, EPGProgram, EPG_TICK_MINUTES, HOUR_IN_MS, epgDayWindow, parseEpgDate, programEndMs, programStartMs } from 'stremio/common/EPG';
import useGuideViewport from './useGuideViewport';
import Header from './Header';
import ChannelColumn from './ChannelColumn';
import Row from './Row';
import Skeleton from './Skeleton';
import styles from './Guide.less';

const CHANNEL_COLUMN_WIDTH = 130;
const ROW_HEIGHT = 56;
const ROW_STRIDE = 60;
const OVERSCAN_ROWS = 3;
const TIME_OVERSCAN_PX = 300;
const LOAD_MORE_THRESHOLD_PX = 400;
const SKELETON_ROWS = 20;
const EMPTY_PROGRAMS: EPGProgram[] = [];

type Props = {
    channels: EPGChannel[];
    programs: Record<string, EPGProgram[]>;
    loading: boolean;
    selectedDate: string | null;
    today: string | null;
    dayWindow: { start: string; end: string } | null;
    error: string | null;
    onRetry: () => void;
    hasNextPage: boolean;
    loadNextPage: () => void;
    now: number;
    onProgramSelect: (program: EPGProgram, channel: EPGChannel) => void;
};

const currentProgramIndex = (programs: EPGProgram[], now: number) => {
    return programs.findIndex((program) => programStartMs(program) <= now && now < programEndMs(program));
};

const Guide = ({ channels, programs, loading, selectedDate, today, dayWindow, error, onRetry, hasNextPage, loadNextPage, now, onProgramSelect }: Props) => {
    const { t } = useTranslation();
    const todayDate = useMemo(() => parseEpgDate(today) ?? new Date(), [today]);
    const effectiveDay = useMemo(() => parseEpgDate(selectedDate) ?? todayDate, [selectedDate, todayDate]);
    const { start: dayStart, end: dayEnd } = useMemo(() => {
        return dayWindow ?
            { start: Date.parse(dayWindow.start), end: Date.parse(dayWindow.end) }
            :
            epgDayWindow(effectiveDay);
    }, [dayWindow, effectiveDay]);
    const { viewportRef, headerRef, channelColumnRef, viewport, pixelsPerHour, zoom, scrollToTime } = useGuideViewport(dayStart, dayEnd, now);
    const totalGridWidth = ((dayEnd - dayStart) / HOUR_IN_MS) * pixelsPerHour;
    const tickMinutes = EPG_TICK_MINUTES.find((minutes) => minutes * pixelsPerHour / 60 >= viewport.minTickWidth) ?? EPG_TICK_MINUTES[EPG_TICK_MINUTES.length - 1];
    const tickSize = tickMinutes * 60000;
    const tickWidth = tickSize * pixelsPerHour / HOUR_IN_MS;
    const firstTick = Math.max(0, Math.floor((viewport.left - TIME_OVERSCAN_PX) / tickWidth));
    const lastTick = Math.min(Math.ceil((dayEnd - dayStart) / tickSize), Math.ceil((viewport.left + viewport.width + TIME_OVERSCAN_PX) / tickWidth));
    const visibleStart = dayStart + firstTick * tickSize;
    const visibleEnd = dayStart + lastTick * tickSize;
    const initialLoading = loading && channels.length === 0;
    const firstRow = Math.max(0, Math.floor(viewport.top / ROW_STRIDE) - OVERSCAN_ROWS);
    const lastRow = Math.min(channels.length, Math.ceil((viewport.top + viewport.height) / ROW_STRIDE) + OVERSCAN_ROWS);
    const visibleChannels = channels.slice(firstRow, lastRow);
    const rowPadding = { paddingTop: firstRow * ROW_STRIDE, paddingBottom: Math.max(0, channels.length - lastRow) * ROW_STRIDE };
    const nearEnd = viewport.height > 0 && viewport.top + viewport.height >= channels.length * ROW_STRIDE - LOAD_MORE_THRESHOLD_PX;

    useEffect(() => {
        if (hasNextPage && !loading && nearEnd) {
            loadNextPage();
        }
    }, [hasNextPage, loading, nearEnd, loadNextPage]);

    return (
        <div className={styles['guide']}>
            {
                error !== null ?
                    <div className={styles['error']}>
                        <div className={styles['error-message']}>{error}</div>
                        <Button className={styles['error-retry']} onClick={onRetry}>
                            {t('TRY_AGAIN')}
                        </Button>
                    </div>
                    :
                    null
            }
            <Header
                headerRef={headerRef}
                channelColumnWidth={CHANNEL_COLUMN_WIDTH}
                dayStart={dayStart}
                dayEnd={dayEnd}
                pixelsPerHour={pixelsPerHour}
                viewport={viewport}
                ticks={{ first: firstTick, last: lastTick, size: tickSize, width: tickWidth }}
                totalGridWidth={totalGridWidth}
                onZoom={zoom}
                onScrollToTime={scrollToTime}
            />
            <div className={styles['body']}>
                <ChannelColumn
                    innerRef={channelColumnRef}
                    width={CHANNEL_COLUMN_WIDTH}
                    rowHeight={ROW_HEIGHT}
                    channels={visibleChannels}
                    skeletonRows={initialLoading ? SKELETON_ROWS : 0}
                    style={initialLoading ? undefined : rowPadding}
                />
                <div ref={viewportRef} className={styles['viewport']} aria-busy={loading} tabIndex={0}>
                    <div className={styles['grid']} style={{ width: totalGridWidth }}>
                        {
                            now >= dayStart && now < dayEnd ?
                                <div className={styles['now-line']} style={{ left: ((now - dayStart) / HOUR_IN_MS) * pixelsPerHour }} />
                                :
                                null
                        }
                        {
                            initialLoading ?
                                <Skeleton
                                    rows={SKELETON_ROWS}
                                    rowHeight={ROW_HEIGHT}
                                    width={totalGridWidth}
                                    pixelsPerHour={pixelsPerHour}
                                />
                                :
                                <div className={styles['rows']} style={rowPadding}>
                                    {visibleChannels.map((channel) => {
                                        const channelPrograms = programs[channel.id] ?? EMPTY_PROGRAMS;
                                        return (
                                            <Row
                                                key={channel.id}
                                                channel={channel}
                                                programs={channelPrograms}
                                                currentProgramIndex={currentProgramIndex(channelPrograms, now)}
                                                dayStart={dayStart}
                                                dayEnd={dayEnd}
                                                visibleStart={visibleStart}
                                                visibleEnd={visibleEnd}
                                                pixelsPerHour={pixelsPerHour}
                                                onProgramClick={onProgramSelect}
                                            />
                                        );
                                    })}
                                </div>
                        }
                        {
                            loading && channels.length > 0 ?
                                <div className={styles['loading-more']} role={'status'}>
                                    {t('STREAM_LOADING')}
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
                {
                    !initialLoading && channels.length === 0 && error === null ?
                        <div className={styles['empty']} role={'status'}>
                            {t('NO_STREAM')}
                        </div>
                        :
                        null
                }
            </div>
        </div>
    );
};

export default Guide;
