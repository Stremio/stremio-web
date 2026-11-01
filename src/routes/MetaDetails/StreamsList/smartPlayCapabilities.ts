const BANDWIDTH_CACHE_KEY = 'smart-play-bandwidth';
const BANDWIDTH_CACHE_MS = 15 * 60 * 1000;

type BandwidthCache = {
    at: number;
    mbps: number;
};

const clampDisplayHeight = (height: number): number => Math.min(2160, Math.max(360, Math.round(height)));

export const getDisplayHeight = (): number => {
    if (typeof window === 'undefined') {
        return 1080;
    }
    const screenHeight = typeof window.screen?.height === 'number' ? window.screen.height : 0;
    const screenWidth = typeof window.screen?.width === 'number' ? window.screen.width : 0;
    const viewportHeight = typeof window.innerHeight === 'number' ? window.innerHeight : 0;
    const dpr = typeof window.devicePixelRatio === 'number' && window.devicePixelRatio > 0 ? window.devicePixelRatio : 1;
    const base = screenHeight > 0 && screenWidth > 0
        ? Math.min(screenHeight, screenWidth)
        : viewportHeight;
    return clampDisplayHeight(base * dpr);
};

export const heightCapForMbps = (mbps: number): number => {
    if (mbps >= 35) return 2160;
    if (mbps >= 8) return 1080;
    if (mbps >= 4) return 720;
    if (mbps >= 1.5) return 480;
    return 360;
};

const readCachedBandwidth = (): number | null => {
    try {
        const parsed = JSON.parse(sessionStorage.getItem(BANDWIDTH_CACHE_KEY) ?? 'null') as BandwidthCache | null;
        if (parsed && typeof parsed.at === 'number' && typeof parsed.mbps === 'number' && Date.now() - parsed.at < BANDWIDTH_CACHE_MS) {
            return parsed.mbps;
        }
    } catch {
        // ignore malformed cache
    }
    return null;
};

const writeCachedBandwidth = (mbps: number): void => {
    try {
        sessionStorage.setItem(BANDWIDTH_CACHE_KEY, JSON.stringify({ at: Date.now(), mbps }));
    } catch {
        // ignore storage failures
    }
};

const navigatorBandwidth = (): number | null => {
    const connection = (navigator as Navigator & {
        connection?: { downlink?: number; saveData?: boolean };
    }).connection;
    if (!connection) {
        return null;
    }
    if (connection.saveData) {
        return 1.5;
    }
    if (typeof connection.downlink === 'number' && connection.downlink > 0) {
        return connection.downlink;
    }
    return null;
};

export const getBandwidthMbps = (): number | null => {
    return readCachedBandwidth() ?? navigatorBandwidth();
};

export const getTargetHeight = (override?: number): number => {
    if (typeof override === 'number' && override > 0) {
        return override;
    }
    const display = getDisplayHeight();
    const bandwidth = getBandwidthMbps();
    return bandwidth === null ? display : Math.min(display, heightCapForMbps(bandwidth));
};

export const warmBandwidthProbe = async (): Promise<void> => {
    if (readCachedBandwidth() !== null) {
        return;
    }
    if (typeof fetch !== 'function') {
        return;
    }
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? window.setTimeout(() => controller.abort(), 2500) : 0;
    try {
        const started = performance.now();
        const response = await fetch('https://speed.cloudflare.com/__down?bytes=1000000', {
            cache: 'no-store',
            mode: 'cors',
            signal: controller?.signal,
        });
        if (!response.ok || !response.body) {
            return;
        }
        const reader = response.body.getReader();
        let bytes = 0;
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            bytes += value?.byteLength ?? 0;
        }
        const elapsed = performance.now() - started;
        if (bytes > 0 && elapsed > 0) {
            writeCachedBandwidth((bytes * 8) / (elapsed / 1000) / 1_000_000);
        }
    } catch {
        // CORS, offline, or aborted probes fall back to navigator.connection/display.
    } finally {
        if (timer) {
            window.clearTimeout(timer);
        }
    }
};
