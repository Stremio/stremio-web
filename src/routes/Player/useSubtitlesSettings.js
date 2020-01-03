const React = require('react');
const { useModelState } = require('stremio/common');
const { useServices } = require('stremio/services');

const mapSubtitlesSettings = (ctx) => ({
    size: ctx.content.settings.subtitles_size,
    text_color: ctx.content.settings.subtitles_text_color,
    background_color: ctx.content.settings.subtitles_background_color,
    outline_color: ctx.content.settings.subtitles_outline_color,
});

const useSubtitlesSettings = () => {
    const { core } = useServices();
    const initSubtitlesSettings = React.useCallback(() => {
        const ctx = core.getState('ctx');
        return mapSubtitlesSettings(ctx);
    }, []);
    return useModelState({
        model: 'ctx',
        map: mapSubtitlesSettings,
        init: initSubtitlesSettings
    });
};

module.exports = useSubtitlesSettings;
