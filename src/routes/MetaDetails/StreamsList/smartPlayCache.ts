export type CachedCandidate = {
    key: string;
    label: string;
    addonName: string;
    height: number;
    hdr: boolean;
};

const keyFor = (type?: string | null, metaId?: string | null, videoId?: string | null): string | null => {
    if (typeof type !== 'string' || typeof metaId !== 'string' || type.length === 0 || metaId.length === 0) {
        return null;
    }
    return `smart-play-candidates:${type}:${metaId}:${videoId ?? ''}`;
};

export const readCachedCandidates = (
    type?: string | null,
    metaId?: string | null,
    videoId?: string | null,
): CachedCandidate[] => {
    const key = keyFor(type, metaId, videoId);
    if (!key) {
        return [];
    }
    try {
        const parsed = JSON.parse(sessionStorage.getItem(key) ?? '[]');
        return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.key === 'string') : [];
    } catch {
        return [];
    }
};

export const writeCachedCandidates = (
    type: string | null | undefined,
    metaId: string | null | undefined,
    videoId: string | null | undefined,
    candidates: CachedCandidate[],
): void => {
    const key = keyFor(type, metaId, videoId);
    if (!key) {
        return;
    }
    try {
        sessionStorage.setItem(key, JSON.stringify(candidates));
    } catch {
        // Session storage can be unavailable in private mode; the gear simply shows fewer options.
    }
};
