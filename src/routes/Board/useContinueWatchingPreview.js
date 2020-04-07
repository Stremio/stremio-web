const React = require('react');
const { useServices } = require('stremio/services');
const { deepLinking, useModelState } = require('stremio/common');

const mapContinueWatchingPreviewState = (continue_watching_preview) => {
    const lib_items = continue_watching_preview.lib_items.map((libItem) => ({
        id: libItem._id,
        type: libItem.type,
        name: libItem.name,
        poster: libItem.poster,
        posterShape: libItem.posterShape === 'landscape' ? 'square' : libItem.posterShape,
        progress: libItem.state.timeOffset > 0 && libItem.state.duration > 0 ?
            libItem.state.timeOffset / libItem.state.duration
            :
            null,
        deepLinks: deepLinking.withLibItem({ libItem })
    }));
    const deepLinks = { discover: '#/continuewatching' };
    return { lib_items, deepLinks };
};

const useContinueWatchingPreview = () => {
    const { core } = useServices();
    const initContinueWatchingPreviewState = React.useMemo(() => {
        return mapContinueWatchingPreviewState(core.getState('continue_watching_preview'));
    }, []);
    return useModelState({
        model: 'continue_watching_preview',
        map: mapContinueWatchingPreviewState,
        init: initContinueWatchingPreviewState
    });
};

module.exports = useContinueWatchingPreview;
