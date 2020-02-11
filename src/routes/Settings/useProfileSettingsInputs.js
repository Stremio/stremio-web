const React = require('react');
const { useServices } = require('stremio/services');
const { useProfile } = require('stremio/common');
const languages = require('./languages');

const SUBTITLES_SIZES = [75, 100, 125, 150, 175, 200, 250];

const useProfileSettingsInputs = () => {
    const { core } = useServices();
    const profile = useProfile();
    const interfaceLanguageSelect = React.useMemo(() => ({
        options: Object.keys(languages).map((code) => ({
            value: code,
            label: languages[code]
        })),
        selected: [profile.settings.interface_language],
        renderLabelText: () => {
            return typeof languages[profile.settings.interface_language] === 'string' ?
                languages[profile.settings.interface_language]
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
        options: Object.keys(languages).map((code) => ({
            value: code,
            label: languages[code]
        })),
        selected: [profile.settings.subtitles_language],
        renderLabelText: () => {
            return typeof languages[profile.settings.subtitles_language] === 'string' ?
                languages[profile.settings.subtitles_language]
                :
                profile.settings.subtitles_language;
        },
        onSelect: (event) => {
            console.log(event);
        }
    }), [profile.settings.subtitles_language]);
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
            console.log(event);
        }
    }), [profile.settings.subtitles_size]);
    const subtitlesTextColorInput = React.useMemo(() => ({
        value: profile.settings.subtitles_text_color,
        onChange: (event) => {
            console.log(event);
        }
    }), [profile.settings.subtitles_text_color]);
    const subtitlesBackgroundColorInput = React.useMemo(() => ({
        value: profile.settings.subtitles_background_color,
        onChange: (event) => {
            console.log(event);
        }
    }), [profile.settings.subtitles_background_color]);
    const subtitlesOutlineColorInput = React.useMemo(() => ({
        value: profile.settings.subtitles_outline_color,
        onChange: (event) => {
            console.log(event);
        }
    }), [profile.settings.subtitles_outline_color]);
    const bingeWatchingCheckbox = React.useMemo(() => ({
        checked: profile.settings.binge_watching,
        onClick: (event) => {
            console.log(event);
        }
    }), [profile.settings.binge_watching]);
    const playInBackgroundCheckbox = React.useMemo(() => ({
        checked: profile.settings.play_in_background,
        onClick: (event) => {
            console.log(event);
        }
    }), [profile.settings.play_in_background]);
    const playInExternalPlayerCheckbox = React.useMemo(() => ({
        checked: profile.settings.play_in_external_player,
        onClick: (event) => {
            console.log(event);
        }
    }), [profile.settings.play_in_external_player]);
    return {
        interfaceLanguageSelect,
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        bingeWatchingCheckbox,
        playInBackgroundCheckbox,
        playInExternalPlayerCheckbox
    };
};

module.exports = useProfileSettingsInputs;
