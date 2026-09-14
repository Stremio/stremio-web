const STORAGE_KEY = 'stremio.force-stereo-global.v1';
export const GLOBAL_FORCE_STEREO_CHANGED_EVENT = 'stremio-force-stereo-changed';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

const getStorage = (): StorageLike | null => {
    if (typeof window === 'undefined') return null;

    try {
        return window.localStorage;
    } catch (_) {
        return null;
    }
};

export const readGlobalForceStereo = (storage: StorageLike | null = getStorage()): boolean => {
    if (!storage) return false;

    try {
        return storage.getItem(STORAGE_KEY) === 'true';
    } catch (_) {
        return false;
    }
};

export const rememberGlobalForceStereo = (
    enabled: boolean,
    storage: StorageLike | null = getStorage(),
): void => {
    if (!storage) return;

    try {
        storage.setItem(STORAGE_KEY, String(enabled));
    } catch (_) {
        // A storage failure should not prevent changing the current setting.
    }

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(GLOBAL_FORCE_STEREO_CHANGED_EVENT, {
            detail: enabled,
        }));
    }
};
