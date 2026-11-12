// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDiscord, usePlatform, useShortcuts } from 'stremio/common';
import { PAGES } from './constants';
import isTraktAuthenticated from './isTraktAuthenticated';
import { isCacheLocationSupported } from './Streaming/useCacheLocation';
import type { SettingsGroup } from './useSettingsPages';

type Candidate = {
    terms: string[],
    label: string,
    page: string,
    row?: string,
};

type SearchResult = {
    id: string,
    label: string,
    crumb: string,
    page: string,
    row?: string,
};

const PAGE_KEYS: Record<string, string> = {
    [PAGES.DEVICE]: 'device browser this device this browser hardware',
    [PAGES.STREAMING]: 'device browser this device this browser server',
};

const SHORTCUT_KEYS: Record<string, string> = {
    fullscreen: 'full screen',
    exit: 'full screen',
};

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;

const toWords = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}%]+/u).filter(Boolean);

const useSettingsSearch = (query: string, groups: SettingsGroup[], profile: Profile, streamingServer: StreamingServer, spotlightPicks: number) => {
    const { t } = useTranslation();
    const platform = usePlatform();
    const discord = useDiscord();
    const { grouped: shortcutGroups } = useShortcuts();

    const candidates = useMemo(() => {
        const { shell } = platform;
        const auth = profile.auth;
        const serverSettings = streamingServer.settings?.type === 'Ready' ? streamingServer.settings.content as StreamingServerSettings : null;
        const serverReady = serverSettings !== null;
        const traktButton = isTraktAuthenticated(profile) ? t('SETTINGS_TRAKT_DISCONNECT') : t('SETTINGS_TRAKT_AUTHENTICATE');
        const spotlightRowsLabel = spotlightPicks > 1 ? t('SETTINGS_SPOTLIGHT_SHOW_ROWS') : t('SETTINGS_SPOTLIGHT_SHOW_ROW');
        const row = (page: string, rowId: string, label: string, keys = '', button = ''): Candidate => ({ terms: [`${label} ${keys} ${button}`], label, page, row: rowId });

        const byPage: Record<string, Candidate[]> = {
            [PAGES.INTERFACE]: [
                row(PAGES.INTERFACE, 'lang', t('SETTINGS_UI_LANGUAGE'), 'language translation locale'),
                row(PAGES.INTERFACE, 'zoom', t('SETTINGS_UI_ZOOM'), 'scale size bigger smaller'),
                row(PAGES.INTERFACE, 'spotlight', t('SETTINGS_SHOW_SPOTLIGHT'), 'hero banner'),
                row(PAGES.INTERFACE, 'spotlightCatalogs', t('SETTINGS_SPOTLIGHT_CATALOGS_TITLE'), 'hero'),
                row(PAGES.INTERFACE, 'spotlightRows', spotlightRowsLabel),
                row(PAGES.INTERFACE, 'blur', t('SETTINGS_BLUR_UNWATCHED_IMAGE'), 'spoilers hide'),
                row(PAGES.INTERFACE, 'gamepad', t('SETTINGS_GAMEPAD'), 'controller'),
            ],
            [PAGES.PLAYER]: [
                row(PAGES.PLAYER, 'subLang', t('SETTINGS_SUBTITLES_LANGUAGE'), 'captions'),
                row(PAGES.PLAYER, 'subSize', t('SETTINGS_SUBTITLES_SIZE'), 'captions font'),
                row(PAGES.PLAYER, 'subPos', t('PLAYER_SUBTITLES_VERTICAL_POSITION'), 'captions offset'),
                row(PAGES.PLAYER, 'subColor', t('SETTINGS_SUBTITLES_COLOR'), 'captions'),
                row(PAGES.PLAYER, 'subBg', t('SETTINGS_SUBTITLES_COLOR_BACKGROUND'), 'captions'),
                row(PAGES.PLAYER, 'subOutline', t('SETTINGS_SUBTITLES_COLOR_OUTLINE'), 'captions'),
                row(PAGES.PLAYER, 'ass', t('SETTINGS_ASS_SUBTITLES_STYLING'), 'captions'),
                row(PAGES.PLAYER, 'audio', t('SETTINGS_DEFAULT_AUDIO_TRACK'), 'language dub'),
                row(PAGES.PLAYER, 'seek', t('SETTINGS_SEEK_KEY'), 'skip'),
                row(PAGES.PLAYER, 'seekShift', t('SETTINGS_SEEK_KEY_SHIFT'), 'skip'),
                row(PAGES.PLAYER, 'auto', t('AUTO_PLAY'), 'binge'),
                row(PAGES.PLAYER, 'popup', t('SETTINGS_NEXT_VIDEO_POPUP_DURATION'), 'binge'),
                row(PAGES.PLAYER, 'external', t('SETTINGS_PLAY_IN_EXTERNAL_PLAYER'), 'vlc mpv iina'),
            ],
            [PAGES.INTEGRATIONS]: [
                row(PAGES.INTEGRATIONS, 'trakt', t('SETTINGS_TRAKT'), 'scrobble sync', traktButton),
                row(PAGES.INTEGRATIONS, 'calendar', t('SETTINGS_SUBSCRIBE_CALENDAR'), 'ics ical episodes', t('SETTINGS_CALENDAR_SUBSCRIBE')),
            ],
            [PAGES.DEVICE]: [
                row(PAGES.DEVICE, 'surround', t('SETTINGS_SURROUND_SOUND'), 'audio 5.1'),
                ...(shell.active ? [row(PAGES.DEVICE, 'hwdec', t('SETTINGS_HWDEC'), 'gpu hwdec')] : []),
                ...(shell.active && shell.capabilities.gpuVideoProcessing ? [row(PAGES.DEVICE, 'gpu', t('SETTINGS_GPU_VIDEO_PROCESSING'), 'rtx vsr hdr')] : []),
                ...(shell.active && platform.name === 'windows' ? [row(PAGES.DEVICE, 'videoMode', t('SETTINGS_VIDEO_MODE'), 'renderer')] : []),
                ...(shell.active ? [row(PAGES.DEVICE, 'pause', t('SETTINGS_PAUSE_MINIMIZED'), 'background')] : []),
                ...(shell.capabilities.mpvConfig ? [row(PAGES.DEVICE, 'mpvConfig', t('SETTINGS_MPV_CONFIG'), 'mpv config')] : []),
                ...(shell.active ? [
                    row(PAGES.DEVICE, 'quit', t('SETTINGS_QUIT_ON_CLOSE'), 'tray window'),
                    row(PAGES.DEVICE, 'esc', t('SETTINGS_FULLSCREEN_EXIT'), 'esc keyboard fullscreen'),
                ] : []),
                ...(shell.active && discord.available ? [row(PAGES.DEVICE, 'discord', t('SETTINGS_DISCORD'), 'rich presence rpc')] : []),
            ],
            [PAGES.STREAMING]: [
                { terms: [`${t('SETTINGS_GROUP_STREAMING_SERVER')} url address`], label: t('SETTINGS_GROUP_STREAMING_SERVER'), page: PAGES.STREAMING, row: 'urls' },
                ...(streamingServer.remoteUrl !== null ? [row(PAGES.STREAMING, 'remoteUrl', t('SETTINGS_REMOTE_URL'), 'https link', t('COPY'))] : []),
                ...(serverReady && auth !== null && auth.user !== null && streamingServer.networkInfo?.type === 'Ready' ? [row(PAGES.STREAMING, 'https', t('SETTINGS_STREAMING_HTTPS_ENDPOINT'), 'ssl')] : []),
                ...(serverReady ? [row(PAGES.STREAMING, 'cache', t('SETTINGS_SERVER_CACHE_SIZE'), 'disk storage')] : []),
                ...(isCacheLocationSupported(platform, streamingServer) ? [row(PAGES.STREAMING, 'drive', t('SETTINGS_CACHING_DRIVE'), 'disk storage folder')] : []),
                ...(serverReady ? [row(PAGES.STREAMING, 'torrent', t('SETTINGS_SERVER_TORRENT_PROFILE'), 'peers speed')] : []),
                ...(serverReady && streamingServer.deviceInfo?.type === 'Ready' ? [row(PAGES.STREAMING, 'transcode', t('SETTINGS_TRANSCODE_PROFILE'), 'video convert')] : []),
            ],
            [PAGES.ACCOUNT]: [
                auth !== null ?
                    { terms: [t('LOG_OUT'), 'logout', 'sign out'], label: t('LOG_OUT'), page: PAGES.ACCOUNT }
                    :
                    { terms: [`${t('LOG_IN')} / ${t('SIGN_UP')}`, 'login', 'signup'], label: `${t('LOG_IN')} / ${t('SIGN_UP')}`, page: PAGES.ACCOUNT },
                ...(auth?.user?.email ? [row(PAGES.ACCOUNT, 'password', t('PASSWORD'), 'reset login security', t('SETTINGS_CHANGE_PASSWORD'))] : []),
                ...(auth?.user ? [
                    row(PAGES.ACCOUNT, 'export', t('SETTINGS_DATA_EXPORT'), 'download gdpr backup', t('SETTINGS_DATA_EXPORT_BUTTON')),
                    { terms: [`${t('SETTINGS_ACCOUNT_DELETION')} ${t('SETTINGS_DELETE_ACCOUNT')} delete remove close request`], label: t('SETTINGS_DELETE_ACCOUNT'), page: PAGES.ACCOUNT, row: 'deletion' },
                ] : []),
            ],
            [PAGES.SHORTCUTS]: shortcutGroups.flatMap(({ label, shortcuts }) => [
                { terms: [`${t(label)} keyboard`], label: t(label), page: PAGES.SHORTCUTS },
                ...shortcuts.map((shortcut) => row(PAGES.SHORTCUTS, shortcut.name, t(shortcut.label), SHORTCUT_KEYS[shortcut.name])),
            ]),
            [PAGES.HELP]: [
                { terms: [t('SETTINGS_GROUP_HELP')], label: t('SETTINGS_GROUP_HELP'), page: PAGES.HELP },
                { terms: [t('SETTINGS_SUPPORT')], label: t('SETTINGS_SUPPORT'), page: PAGES.HELP },
                { terms: [`${t('ABOUT_STREMIO')} version build`], label: t('ABOUT_STREMIO'), page: PAGES.HELP, row: 'vApp' },
                row(PAGES.HELP, 'vApp', t('SETTINGS_APP_VERSION')),
                row(PAGES.HELP, 'vBuild', t('SETTINGS_BUILD_VERSION')),
                ...(serverSettings?.serverVersion ? [row(PAGES.HELP, 'vServer', t('SETTINGS_SERVER_VERSION'))] : []),
                ...(typeof shell.state.version === 'string' ? [row(PAGES.HELP, 'vShell', t('SETTINGS_SHELL_VERSION'))] : []),
                row(PAGES.HELP, 'copyDetails', t('SETTINGS_COPY_DETAILS')),
                { terms: [t('SETTINGS_GROUP_LEGAL')], label: t('SETTINGS_GROUP_LEGAL'), page: PAGES.HELP },
                { terms: [t('TERMS_OF_SERVICE')], label: t('TERMS_OF_SERVICE'), page: PAGES.HELP },
                { terms: [t('PRIVACY_POLICY')], label: t('PRIVACY_POLICY'), page: PAGES.HELP },
                { terms: [t('SETTINGS_SOURCE_CODE')], label: t('SETTINGS_SOURCE_CODE'), page: PAGES.HELP },
            ],
        };

        return groups.flatMap((group) => group.pages.flatMap((page) => {
            const standalone = page.id === PAGES.HELP || page.id === PAGES.SHORTCUTS;
            const crumb = standalone || group.label === page.label ? page.label : `${group.label} › ${page.label}`;
            const pageCrumb = standalone ? t('SETTINGS_SEARCH_PAGE') : group.label;
            return [
                { terms: [page.label, PAGE_KEYS[page.id] ?? ''], label: page.label, page: page.id, crumb: pageCrumb },
                ...(byPage[page.id] ?? []).map((candidate) => ({ ...candidate, crumb })),
            ];
        }));
    }, [t, groups, platform, discord.available, profile, streamingServer, shortcutGroups, spotlightPicks]);

    return useMemo<SearchResult[]>(() => {
        const tokens = toWords(query);
        if (tokens.length === 0) return [];

        const matches = (text: string) => {
            const lower = text.toLowerCase();
            const words = toWords(text);
            return tokens.every((token) => CJK.test(token) ? lower.includes(token) : words.some((word) => word.startsWith(token)));
        };

        const seen = new Set<string>();
        return candidates.reduce<SearchResult[]>((results, { terms, label, crumb, page, row }) => {
            const id = `${label}|${crumb}`;
            if (!seen.has(id) && terms.some(matches)) {
                seen.add(id);
                results.push({ id, label, crumb, page, row });
            }
            return results;
        }, []);
    }, [query, candidates]);
};

export type { SearchResult };

export default useSettingsSearch;
