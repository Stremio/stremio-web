const { useModelState } = require('stremio/common');

const initContinueWatchingPreviewState = () => ({
    lib_items: []
});

const mapContinueWatchingPreviewState = (continue_watching_preview) => {
    const lib_items = continue_watching_preview.lib_items.map((lib_item) => ({
        id: lib_item._id,
        type: lib_item.type,
        name: lib_item.name,
        poster: lib_item.poster,
        posterShape: lib_item.posterShape,
        videoId: lib_item.state.video_id,
        progress: lib_item.state.timeOffset > 0 && lib_item.state.duration > 0 ?
            lib_item.state.timeOffset / lib_item.state.duration
            :
            null,
        href: `#/metadetails/${encodeURIComponent(lib_item.type)}/${encodeURIComponent(lib_item._id)}${lib_item.state.video_id !== null ? `/${encodeURIComponent(lib_item.state.video_id)}` : ''}`
    }));
    return { lib_items };
};

const useContinueWatchingPreview = () => {
    return useModelState({
        model: 'continue_watching_preview',
        map: mapContinueWatchingPreviewState,
        init: initContinueWatchingPreviewState
    });
};

module.exports = useContinueWatchingPreview;
