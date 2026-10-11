// Copyright (C) 2017-2026 Smart code 203358507

const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

export const parseDate = (value: string | Date | null | undefined): Date | null => {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value !== 'string' || value.length === 0) {
        return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value: string | Date | null | undefined, language: string, options: Intl.DateTimeFormatOptions = DATE_FORMAT): string | null => {
    const date = parseDate(value);
    return date !== null ? date.toLocaleDateString(language, options) : null;
};

export const getEpisodeLabel = ({ season, episode }: Pick<Video, 'season' | 'episode'>): string | null => {
    return typeof season === 'number' && typeof episode === 'number' ?
        `S${season} E${episode}`
        :
        null;
};

export const getMinutesLeft = (libraryItem: LibraryItem | null, videoId: string | null | undefined): number | null => {
    const state = libraryItem?.state;
    if (!state || state.video_id !== videoId || !(state.duration > 0) || !(state.timeOffset > 0)) {
        return null;
    }

    return Math.max(1, Math.ceil((state.duration - state.timeOffset) / 60000));
};

export const getMinutesLeftFromProgress = (progress: number | null | undefined, runtime: string | null | undefined): number | null => {
    const minutes = typeof runtime === 'string' ? parseInt(runtime, 10) : NaN;
    if (typeof progress !== 'number' || !(progress > 0) || Number.isNaN(minutes)) {
        return null;
    }

    return Math.max(1, Math.ceil(minutes * (1 - progress / 100)));
};
