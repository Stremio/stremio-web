const { useModelState } = require('stremio/common');

const initContinueWatchingState = () => ({
    lib_items: []
});

const mapContinueWatchingState = (continue_watching) => {
    const lib_items = continue_watching.lib_items.map((lib_item) => {
        lib_item.href = `#/metadetails/${lib_item.type}/${lib_item._id}${lib_item.state.video_id !== null ? `/${lib_item.state.video_id}` : ''}`;
        return lib_item;
    });
    return { lib_items };
};

const useContinueWatching = () => {
    return useModelState({
        model: 'continue_watching',
        action: null,
        timeout: 5000,
        map: mapContinueWatchingState,
        init: initContinueWatchingState
    });
};

module.exports = useContinueWatching;
