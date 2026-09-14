// Copyright (C) 2017-2023 Smart code 203358507

const STORAGE_KEY = 'stremio.audio-output-preferences.v1';
const MAX_ENTRIES = 50;

const getStorage = () => {
    try {
        return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
        return null;
    }
};

const getFingerprintInput = (stream) => JSON.stringify({
    type: stream?.type ?? null,
    name: stream?.name ?? null,
    url: stream?.url ?? null,
    externalUrl: stream?.externalUrl ?? null,
    ytId: stream?.ytId ?? null,
    infoHash: stream?.infoHash ?? null,
    fileIdx: typeof stream?.fileIdx === 'number' ? stream.fileIdx : null,
});

const fingerprintStream = async (stream) => {
    if (!stream || typeof crypto === 'undefined' || !crypto.subtle || typeof TextEncoder === 'undefined') {
        return null;
    }

    try {
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(getFingerprintInput(stream)));
        return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    } catch {
        return null;
    }
};

const readEntries = (storage) => {
    if (!storage) return {};

    try {
        const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
        return parsed;
    } catch {
        return {};
    }
};

const readRememberedStereoDownmix = (fingerprint, storage = getStorage()) => {
    if (!fingerprint) return null;

    const entry = readEntries(storage)[fingerprint];
    return entry && typeof entry.forceStereoDownmix === 'boolean' ? entry.forceStereoDownmix : null;
};

const rememberStereoDownmix = (fingerprint, forceStereoDownmix, storage = getStorage()) => {
    if (!fingerprint || typeof forceStereoDownmix !== 'boolean' || !storage) return;

    const entries = readEntries(storage);
    entries[fingerprint] = {
        forceStereoDownmix,
        updatedAtMs: Date.now(),
    };

    const retainedEntries = Object.entries(entries)
        .filter(([, entry]) => entry && typeof entry.forceStereoDownmix === 'boolean')
        .sort(([, a], [, b]) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0))
        .slice(0, MAX_ENTRIES);

    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(retainedEntries)));
    } catch {
        // A full or restricted localStorage must not interrupt playback.
    }
};

module.exports = {
    fingerprintStream,
    readRememberedStereoDownmix,
    rememberStereoDownmix,
};
