// Copyright (C) 2017-2026 Smart code 203358507

import langs from 'langs';

// Use Stremio's language database, including its regional subtitle languages.
const supportedLanguages = langs.all();
const aliases = new Map(supportedLanguages.map((language) => [language['2'], language['2']]));
supportedLanguages.forEach((language) => {
    (['1', '2B', '2T', '3', 'ietf'] as const).forEach((key) => {
        const alias = language[key]?.toLowerCase();
        if (alias && !aliases.has(alias)) aliases.set(alias, language['2']);
    });
});
Object.entries({ iw: 'heb', in: 'ind', ji: 'yid' }).forEach(([alias, code]) => aliases.set(alias, code));

const normalizeSubtitleLanguage = (language: unknown): string | null => {
    if (typeof language !== 'string') return null;
    let code = language.trim().toLowerCase().replace(/_/g, '-');
    while (code) {
        if (aliases.has(code)) return aliases.get(code) ?? null;
        const separator = code.lastIndexOf('-');
        if (separator === -1) break;
        code = code.slice(0, separator);
    }
    return null;
};

const filterSubtitleTracks = <T extends { lang?: string }>(tracks: T[], enabled: boolean, preferredLanguages: unknown[], activeLanguage?: string | null): T[] => {
    if (!enabled) return tracks;
    const preferred = new Set(preferredLanguages.map(normalizeSubtitleLanguage).filter(Boolean));
    // Older or malformed settings should not leave the user with an empty menu.
    if (preferred.size === 0) return tracks;
    const active = normalizeSubtitleLanguage(activeLanguage);
    if (active) preferred.add(active);
    return tracks.filter((track) => track.lang === 'local' ||
        (activeLanguage && track.lang === activeLanguage) || preferred.has(normalizeSubtitleLanguage(track.lang)));
};

export { normalizeSubtitleLanguage, filterSubtitleTracks };
