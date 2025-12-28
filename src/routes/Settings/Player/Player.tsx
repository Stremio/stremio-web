import React, { forwardRef, useMemo } from 'react';
import { ColorInput, MultiselectMenu, Toggle, Input } from 'stremio/components';
import LanguageMultiselect from 'stremio/components/LanguageMultiselect';
import { useServices } from 'stremio/services';
import { Category, Option, Section } from '../components';
import usePlayerOptions from './usePlayerOptions';
import { usePlatform, languageNames, useLanguageSorting } from 'stremio/common';
import useInteractiveSettings, { ClickAction, TranslationProvider, SubtitleUIMode, DEFAULT_PROVIDER_URLS, DEFAULT_PROVIDER_MODELS, DEFAULT_PROVIDER_PROMPTS } from './useInteractiveSettings';

type Props = {
    profile: Profile,
};

const UI_MODE_OPTIONS: { value: SubtitleUIMode; label: string }[] = [
    { value: 'OVERLAY', label: 'Interactive Overlay' },
    { value: 'NATIVE', label: 'Native' },
];

const CLICK_ACTION_OPTIONS: { value: ClickAction; label: string }[] = [
    { value: 'TRANSLATE', label: 'Translate' },
    { value: 'COPY', label: 'Copy to Clipboard' },
    //{ value: 'WEBHOOK', label: 'Send to Webhook' },
];

const PROVIDER_OPTIONS: { value: TranslationProvider; label: string }[] = [
    { value: 'GOOGLE', label: 'Google Translate' },
    { value: 'GEMINI', label: 'Google Gemini' },
    { value: 'OPENAI', label: 'OpenAI' },
    { value: 'CLAUDE', label: 'Claude' },
    { value: 'OLLAMA', label: 'Ollama (Local)' },
    { value: 'OPENROUTER', label: 'OpenRouter' },
    { value: 'CUSTOM', label: 'Custom (OpenAI Compatible)' },
];

const LLM_PROVIDERS = ['GEMINI', 'OPENAI', 'CLAUDE', 'OLLAMA', 'OPENROUTER', 'CUSTOM'];

const Player = forwardRef<HTMLDivElement, Props>(({ profile }: Props, ref) => {
    const { shell } = useServices();
    const platform = usePlatform();
    const { settings: interactiveSettings, setSettings: setInteractiveSettings, clearCache } = useInteractiveSettings();

    // Cache management state
    const [cacheSearch, setCacheSearch] = React.useState('');
    const [showCache, setShowCache] = React.useState(false);
    const [cacheRefresh, setCacheRefresh] = React.useState(0);

    // Get cache entries
    const cacheEntries = useMemo(() => {
        try {
            const cached = localStorage.getItem('stremio_interactive_subtitles_cache');
            if (!cached) return [];
            const cache = JSON.parse(cached);
            const entries: { word: string; lang: string; translation: string }[] = [];
            Object.keys(cache).forEach((word) => {
                Object.keys(cache[word]).forEach((lang) => {
                    entries.push({ word, lang, translation: cache[word][lang] });
                });
            });
            return entries;
        } catch {
            return [];
        }
    }, [cacheRefresh]); // Re-calculate when cache is modified

    // Filter cache entries by search
    const filteredCache = useMemo(() => {
        if (!cacheSearch.trim()) return cacheEntries;
        const searchLower = cacheSearch.toLowerCase();
        return cacheEntries.filter((entry) =>
            entry.word.toLowerCase().includes(searchLower) ||
            entry.translation.toLowerCase().includes(searchLower)
        );
    }, [cacheEntries, cacheSearch]);

    // Delete single cache entry
    const deleteCacheEntry = (word: string, lang: string) => {
        try {
            const cached = localStorage.getItem('stremio_interactive_subtitles_cache');
            if (!cached) return;
            const cache = JSON.parse(cached);
            if (cache[word] && cache[word][lang]) {
                delete cache[word][lang];
                if (Object.keys(cache[word]).length === 0) {
                    delete cache[word];
                }
                localStorage.setItem('stremio_interactive_subtitles_cache', JSON.stringify(cache));
                setCacheRefresh((prev) => prev + 1); // Trigger re-render without hiding list
            }
        } catch (e) {
            console.error('Failed to delete cache entry:', e);
        }
    };

    // Export cache as JSON
    const exportCache = () => {
        try {
            const cached = localStorage.getItem('stremio_interactive_subtitles_cache');
            if (!cached) {
                alert('Cache is empty');
                return;
            }
            const blob = new Blob([cached], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stremio-translation-cache-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Failed to export cache:', e);
            alert('Failed to export cache');
        }
    };

    // Import cache from JSON
    const importCache = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = event.target?.result as string;
                    const importedCache = JSON.parse(content);

                    // Validate structure
                    if (typeof importedCache !== 'object' || importedCache === null) {
                        throw new Error('Invalid cache format');
                    }

                    // Merge with existing cache
                    const cached = localStorage.getItem('stremio_interactive_subtitles_cache');
                    const existingCache = cached ? JSON.parse(cached) : {};

                    const mergedCache = { ...existingCache };
                    Object.keys(importedCache).forEach((word) => {
                        if (!mergedCache[word]) {
                            mergedCache[word] = {};
                        }
                        Object.keys(importedCache[word]).forEach((lang) => {
                            mergedCache[word][lang] = importedCache[word][lang];
                        });
                    });

                    localStorage.setItem('stremio_interactive_subtitles_cache', JSON.stringify(mergedCache));
                    setCacheRefresh((prev) => prev + 1); // Trigger re-render without hiding list
                    alert('Cache imported successfully');
                } catch (e) {
                    console.error('Failed to import cache:', e);
                    alert('Failed to import cache: Invalid JSON format');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const {
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        audioLanguageSelect,
        surroundSoundToggle,
        seekTimeDurationSelect,
        seekShortTimeDurationSelect,
        playInExternalPlayerSelect,
        nextVideoPopupDurationSelect,
        bingeWatchingToggle,
        playInBackgroundToggle,
        hardwareDecodingToggle,
        videoModeSelect,
        pauseOnMinimizeToggle,
    } = usePlayerOptions(profile);

    // Interactive Subtitles Options - use proper language sorting
    const languageOptions = useMemo(() => [
        { value: 'auto', label: 'Auto Detect' },
        ...Object.keys(languageNames).map((code) => ({
            value: code,
            label: languageNames[code as keyof typeof languageNames]
        }))
    ], []);

    const targetLanguageOptions = useMemo(() =>
        Object.keys(languageNames).map((code) => ({
            value: code,
            label: languageNames[code as keyof typeof languageNames]
        })), []);

    // Use language sorting for better UX
    const { sortedOptions: sortedTargetLanguages } = useLanguageSorting(targetLanguageOptions);

    const uiModeSelect = useMemo(() => ({
        options: UI_MODE_OPTIONS,
        value: interactiveSettings.uiMode,
        onSelect: (value: string) => setInteractiveSettings({ uiMode: value as SubtitleUIMode }),
    }), [interactiveSettings.uiMode, setInteractiveSettings]);

    const clickActionSelect = useMemo(() => ({
        options: CLICK_ACTION_OPTIONS,
        value: interactiveSettings.clickAction,
        onSelect: (value: string) => setInteractiveSettings({ clickAction: value as ClickAction }),
    }), [interactiveSettings.clickAction, setInteractiveSettings]);

    const providerSelect = useMemo(() => ({
        options: PROVIDER_OPTIONS,
        value: interactiveSettings.provider,
        onSelect: (value: string) => setInteractiveSettings({ provider: value as TranslationProvider }),
    }), [interactiveSettings.provider, setInteractiveSettings]);

    const sourceLangSelect = useMemo(() => ({
        options: languageOptions,
        value: interactiveSettings.sourceLang,
        onSelect: (value: string) => setInteractiveSettings({ sourceLang: value }),
    }), [interactiveSettings.sourceLang, languageOptions, setInteractiveSettings]);

    const targetLangSelect = useMemo(() => ({
        options: sortedTargetLanguages,
        value: interactiveSettings.targetLang,
        onSelect: (value: string) => setInteractiveSettings({ targetLang: value }),
    }), [interactiveSettings.targetLang, sortedTargetLanguages, setInteractiveSettings]);

    // Multi-select for LLM target languages - matches Multiselect component API
    const multiTargetLangsSelect = useMemo(() => {
        // Generate tooltip with selected languages line by line
        const selectedLanguageNames = interactiveSettings.targetLangs
            .map((code) => languageNames[code as keyof typeof languageNames] || code)
            .join('\n');
        const tooltipTitle = selectedLanguageNames || 'Target Languages';

        return {
            mode: 'popup' as const,
            direction: 'bottom-left' as const,
            title: tooltipTitle,
            options: sortedTargetLanguages,
            selected: interactiveSettings.targetLangs,
            onSelect: (event: { type: string; value: string; nativeEvent?: { closeMenuPrevented?: boolean } }) => {
                // Prevent menu from closing on selection
                if (event.nativeEvent) {
                    event.nativeEvent.closeMenuPrevented = true;
                }
                const value = event.value;
                const current = interactiveSettings.targetLangs;
                const updated = current.includes(value)
                    ? current.filter((l) => l !== value)
                    : [...current, value];
                setInteractiveSettings({ targetLangs: updated.length > 0 ? updated : [] });
            },
        };
    }, [interactiveSettings.targetLangs, sortedTargetLanguages, setInteractiveSettings]);

    const isLLMProvider = LLM_PROVIDERS.includes(interactiveSettings.provider);
    const showApiKeyInput = ['GEMINI', 'OPENAI', 'CLAUDE', 'OPENROUTER', 'CUSTOM'].includes(interactiveSettings.provider);
    const isOverlayMode = interactiveSettings.uiMode === 'OVERLAY';
    const currentProvider = interactiveSettings.provider;
    const currentApiKey = interactiveSettings.providerApiKeys?.[currentProvider] ?? '';
    const currentUrl = interactiveSettings.providerUrls?.[currentProvider] ?? DEFAULT_PROVIDER_URLS[currentProvider] ?? '';
    const currentModel = interactiveSettings.providerModels?.[currentProvider] ?? DEFAULT_PROVIDER_MODELS[currentProvider] ?? '';
    const currentPrompt = interactiveSettings.providerPrompts?.[currentProvider] ?? DEFAULT_PROVIDER_PROMPTS[currentProvider] ?? '';

    const pauseOnTranslateToggle = useMemo(() => ({
        checked: interactiveSettings.pauseOnTranslate,
        onClick: () => setInteractiveSettings({ pauseOnTranslate: !interactiveSettings.pauseOnTranslate }),
    }), [interactiveSettings.pauseOnTranslate, setInteractiveSettings]);

    const pauseOnCopyToggle = useMemo(() => ({
        checked: interactiveSettings.pauseOnCopy,
        onClick: () => setInteractiveSettings({ pauseOnCopy: !interactiveSettings.pauseOnCopy }),
    }), [interactiveSettings.pauseOnCopy, setInteractiveSettings]);

    const textareaStyle: React.CSSProperties = {
        width: '100%',
        minHeight: '100px',
        padding: '10px 14px',
        fontSize: '0.9rem',
        resize: 'vertical' as const,
        fontFamily: 'inherit',
        borderRadius: '1rem',
        border: 'none',
        backgroundColor: 'var(--overlay-color)',
        color: 'var(--primary-foreground-color)',
    };

    return (
        <Section ref={ref} label={'SETTINGS_NAV_PLAYER'}>
            {/* Interactive Subtitles Settings */}
            <Category icon={'subtitles'} label={'Interactive Subtitles'}>
                <Option label={'Subtitle Mode'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...uiModeSelect}
                    />
                </Option>
                {isOverlayMode && (
                    <>
                        <Option label={'Click Action'}>
                            <MultiselectMenu
                                className={'multiselect'}
                                {...clickActionSelect}
                            />
                        </Option>
                        {interactiveSettings.clickAction === 'TRANSLATE' && (
                            <>
                                <Option label={'Translation Provider'}>
                                    <MultiselectMenu
                                        className={'multiselect'}
                                        {...providerSelect}
                                    />
                                </Option>
                                <Option label={'Source Language'}>
                                    <MultiselectMenu
                                        className={'multiselect'}
                                        {...sourceLangSelect}
                                    />
                                </Option>
                                {!isLLMProvider && (
                                    <Option label={'Target Language'}>
                                        <MultiselectMenu
                                            className={'multiselect'}
                                            {...targetLangSelect}
                                        />
                                    </Option>
                                )}
                                {isLLMProvider && (
                                    <Option label={'Target Languages (Multi)'}>
                                        <LanguageMultiselect
                                            className={'multiselect'}
                                            {...multiTargetLangsSelect}
                                        />
                                    </Option>
                                )}
                                {showApiKeyInput && (
                                    <Option label={'API Key'}>
                                        <Input
                                            type="password"
                                            inputMode='text'
                                            placeholder="Enter API Key"
                                            value={currentApiKey}
                                            onChange={(e) => setInteractiveSettings({
                                                providerApiKeys: {
                                                    ...interactiveSettings.providerApiKeys,
                                                    [currentProvider]: e.target.value
                                                }
                                            })}
                                        />
                                    </Option>
                                )}
                                {isLLMProvider && (
                                    <Option label={'Base URL'}>
                                        <Input
                                            type="url"
                                            placeholder={'https://api.example.com'}
                                            value={currentUrl}
                                            onChange={(e) => setInteractiveSettings({
                                                providerUrls: {
                                                    ...interactiveSettings.providerUrls,
                                                    [currentProvider]: e.target.value
                                                }
                                            })}
                                        />
                                    </Option>
                                )}
                                {isLLMProvider && (
                                    <Option label={'Model Name'}>
                                        <Input
                                            type="text"
                                            placeholder={'model-name'}
                                            value={currentModel}
                                            onChange={(e) => setInteractiveSettings({
                                                providerModels: {
                                                    ...interactiveSettings.providerModels,
                                                    [currentProvider]: e.target.value
                                                }
                                            })}
                                        />
                                    </Option>
                                )}
                                {isLLMProvider && (
                                    <Option label={'Custom Prompt'}>
                                        <textarea
                                            placeholder='Define "{word}" briefly. Provide definitions in: {targetLangs}'
                                            value={currentPrompt}
                                            onChange={(e) => setInteractiveSettings({
                                                providerPrompts: {
                                                    ...interactiveSettings.providerPrompts,
                                                    [currentProvider]: e.target.value
                                                }
                                            })}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            style={textareaStyle}
                                        />
                                    </Option>
                                )}
                                <Option label={'Pause on Translate'}>
                                    <Toggle
                                        tabIndex={-1}
                                        {...pauseOnTranslateToggle}
                                    />
                                </Option>
                                <Option label={'Translation Cache'}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <button
                                            onClick={() => setShowCache(!showCache)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.5rem',
                                                border: 'none',
                                                backgroundColor: 'var(--overlay-color)',
                                                color: 'var(--primary-foreground-color)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {showCache ? 'Hide' : 'Show'} ({cacheEntries.length})
                                        </button>
                                        <button
                                            onClick={exportCache}
                                            style={{
                                                padding: '0.1rem 0.1rem',
                                                borderRadius: '0.2rem',
                                                border: 'none',
                                                backgroundColor: 'var(--overlay-color)',
                                                color: 'var(--primary-foreground-color)',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                            title="Export cache as JSON"
                                        >
                                            📤 Export
                                        </button>
                                        <button
                                            onClick={importCache}
                                            style={{
                                                padding: '0.1rem 0.1rem',
                                                borderRadius: '0.5rem',
                                                border: 'none',
                                                backgroundColor: 'var(--overlay-color)',
                                                color: 'var(--primary-foreground-color)',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                            title="Import cache from JSON"
                                        >
                                            📥 Import
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete all cached translations?')) {
                                                    clearCache();
                                                    setCacheRefresh((prev) => prev + 1);
                                                }
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.5rem',
                                                border: 'none',
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </Option>
                                {showCache && (
                                    <Option label={''}>
                                        <div style={{ width: '100%' }}>
                                            <Input
                                                type="text"
                                                placeholder="Search cache..."
                                                value={cacheSearch}
                                                onChange={(e) => setCacheSearch(e.target.value)}
                                                style={{ marginBottom: '0.5rem' }}
                                            />
                                            <div style={{
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                backgroundColor: 'var(--overlay-color)',
                                                borderRadius: '0.5rem',
                                                padding: '0.5rem'
                                            }}>
                                                {filteredCache.length === 0 ? (
                                                    <div style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                                                        {cacheSearch ? 'No matches found' : 'Cache is empty'}
                                                    </div>
                                                ) : (
                                                    filteredCache.map((entry, idx) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'flex-start',
                                                                padding: '0.5rem',
                                                                marginBottom: '0.5rem',
                                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                                borderRadius: '0.5rem',
                                                                fontSize: '0.85rem'
                                                            }}
                                                        >
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontWeight: 'bold', color: '#FFD700', marginBottom: '0.25rem' }}>
                                                                    {entry.word}
                                                                </div>
                                                                <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                                                    Lang: {entry.lang}
                                                                </div>
                                                                <div style={{ color: '#ccc', wordBreak: 'break-word' }}>
                                                                    {entry.translation}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => deleteCacheEntry(entry.word, entry.lang)}
                                                                style={{
                                                                    marginLeft: '0.5rem',
                                                                    padding: '0.25rem 0.5rem',
                                                                    borderRadius: '0.25rem',
                                                                    border: 'none',
                                                                    backgroundColor: '#ff4444',
                                                                    color: 'white',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.75rem',
                                                                    flexShrink: 0
                                                                }}
                                                                title="Delete"
                                                            >
                                                                &#10005;
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </Option>
                                )}
                            </>
                        )}
                        {interactiveSettings.clickAction === 'COPY' && (
                            <Option label={'Pause on Copy'}>
                                <Toggle
                                    tabIndex={-1}
                                    {...pauseOnCopyToggle}
                                />
                            </Option>
                        )}
                        {interactiveSettings.clickAction === 'WEBHOOK' && (
                            <Option label={'Webhook URL'}>
                                <Input
                                    type="text"
                                    placeholder="https://example.com/webhook"
                                    value={interactiveSettings.webhookUrl}
                                    onChange={(e) => setInteractiveSettings({ webhookUrl: e.target.value })}
                                />
                            </Option>
                        )}
                    </>
                )}
            </Category>

            <Category icon={'subtitles'} label={'SETTINGS_SECTION_SUBTITLES'}>
                <Option label={'SETTINGS_SUBTITLES_LANGUAGE'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...subtitlesLanguageSelect}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_SIZE'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...subtitlesSizeSelect}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_COLOR'}>
                    <ColorInput
                        className={'color-input'}
                        {...subtitlesTextColorInput}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_COLOR_BACKGROUND'}>
                    <ColorInput
                        className={'color-input'}
                        {...subtitlesBackgroundColorInput}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_COLOR_OUTLINE'}>
                    <ColorInput
                        className={'color-input'}
                        {...subtitlesOutlineColorInput}
                    />
                </Option>
            </Category>
            <Category icon={'volume-medium'} label={'SETTINGS_SECTION_AUDIO'}>
                <Option label={'SETTINGS_DEFAULT_AUDIO_TRACK'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...audioLanguageSelect}
                    />
                </Option>
                <Option label={'SETTINGS_SURROUND_SOUND'}>
                    <Toggle
                        tabIndex={-1}
                        {...surroundSoundToggle}
                    />
                </Option>
            </Category>
            <Category icon={'remote'} label={'SETTINGS_SECTION_CONTROLS'}>
                <Option label={'SETTINGS_SEEK_KEY'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...seekTimeDurationSelect}
                    />
                </Option>
                <Option label={'SETTINGS_SEEK_KEY_SHIFT'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...seekShortTimeDurationSelect}
                    />
                </Option>
                <Option label={'SETTINGS_PLAY_IN_BACKGROUND'}>
                    <Toggle
                        disabled={true}
                        tabIndex={-1}
                        {...playInBackgroundToggle}
                    />
                </Option>
            </Category>
            <Category icon={'play'} label={'SETTINGS_SECTION_AUTO_PLAY'}>
                <Option label={'AUTO_PLAY'}>
                    <Toggle
                        tabIndex={-1}
                        {...bingeWatchingToggle}
                    />
                </Option>
                <Option label={'SETTINGS_NEXT_VIDEO_POPUP_DURATION'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...nextVideoPopupDurationSelect}
                    />
                </Option>
            </Category>
            <Category icon={'glasses'} label={'SETTINGS_SECTION_ADVANCED'}>
                <Option label={'SETTINGS_PLAY_IN_EXTERNAL_PLAYER'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...playInExternalPlayerSelect}
                    />
                </Option>
                {
                    shell.active &&
                    <Option label={'SETTINGS_HWDEC'}>
                        <Toggle
                            tabIndex={-1}
                            {...hardwareDecodingToggle}
                        />
                    </Option>
                }
                {
                    shell.active && platform.name === 'windows' &&
                    <Option label={'SETTINGS_VIDEO_MODE'}>
                        <MultiselectMenu
                            className={'multiselect'}
                            {...videoModeSelect}
                        />
                    </Option>
                }
                {
                    shell.active &&
                    <Option label={'SETTINGS_PAUSE_MINIMIZED'}>
                        <Toggle
                            tabIndex={-1}
                            {...pauseOnMinimizeToggle}
                        />
                    </Option>
                }
            </Category>
        </Section>
    );
});

export default Player;

