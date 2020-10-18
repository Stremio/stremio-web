// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const map = (continue_watching_preview) => ({
    ...continue_watching_preview,
    library_items: continue_watching_preview.library_items.map((libItem) => ({
        id: libItem._id,
        type: libItem.type,
        name: libItem.name,
        poster: libItem.poster,
        posterShape: libItem.posterShape === 'landscape' ? 'square' : libItem.posterShape,
        progress: libItem.state.timeOffset > 0 && libItem.state.duration > 0 ?
            libItem.state.timeOffset / libItem.state.duration
            :
            null,
        deepLinks: libItem.deep_links
    })),
    deepLinks: continue_watching_preview.deep_links
});

const useContinueWatchingPreview = () => {
    const { core } = useServices();
    const init = React.useMemo(() => {
        return map(core.transport.getState('continue_watching_preview'));
    }, []);
    return useModelState({ model: 'continue_watching_preview', map, init });
};

module.exports = useContinueWatchingPreview;
