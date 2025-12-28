import { useState, useCallback } from 'react';

export type ClickAction = 'TRANSLATE' | 'COPY' | 'WEBHOOK';
export type TranslationProvider = 'GOOGLE' | 'GEMINI' | 'OPENAI' | 'CLAUDE' | 'OLLAMA' | 'OPENROUTER' | 'CUSTOM';
export type SubtitleUIMode = 'OVERLAY' | 'NATIVE';

// Default base URLs for LLM providers
export const DEFAULT_PROVIDER_URLS: Record<string, string> = {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta',
    OPENAI: 'https://api.openai.com/v1',
    CLAUDE: 'https://api.anthropic.com/v1',
    OLLAMA: 'http://localhost:11434',
    OPENROUTER: 'https://openrouter.ai/api/v1',
    CUSTOM: '',
};

// Default model names for LLM providers
export const DEFAULT_PROVIDER_MODELS: Record<string, string> = {
    GEMINI: 'gemma-3-27b-it',
    OPENAI: 'gpt-4o-mini',
    CLAUDE: 'claude-sonnet-4-20250514',
    OLLAMA: 'llama3.2',
    OPENROUTER: 'openai/gpt-4o-mini',
    CUSTOM: '',
};

// Default prompts for LLM providers
export const DEFAULT_PROVIDER_PROMPTS: Record<string, string> = {
    GEMINI: '"{word}" - give one or more translations in {targetLangs}.\n-Use plain text.\n-No additional text except translations.\nFormat:\n[lang]: translation1, translation2...',
    OPENAI: 'Translate "{word}" to {targetLangs}. Provide concise translations only.\nFormat:\n[lang]: translation1, translation2...',
    CLAUDE: 'Translate "{word}" into {targetLangs}. Be concise and provide only translations.\nFormat:\n[lang]: translation1, translation2...',
    OLLAMA: 'Translate "{word}" to {targetLangs}. Return only translations, no explanations.\nFormat:\n[lang]: translation1, translation2...',
    OPENROUTER: 'Translate "{word}" to {targetLangs}. Provide only translations.\nFormat:\n[lang]: translation1, translation2...',
    CUSTOM: '"{word}" - give one or more translations in {targetLangs}.\n-Use plain text.\n-No additional text except translations.\nFormat:\n[lang]: translation1, translation2...',
};

export interface InteractiveSettings {
    uiMode: SubtitleUIMode;
    clickAction: ClickAction;
    provider: TranslationProvider;
    sourceLang: string;
    targetLang: string;
    targetLangs: string[];
    apiKey: string;
    providerApiKeys: Record<string, string>;
    providerUrls: Record<string, string>;
    providerModels: Record<string, string>;
    providerPrompts: Record<string, string>;
    webhookUrl: string;
    pauseOnTranslate: boolean;
    pauseOnCopy: boolean;
}

// Translation cache: word -> { lang -> translation }
export type TranslationCache = Record<string, Record<string, string>>;

const STORAGE_KEY = 'stremio_interactive_subtitles_settings';
const CACHE_KEY = 'stremio_interactive_subtitles_cache';

const DEFAULT_SETTINGS: InteractiveSettings = {
    uiMode: 'NATIVE',
    clickAction: 'TRANSLATE',
    provider: 'GOOGLE',
    sourceLang: 'auto',
    targetLang: 'eng',
    targetLangs: ['eng'],
    apiKey: '',
    providerApiKeys: {},
    providerUrls: { ...DEFAULT_PROVIDER_URLS },
    providerModels: { ...DEFAULT_PROVIDER_MODELS },
    providerPrompts: { ...DEFAULT_PROVIDER_PROMPTS },
    webhookUrl: '',
    pauseOnTranslate: true,
    pauseOnCopy: false,
};

export const useInteractiveSettings = () => {
    const [settings, setSettingsState] = useState<InteractiveSettings>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.error('Failed to load interactive settings:', e);
        }
        return DEFAULT_SETTINGS;
    });

    const setSettings = useCallback((newSettings: Partial<InteractiveSettings>) => {
        setSettingsState((prev) => {
            const updated = { ...prev, ...newSettings };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error('Failed to save interactive settings:', e);
            }
            return updated;
        });
    }, []);

    const resetSettings = useCallback(() => {
        setSettingsState(DEFAULT_SETTINGS);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error('Failed to reset interactive settings:', e);
        }
    }, []);

    // Cache management
    const getCache = useCallback((): TranslationCache => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : {};
        } catch {
            return {};
        }
    }, []);

    const getCachedTranslation = useCallback((word: string, lang: string): string | null => {
        const cache = getCache();
        return cache[word.toLowerCase()]?.[lang] || null;
    }, [getCache]);

    const setCachedTranslation = useCallback((word: string, lang: string, translation: string) => {
        try {
            const cache = getCache();
            const wordKey = word.toLowerCase();
            if (!cache[wordKey]) {
                cache[wordKey] = {};
            }
            cache[wordKey][lang] = translation;
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.error('Failed to cache translation:', e);
        }
    }, [getCache]);

    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (e) {
            console.error('Failed to clear cache:', e);
        }
    }, []);

    return {
        settings,
        setSettings,
        resetSettings,
        DEFAULT_SETTINGS,
        getCachedTranslation,
        setCachedTranslation,
        clearCache
    };
};

export default useInteractiveSettings;
