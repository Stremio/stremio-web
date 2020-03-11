const React = require('react');
const { useModelState } = require('stremio/common');
const { useServices } = require('stremio/services');

const mapSubtitlesSettings = (ctx) => ({
    size: ctx.profile.settings.subtitles_size,
    text_color: ctx.profile.settings.subtitles_text_color,
    background_color: ctx.profile.settings.subtitles_background_color,
    outline_color: ctx.profile.settings.subtitles_outline_color,
    offset: ctx.profile.settings.subtitles_offset
});

const useSubtitlesSettings = () => {
    const { core } = useServices();
    const initSubtitlesSettings = React.useCallback(() => {
        const ctx = core.getState('ctx');
        return mapSubtitlesSettings(ctx);
    }, []);
    const subtitlesSettings = useModelState({
        model: 'ctx',
        map: mapSubtitlesSettings,
        init: initSubtitlesSettings
    });
    const updateSubtitlesSettings = React.useCallback((settings) => {
        const ctx = core.getState('ctx');
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...ctx.profile.settings,
                    ...settings
                }
            }
        });
    }, []);
    return [subtitlesSettings, updateSubtitlesSettings];
};

module.exports = useSubtitlesSettings;
