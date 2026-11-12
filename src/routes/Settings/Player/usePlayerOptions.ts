import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import { CONSTANTS, languages, languageNames, useLanguageSorting, usePlatform, useSettings } from 'stremio/common';

const LANGUAGES_NAMES: Record<string, string> = languageNames;
const SUBTITLES_OFFSETS = Array.from({ length: 21 }, (_, i) => i * 5);

const getLanguageOptionValue = (language: string | null) => {
    const code = languages.toCode(language ?? '');
    return Object.keys(LANGUAGES_NAMES).find((value) => languages.toCode(value) === code) ?? language;
};

const usePlayerOptions = (profile: Profile) => {
    const { t } = useTranslation();
    const core = useCore();
    const platform = usePlatform();
    const [, updateSettings] = useSettings();

    const languageOptions = useMemo(() => Object.keys(LANGUAGES_NAMES).map((code) => ({
        value: code,
        label: LANGUAGES_NAMES[code]
    })), []);

    const { sortedOptions: sortedLanguageOptions } = useLanguageSorting(languageOptions);

    const subtitlesLanguageSelect = useMemo(() => ({
        options: [
            { value: null, label: t('NONE') },
            ...sortedLanguageOptions
        ],
        value: getLanguageOptionValue(profile.settings.subtitlesLanguage),
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitlesLanguage: value
                    }
                }
            });
        }
    }), [profile.settings, sortedLanguageOptions]);

    const subtitlesSizeSelect = useMemo(() => ({
        options: CONSTANTS.SUBTITLES_SIZES.map((size) => ({
            value: `${size}`,
            label: `${size}%`
        })),
        value: `${profile.settings.subtitlesSize}`,
        title: () => {
            return `${profile.settings.subtitlesSize}%`;
        },
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitlesSize: parseInt(value, 10)
                    }
                }
            });
        }
    }), [profile.settings]);

    const subtitlesOffsetSelect = useMemo(() => ({
        options: SUBTITLES_OFFSETS.map((offset) => ({
            value: `${offset}`,
            label: `${offset}%`
        })),
        value: `${profile.settings.subtitlesOffset}`,
        title: () => {
            return `${profile.settings.subtitlesOffset}%`;
        },
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitlesOffset: parseInt(value, 10)
                    }
                }
            });
        }
    }), [profile.settings]);

    const subtitlesTextColorInput = useMemo(() => ({
        value: profile.settings.subtitlesTextColor,
        onChange: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitlesTextColor: value
                    }
                }
            });
        }
    }), [profile.settings]);

    const subtitlesBackgroundColorInput = useMemo(() => ({
        value: profile.settings.subtitlesBackgroundColor,
        onChange: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitlesBackgroundColor: value
                    }
                }
            });
        }
    }), [profile.settings]);

    const assSubtitlesStylingToggle = useMemo(() => ({
        checked: profile.settings.assSubtitlesStyling,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        assSubtitlesStyling: !profile.settings.assSubtitlesStyling
                    }
                }
            });
        }
    }), [profile.settings]);

    const subtitlesOutlineColorInput = useMemo(() => ({
        value: profile.settings.subtitlesOutlineColor,
        onChange: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitlesOutlineColor: value
                    }
                }
            });
        }
    }), [profile.settings]);

    const audioLanguageSelect = useMemo(() => ({
        options: sortedLanguageOptions,
        value: profile.settings.audioLanguage,
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        audioLanguage: value
                    }
                }
            });
        }
    }), [profile.settings, sortedLanguageOptions]);

    const seekTimeDurationSelect = useMemo(() => ({
        options: CONSTANTS.SEEK_TIME_DURATIONS.map((size) => ({
            value: `${size}`,
            label: `${size / 1000} ${t('SECONDS')}`
        })),
        value: `${profile.settings.seekTimeDuration}`,
        title: () => {
            return `${profile.settings.seekTimeDuration / 1000} ${t('SECONDS')}`;
        },
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        seekTimeDuration: parseInt(value, 10)
                    }
                }
            });
        }
    }), [profile.settings]);

    const seekShortTimeDurationSelect = useMemo(() => ({
        options: CONSTANTS.SEEK_TIME_DURATIONS.map((size) => ({
            value: `${size}`,
            label: `${size / 1000} ${t('SECONDS')}`
        })),
        value: `${profile.settings.seekShortTimeDuration}`,
        title: () => {
            return `${profile.settings.seekShortTimeDuration / 1000} ${t('SECONDS')}`;
        },
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        seekShortTimeDuration: parseInt(value, 10)
                    }
                }
            });
        }
    }), [profile.settings]);

    const playInExternalPlayerSelect = useMemo(() => ({
        options: CONSTANTS.EXTERNAL_PLAYERS
            .filter(({ platforms }) => platforms.includes(platform.name))
            .map(({ label, value }) => ({
                value,
                label: t(label),
            })),
        value: profile.settings.playerType,
        title: () => {
            const selectedOption = CONSTANTS.EXTERNAL_PLAYERS.find(({ value }) => value === profile.settings.playerType);
            return selectedOption ? t(selectedOption.label, { defaultValue: selectedOption.label }) : profile.settings.playerType;
        },
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        playerType: value
                    }
                }
            });
        }
    }), [profile.settings]);

    const nextVideoPopupDurationSelect = useMemo(() => ({
        options: CONSTANTS.NEXT_VIDEO_POPUP_DURATIONS.map((duration) => ({
            value: `${duration}`,
            label: duration === 0 ? t('SETTINGS_DISABLED') : `${duration / 1000} ${t('SECONDS')}`
        })),
        value: `${profile.settings.nextVideoNotificationDuration}`,
        title: () => {
            return profile.settings.nextVideoNotificationDuration === 0 ?
                t('SETTINGS_DISABLED')
                :
                `${profile.settings.nextVideoNotificationDuration / 1000} ${t('SECONDS')}`;
        },
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        nextVideoNotificationDuration: parseInt(value, 10)
                    }
                }
            });
        }
    }), [profile.settings]);

    const bingeWatchingToggle = useMemo(() => ({
        checked: profile.settings.bingeWatching,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        bingeWatching: !profile.settings.bingeWatching
                    }
                }
            });
        }
    }), [profile.settings]);

    return {
        subtitlesLanguageFilterToggle: {
            checked: profile.settings.subtitlesLanguageFilterEnabled,
            onClick: () => updateSettings({ subtitlesLanguageFilterEnabled: !profile.settings.subtitlesLanguageFilterEnabled }),
        },
        secondarySubtitlesLanguageSelect: {
            options: [{ value: null, label: t('NONE') }, ...sortedLanguageOptions],
            value: getLanguageOptionValue(profile.settings.secondarySubtitlesLanguage),
            onSelect: (value: string | null) => updateSettings({ secondarySubtitlesLanguage: value }),
        },
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesOffsetSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        assSubtitlesStylingToggle,
        audioLanguageSelect,
        secondaryAudioLanguageSelect: {
            options: [{ value: null, label: t('NONE') }, ...sortedLanguageOptions],
            value: getLanguageOptionValue(profile.settings.secondaryAudioLanguage),
            onSelect: (value: string | null) => updateSettings({ secondaryAudioLanguage: value }),
        },
        seekTimeDurationSelect,
        seekShortTimeDurationSelect,
        playInExternalPlayerSelect,
        nextVideoPopupDurationSelect,
        bingeWatchingToggle,
    };
};

export default usePlayerOptions;
