// Copyright (C) 2017-2020 Smart code 203358507

const { useServices } = require('stremio/services');
const { CONSTANTS, languageNames, useDeepEqualMemo } = require('stremio/common');

const useProfileSettingsInputs = (profile) => {
    const { core } = useServices();
    const interfaceLanguageSelect = useDeepEqualMemo(() => ({
        options: Object.keys(languageNames).map((code) => ({
            value: code,
            label: languageNames[code]
        })),
        selected: [profile.settings.interface_language],
        renderLabelText: () => {
            return typeof languageNames[profile.settings.interface_language] === 'string' ?
                languageNames[profile.settings.interface_language]
                :
                profile.settings.interface_language;
        },
        onSelect: (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        interface_language: event.value
                    }
                }
            });
        }
    }), [profile.settings]);
    const subtitlesLanguageSelect = useDeepEqualMemo(() => ({
        options: Object.keys(languageNames).map((code) => ({
            value: code,
            label: languageNames[code]
        })),
        selected: [profile.settings.subtitles_language],
        renderLabelText: () => {
            return typeof languageNames[profile.settings.subtitles_language] === 'string' ?
                languageNames[profile.settings.subtitles_language]
                :
                profile.settings.subtitles_language;
        },
        onSelect: (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitles_language: event.value
                    }
                }
            });
        }
    }), [profile.settings]);
    const subtitlesSizeSelect = useDeepEqualMemo(() => ({
        options: CONSTANTS.SUBTITLES_SIZES.map((size) => ({
            value: `${size}`,
            label: `${size}%`
        })),
        selected: [`${profile.settings.subtitles_size}`],
        renderLabelText: () => {
            return `${profile.settings.subtitles_size}%`;
        },
        onSelect: (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitles_size: parseInt(event.value)
                    }
                }
            });
        }
    }), [profile.settings]);
    const subtitlesTextColorInput = useDeepEqualMemo(() => ({
        value: profile.settings.subtitles_text_color,
        onChange: (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitles_text_color: event.value
                    }
                }
            });
        }
    }), [profile.settings]);
    const subtitlesBackgroundColorInput = useDeepEqualMemo(() => ({
        value: profile.settings.subtitles_background_color,
        onChange: (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitles_background_color: event.value
                    }
                }
            });
        }
    }), [profile.settings]);
    const subtitlesOutlineColorInput = useDeepEqualMemo(() => ({
        value: profile.settings.subtitles_outline_color,
        onChange: (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        subtitles_outline_color: event.value
                    }
                }
            });
        }
    }), [profile.settings]);
    const bingeWatchingCheckbox = useDeepEqualMemo(() => ({
        checked: profile.settings.binge_watching,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        binge_watching: !profile.settings.binge_watching
                    }
                }
            });
        }
    }), [profile.settings]);
    const playInBackgroundCheckbox = useDeepEqualMemo(() => ({
        checked: profile.settings.play_in_background,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        play_in_background: !profile.settings.play_in_background
                    }
                }
            });
        }
    }), [profile.settings]);
    const playInExternalPlayerCheckbox = useDeepEqualMemo(() => ({
        checked: profile.settings.play_in_external_player,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        play_in_external_player: !profile.settings.play_in_external_player
                    }
                }
            });
        }
    }), [profile.settings]);
    const hardwareDecodingCheckbox = useDeepEqualMemo(() => ({
        checked: profile.settings.hardware_decoding,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        hardware_decoding: !profile.settings.hardware_decoding
                    }
                }
            });
        }
    }), [profile.settings]);
    const streamingServerUrlInput = useDeepEqualMemo(() => ({
        value: profile.settings.streaming_server_url,
        onChange: (value) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        streaming_server_url: value
                    }
                }
            });
        }
    }), [profile.settings]);
    return {
        interfaceLanguageSelect,
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        bingeWatchingCheckbox,
        playInBackgroundCheckbox,
        playInExternalPlayerCheckbox,
        hardwareDecodingCheckbox,
        streamingServerUrlInput
    };
};

module.exports = useProfileSettingsInputs;
