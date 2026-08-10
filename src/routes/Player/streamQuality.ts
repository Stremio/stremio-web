// Copyright (C) 2017-2023 Smart code 203358507

const isFiniteNumber = (value: unknown): value is number => Number.isFinite(value);

const isPositiveNumber = (value: unknown): value is number => isFiniteNumber(value) && value > 0;

export const bufferRunwaySeconds = (buffered: unknown, time: unknown, playbackSpeed: unknown): number | null => {
    if (!isFiniteNumber(buffered) || !isFiniteNumber(time) || !isPositiveNumber(playbackSpeed)) {
        return null;
    }
    return Math.floor(Math.max(0, buffered - time) / 1000 / playbackSpeed);
};

export const isDownloadKeepingUp = (downloadSpeed: unknown, streamLen: unknown, duration: unknown, playbackSpeed: unknown): boolean | null => {
    if (!isFiniteNumber(downloadSpeed) || !isPositiveNumber(streamLen) || !isPositiveNumber(duration) || !isPositiveNumber(playbackSpeed)) {
        return null;
    }
    const requiredDownloadSpeed = (streamLen / (duration / 1000)) * playbackSpeed;
    return downloadSpeed >= requiredDownloadSpeed;
};
