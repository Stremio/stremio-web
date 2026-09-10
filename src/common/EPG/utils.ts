// Copyright (C) 2017-2026 Smart code 203358507

import type { EPGProgram } from './types';

export type EpgSkeletonProgram = {
    index: number;
    startMinutes: number;
    durationMinutes: number;
};

export const MINUTES_IN_DAY = 24 * 60;
export const HOUR_IN_MS = 60 * 60 * 1000;
export const EPG_NOW_REFRESH_INTERVAL = 60 * 1000;
export const EPG_PLAYER_NOW_REFRESH_INTERVAL = 1000;
export const EPG_PROGRAMS_LIMIT_IN_HOURS = 12;
export const EPG_SKELETON_MIN_DURATION_MINUTES = 30;
export const EPG_SKELETON_MAX_DURATION_MINUTES = 120;
export const EPG_SKELETON_STEP_MINUTES = 30;

export const getEpgTime = (value: unknown): number | null => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.getTime();
    }

    if (typeof value !== 'string' || value.length === 0) {
        return null;
    }

    const time = Date.parse(value);

    return Number.isFinite(time) ? time : null;
};

export const getEpgTimeRange = (
    video: { startTime?: unknown; endTime?: unknown } | null | undefined
): { startTime: number; endTime: number } | null => {
    const startTime = getEpgTime(video?.startTime);
    const endTime = getEpgTime(video?.endTime);

    return startTime !== null && endTime !== null && endTime > startTime ?
        { startTime, endTime }
        :
        null;
};

export const hasEpgProgramTimes = (
    video: { startTime?: unknown; endTime?: unknown } | null | undefined
): boolean => {
    return getEpgTimeRange(video) !== null;
};

export const getEpgProgress = (
    video: { startTime?: unknown; endTime?: unknown } | null | undefined,
    now: number
): number | null => {
    const range = getEpgTimeRange(video);

    if (range === null || now < range.startTime || now >= range.endTime) {
        return null;
    }

    return Math.min(100, Math.max(0, ((now - range.startTime) / (range.endTime - range.startTime)) * 100));
};

export const getEpgValue = (
    isEpgVideo: boolean,
    video: Record<string, unknown> | null | undefined,
    meta: Record<string, unknown>,
    key: string
): unknown => {
    const value = video?.[key];

    if (!isEpgVideo) {
        return meta[key];
    }

    if (typeof value === 'string' && value.length > 0) {
        return value;
    }

    if (Array.isArray(value) && value.length > 0) {
        return value;
    }

    return meta[key];
};

export const getEpgDescription = (
    isEpgVideo: boolean,
    video: Record<string, unknown> | null | undefined,
    meta: Record<string, unknown>
): unknown => {
    const value = video?.overview ?? video?.description;

    return isEpgVideo && typeof value === 'string' && value.length > 0 ?
        value
        :
        meta.description;
};

export const getEpgTitle = (
    isEpgVideo: boolean,
    video: Record<string, unknown> | null | undefined,
    meta: Record<string, unknown>
): unknown => {
    return isEpgVideo && typeof video?.title === 'string' && video.title.length > 0 ?
        video.title
        :
        meta.name;
};

export const getNonEmptyString = (value: unknown): string | null => {
    return typeof value === 'string' && value.length > 0 ? value : null;
};

export const filterVisibleEpgPrograms = <T extends { startTime?: unknown; endTime?: unknown }>(
    videos: T[],
    now: number,
    limitInHours = EPG_PROGRAMS_LIMIT_IN_HOURS
): T[] => {
    const maxTime = now + limitInHours * HOUR_IN_MS;

    return videos
        .filter((video) => {
            const range = getEpgTimeRange(video);

            return (
                range !== null &&
                range.endTime > now &&
                range.startTime < maxTime
            );
        })
        .sort((a, b) => {
            const aRange = getEpgTimeRange(a);
            const bRange = getEpgTimeRange(b);

            return (aRange?.startTime ?? 0) - (bRange?.startTime ?? 0);
        });
};

export const formatEpgTimeRange = (
    startTime: unknown,
    endTime: unknown,
    language?: string
): string | null => {
    const start = getEpgTime(startTime);
    const end = getEpgTime(endTime);

    if (start === null || end === null) {
        return null;
    }

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    return `${new Date(start).toLocaleTimeString(language, options)} - ${new Date(end).toLocaleTimeString(language, options)}`;
};

export const programStartMs = (program: EPGProgram): number => {
    return getEpgTime(program.startTime) ?? 0;
};

export const programEndMs = (program: EPGProgram): number => {
    return getEpgTime(program.endTime) ?? 0;
};

export const programTitle = (program: EPGProgram): string => {
    return program.title;
};

const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;

    return x - Math.floor(x);
};

export const getRandomEpgSkeletonDuration = (
    seed: number,
    minDuration = EPG_SKELETON_MIN_DURATION_MINUTES,
    maxDuration = EPG_SKELETON_MAX_DURATION_MINUTES,
    stepDuration = EPG_SKELETON_STEP_MINUTES,
): number => {
    const steps = ((maxDuration - minDuration) / stepDuration) + 1;
    const step = Math.floor(seededRandom(seed) * steps);

    return minDuration + step * stepDuration;
};

export const getEpgSkeletonPrograms = (
    rowIndex: number,
    seedOffset = 100,
): EpgSkeletonProgram[] => {
    const programs: EpgSkeletonProgram[] = [];
    let startMinutes = 0;
    let index = 0;

    while (startMinutes < MINUTES_IN_DAY) {
        const duration = getRandomEpgSkeletonDuration((rowIndex + 1) * seedOffset + index);
        const endMinutes = Math.min(startMinutes + duration, MINUTES_IN_DAY);

        programs.push({
            index,
            startMinutes,
            durationMinutes: endMinutes - startMinutes,
        });

        startMinutes = endMinutes;
        index += 1;
    }

    return programs;
};
