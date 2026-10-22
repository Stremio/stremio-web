import { useSyncExternalStore } from 'react';

type ThemeId = 'default' | 'letterboxd' | 'elenio' | 'flannel';

// 'sidebar' is Stremio's own layout, 'boxd' is the letterboxd.com style layout
// (sections as top bar links, a centered column, film pages with the poster beside the details)
type ThemeLayout = 'sidebar' | 'boxd';

type Theme = {
    id: ThemeId,
    name: string,
    description: string,
    // Colors shown in the preview card in settings: [background, surface, accent, text]
    swatches: [string, string, string, string],
    // Browser UI color (address bar on mobile, PWA title bar)
    metaColor: string,
    layout: ThemeLayout,
};

const THEMES: Theme[] = [
    {
        id: 'default',
        name: 'Stremio',
        description: 'The original deep purple look',
        swatches: ['#0c0b11', '#1a173e', '#7b5bf5', '#ffffff'],
        metaColor: '#2a2843',
        layout: 'sidebar',
    },
    {
        id: 'letterboxd',
        name: 'Letterboxd',
        description: 'Slate grey, three dots and big posters',
        swatches: ['#14181c', '#2c3440', '#00e054', '#ff8000'],
        metaColor: '#14181c',
        layout: 'boxd',
    },
    {
        id: 'elenio',
        name: 'Elenio',
        description: 'Letterboxd in pink lace, with storybook animals',
        swatches: ['#f8f2e5', '#f6d9e3', '#eec3d6', '#7b5b70'],
        metaColor: '#eec3d6',
        layout: 'boxd',
    },
    {
        id: 'flannel',
        name: 'Flannel',
        description: 'Cozy plaid, a leather patch and stitched seams',
        swatches: ['#23251d', '#4e4334', '#c8733f', '#ece0c8'],
        metaColor: '#36372e',
        layout: 'sidebar',
    },
];

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: ThemeId = 'default';

// Themes that were renamed, so a saved choice carries over
const RENAMED_THEMES: Record<string, ThemeId> = {
    eleinur: 'elenio',
};

const isThemeId = (value: unknown): value is ThemeId => (
    THEMES.some((theme) => theme.id === value)
);

const readStoredTheme = (): ThemeId => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        const value = stored !== null && stored in RENAMED_THEMES ? RENAMED_THEMES[stored] : stored;
        return isThemeId(value) ? value : DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
};

let currentTheme: ThemeId = readStoredTheme();
const listeners = new Set<() => void>();

const getThemeLayout = (id: ThemeId): ThemeLayout => (
    THEMES.find((theme) => theme.id === id)?.layout ?? 'sidebar'
);

const applyTheme = (id: ThemeId = currentTheme) => {
    document.documentElement.dataset.theme = id;
    document.documentElement.dataset.layout = getThemeLayout(id);

    const theme = THEMES.find((theme) => theme.id === id);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (theme && metaThemeColor) {
        metaThemeColor.setAttribute('content', theme.metaColor);
    }
};

const setTheme = (id: ThemeId) => {
    if (!isThemeId(id) || id === currentTheme) return;

    currentTheme = id;
    try {
        window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
        // Storage can be unavailable (private mode); the theme still applies for this session
    }

    applyTheme(id);
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getTheme = () => currentTheme;

const useTheme = () => useSyncExternalStore(subscribe, getTheme);

const useThemeLayout = () => getThemeLayout(useTheme());

export type { ThemeId, ThemeLayout, Theme };
export { THEMES, applyTheme, setTheme, getTheme, getThemeLayout, useTheme, useThemeLayout };
