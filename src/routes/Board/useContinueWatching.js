const { useModelState } = require('stremio/common');

const initContinueWatchingState = () => ({
    lib_items: []
});

const mapContinueWatchingState = (continue_watching) => {
    const lib_items = continue_watching.lib_items.map((lib_item) => ({
        id: lib_item._id,
        type: lib_item.type,
        name: lib_item.name,
        poster: lib_item.poster,
        posterShape: lib_item.posterShape,
        progress: lib_item.state.timeOffset > 0 && lib_item.state.duration > 0 ?
            lib_item.state.timeOffset / lib_item.state.duration
            :
            null,
        videoId: lib_item.state.video_id,
        href: `#/metadetails/${encodeURIComponent(lib_item.type)}/${encodeURIComponent(lib_item._id)}${lib_item.state.video_id !== null ? `/${encodeURIComponent(lib_item.state.video_id)}` : ''}`
    }));
    return { lib_items };
};

const useContinueWatching = () => {
    return useModelState({
        model: 'continue_watching',
        map: mapContinueWatchingState,
        init: initContinueWatchingState,
        timeout: 5000
    });
};

module.exports = useContinueWatching;
