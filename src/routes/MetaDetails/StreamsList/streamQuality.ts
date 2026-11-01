export type StreamQuality = {
    height: number;
    hdr: boolean;
    sizeBytes: number;
};

export type ParsedEpisode = {
    season: number;
    episode: number;
};

export const streamText = (stream: Partial<Stream>): string => {
    return [
        stream.behaviorHints?.filename,
        stream.name,
        stream.description,
    ]
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .join(' ');
};

export const parseResolution = (text: string): number => {
    const normalized = text.toLowerCase();
    const explicit = normalized.match(/(?:^|[^0-9])(2160|1440|1080|720|480|360)\s*p?(?:[^0-9]|$)/);
    if (explicit) {
        return parseInt(explicit[1], 10);
    }
    if (/\b(4k|uhd)\b/.test(normalized)) {
        return 2160;
    }
    if (/\bfhd\b/.test(normalized)) {
        return 1080;
    }
    if (/\b(hd|hdrip)\b/.test(normalized)) {
        return 720;
    }
    if (/\b(sd|dvdrip)\b/.test(normalized)) {
        return 480;
    }
    return 0;
};

export const parseHdr = (text: string): boolean => {
    return /(?:^|[^a-z0-9])(hdr10\+?|hdr10|hdr|dolby[ .-]?vision|dv|hlg)(?:[^a-z0-9]|$)/i.test(text);
};

export const parseEpisode = (text: string): ParsedEpisode | null => {
    const standard = text.match(/\bS(\d{1,2})[\s._-]*E(\d{1,3})\b/i);
    if (standard) {
        return {
            season: parseInt(standard[1], 10),
            episode: parseInt(standard[2], 10),
        };
    }
    const alternate = text.match(/\b(\d{1,2})x(\d{1,3})\b/i);
    if (alternate) {
        return {
            season: parseInt(alternate[1], 10),
            episode: parseInt(alternate[2], 10),
        };
    }
    return null;
};

export const parseSeason = (text: string): number | null => {
    const season = text.match(/\b(?:Season|S)\s*(\d{1,2})\b/i);
    return season ? parseInt(season[1], 10) : null;
};

export const isSeasonPack = (text: string): boolean => {
    return /\b(complete\s+series|complete\s+season|season\s+\d{1,2}\b(?!\s*episode)|S\d{1,2}\b(?![\s._-]*E\d)|E\d{1,3}\s*[-–]\s*E?\d{1,3})\b/i.test(text);
};

export const parseRuntimeMinutes = (text: string): number => {
    const hms = text.match(/\b(\d{1,2})\s*h\s*:?\s*(\d{1,2})\s*m(?:\s*:?\s*(\d{1,2})\s*s)?\b/i);
    if (hms) {
        return parseInt(hms[1], 10) * 60 + parseInt(hms[2], 10) + (hms[3] ? parseInt(hms[3], 10) / 60 : 0);
    }
    const hm = text.match(/\b(\d{1,2})\s*h(?:ours?)?\s*:?\s*(\d{1,2})?\s*m?(?:in(?:utes?)?)?\b/i);
    if (hm) {
        return parseInt(hm[1], 10) * 60 + (hm[2] ? parseInt(hm[2], 10) : 0);
    }
    const minutes = text.match(/\b(\d{1,3})\s*min(?:ute)?s?\b/i);
    if (minutes) {
        return parseInt(minutes[1], 10);
    }
    const clock = text.match(/\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/);
    if (clock) {
        const first = parseInt(clock[1], 10);
        const second = parseInt(clock[2], 10);
        if (clock[3] !== undefined) {
            return first * 60 + second + parseInt(clock[3], 10) / 60;
        }
        return first * 60 + second;
    }
    return 0;
};

export const parseFileSizeBytes = (text: string): number => {
    const match = text.match(/\b(\d+(?:\.\d+)?)\s*(TiB|TB|GiB|GB|MiB|MB)\b/i);
    if (!match) {
        return 0;
    }
    const value = parseFloat(match[1]);
    switch (match[2].toLowerCase()) {
        case 'tib':
        case 'tb':
            return Math.round(value * 1024 * 1024 * 1024 * 1024);
        case 'gib':
        case 'gb':
            return Math.round(value * 1024 * 1024 * 1024);
        default:
            return Math.round(value * 1024 * 1024);
    }
};

export const streamFileSizeBytes = (stream: Partial<Stream>): number => {
    const size = stream.behaviorHints?.videoSize;
    if (typeof size === 'number' && size > 0) {
        return size;
    }
    return parseFileSizeBytes(streamText(stream));
};

export const parseQuality = (stream: Partial<Stream>): StreamQuality => {
    const text = streamText(stream);
    return {
        height: parseResolution(text),
        hdr: parseHdr(text),
        sizeBytes: streamFileSizeBytes(stream),
    };
};

const stripQuery = (url: string): string => url.split('?')[0].split('#')[0];

const fnv1a = (value: string): string => {
    let hash = 0x811c9dc5;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
};

export const streamKey = (stream: Partial<Stream>, addonTransportUrl: string): string => {
    let source: string;
    if (typeof stream.infoHash === 'string' && stream.infoHash.length > 0) {
        source = `torrent:${stream.infoHash}:${stream.fileIdx ?? ''}`;
    } else if (typeof stream.url === 'string' && stream.url.length > 0) {
        const identity = [
            stream.name,
            stream.description,
            stream.behaviorHints?.filename,
            stream.behaviorHints?.videoHash,
            typeof stream.behaviorHints?.videoSize === 'number' ? `${stream.behaviorHints.videoSize}` : null,
        ]
            .filter((value): value is string => typeof value === 'string' && value.length > 0)
            .join('|');
        source = `url:${stripQuery(stream.url)}:${identity || fnv1a(stream.url)}`;
    } else {
        source = `text:${stream.name ?? ''}:${stream.description ?? ''}`;
    }
    return fnv1a(`${addonTransportUrl}|${source}`);
};

export const isDirectStream = (stream: Partial<Stream>): boolean => {
    return typeof stream.url === 'string' && stream.url.length > 0 && !stream.infoHash;
};

export const streamLabel = (stream: Partial<Stream>, addonName: string): string => {
    const name = stream.name || stream.description || 'Source';
    return addonName ? `${addonName} · ${name}` : name;
};
