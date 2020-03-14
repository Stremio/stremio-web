const React = require('react');
const { useServices } = require('stremio/services');
const { languageNames } = require('stremio/common');

const SUBTITLES_SIZES = [75, 100, 125, 150, 175, 200, 250];

const useProfileSettingsInputs = (profile) => {
    const { core } = useServices();
    const interfaceLanguageSelect = React.useMemo(() => ({
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
            core.dispatch({
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
    const subtitlesLanguageSelect = React.useMemo(() => ({
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
            core.dispatch({
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
    const subtitlesSizeSelect = React.useMemo(() => ({
        options: SUBTITLES_SIZES.map((size) => ({
            value: `${size}`,
            label: `${size}%`
        })),
        selected: [`${profile.settings.subtitles_size}`],
        renderLabelText: () => {
            return `${profile.settings.subtitles_size}%`;
        },
        onSelect: (event) => {
            core.dispatch({
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
    const subtitlesTextColorInput = React.useMemo(() => ({
        value: profile.settings.subtitles_text_color,
        onChange: (event) => {
            core.dispatch({
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
    const subtitlesBackgroundColorInput = React.useMemo(() => ({
        value: profile.settings.subtitles_background_color,
        onChange: (event) => {
            core.dispatch({
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
    const subtitlesOutlineColorInput = React.useMemo(() => ({
        value: profile.settings.subtitles_outline_color,
        onChange: (event) => {
            core.dispatch({
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
    const bingeWatchingCheckbox = React.useMemo(() => ({
        checked: profile.settings.binge_watching,
        onClick: () => {
            core.dispatch({
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
    const playInBackgroundCheckbox = React.useMemo(() => ({
        checked: profile.settings.play_in_background,
        onClick: () => {
            core.dispatch({
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
    const playInExternalPlayerCheckbox = React.useMemo(() => ({
        checked: profile.settings.play_in_external_player,
        onClick: () => {
            core.dispatch({
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
    const hardwareDecodingCheckbox = React.useMemo(() => ({
        checked: profile.settings.hardware_decoding,
        onClick: () => {
            core.dispatch({
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
        hardwareDecodingCheckbox
    };
};

module.exports = useProfileSettingsInputs;
