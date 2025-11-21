import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useServices } from 'stremio/services';
import { CONSTANTS, languageNames, usePlatform, useLanguageSorting } from 'stremio/common';

const LANGUAGES_NAMES: Record<string, string> = languageNames;

const usePlayerOptions = (profile: Profile) => {
    const { t } = useTranslation();
    const { core } = useServices();
    const platform = usePlatform();

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
        value: profile.settings.subtitlesLanguage,
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

    const surroundSoundToggle = useMemo(() => ({
        checked: profile.settings.surroundSound,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        surroundSound: !profile.settings.surroundSound
                    }
                }
            });
        }
    }), [profile.settings]);

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
            label: duration === 0 ? 'Disabled' : `${duration / 1000} ${t('SECONDS')}`
        })),
        value: `${profile.settings.nextVideoNotificationDuration}`,
        title: () => {
            return profile.settings.nextVideoNotificationDuration === 0 ?
                'Disabled'
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

    const playInBackgroundToggle = useMemo(() => ({
        checked: profile.settings.playInBackground,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        playInBackground: !profile.settings.playInBackground
                    }
                }
            });
        }
    }), [profile.settings]);

    const hardwareDecodingToggle = useMemo(() => ({
        checked: profile.settings.hardwareDecoding,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        hardwareDecoding: !profile.settings.hardwareDecoding
                    }
                }
            });
        }
    }), [profile.settings]);

    const videoModeSelect = useMemo(() => ({
        options: [
            {
                value: null,
                label: t('SETTINGS_VIDEO_MODE_DEFAULT'),
            },
            {
                value: 'legacy',
                label: t('SETTINGS_VIDEO_MODE_LEGACY'),
            }
        ],
        value: profile.settings.videoMode,
        title: () => {
            return profile.settings.videoMode === 'legacy' ?
                t('SETTINGS_VIDEO_MODE_LEGACY')
                :
                t('SETTINGS_VIDEO_MODE_DEFAULT');
        },
        onSelect: (value: string | null) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        videoMode: value,
                    }
                }
            });
        }
    }), [profile.settings]);

    const pauseOnMinimizeToggle = useMemo(() => ({
        checked: profile.settings.pauseOnMinimize,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        pauseOnMinimize: !profile.settings.pauseOnMinimize,
                    }
                }
            });
        }
    }), [profile.settings]);

    return {
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
    };
};

export default usePlayerOptions;
