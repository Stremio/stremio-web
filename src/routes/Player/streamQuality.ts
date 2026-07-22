// Copyright (C) 2017-2023 Smart code 203358507

const LOW_BUFFER_RUNWAY_SECONDS = 10;

export type StreamQuality = 'checking' | 'no-buffer-data' | 'cached' | 'keeping-up' | 'buffer-healthy' | 'draining' | 'buffer-low';

type StreamQualityInput = {
    ready: boolean,
    cached: boolean,
    bufferRunway: number | null,
    keepingUp: boolean | null,
};

const isFiniteNumber = (value: unknown): value is number => Number.isFinite(value);

const playbackRate = (playbackSpeed: unknown): number => isFiniteNumber(playbackSpeed) && playbackSpeed > 0 ? playbackSpeed : 1;

export const bufferRunwaySeconds = (buffered: unknown, time: unknown, playbackSpeed: unknown): number | null => {
    if (!isFiniteNumber(buffered) || !isFiniteNumber(time)) {
        return null;
    }
    return Math.floor(Math.max(0, buffered - time) / 1000 / playbackRate(playbackSpeed));
};

export const isKeepingUp = (downloadSpeed: unknown, streamLen: unknown, duration: unknown, playbackSpeed: unknown): boolean | null => {
    if (!isFiniteNumber(downloadSpeed) || !isFiniteNumber(streamLen) || streamLen <= 0 || !isFiniteNumber(duration) || duration <= 0) {
        return null;
    }
    const requiredDownloadSpeed = (streamLen / (duration / 1000)) * playbackRate(playbackSpeed);
    return downloadSpeed >= requiredDownloadSpeed;
};

export const deriveStreamQuality = ({ ready, cached, bufferRunway, keepingUp }: StreamQualityInput): StreamQuality => {
    if (!ready) {
        return 'checking';
    }
    if (cached) {
        return 'cached';
    }
    if (bufferRunway === null) {
        return 'no-buffer-data';
    }
    if (bufferRunway < LOW_BUFFER_RUNWAY_SECONDS) {
        return 'buffer-low';
    }
    if (keepingUp) {
        return 'keeping-up';
    }
    return keepingUp === false ? 'draining' : 'buffer-healthy';
};
