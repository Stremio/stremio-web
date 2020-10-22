// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const map = (continueWatchingPreview) => ({
    ...continueWatchingPreview,
    libraryItems: continueWatchingPreview.libraryItems.map((libItem) => ({
        id: libItem._id,
        type: libItem.type,
        name: libItem.name,
        poster: libItem.poster,
        posterShape: libItem.posterShape === 'landscape' ? 'square' : libItem.posterShape,
        progress: libItem.state.timeOffset > 0 && libItem.state.duration > 0 ?
            libItem.state.timeOffset / libItem.state.duration
            :
            null,
        playIcon: true,
        deepLinks: libItem.deepLinks
    }))
});

const useContinueWatchingPreview = () => {
    const { core } = useServices();
    const init = React.useMemo(() => {
        return map(core.transport.getState('continue_watching_preview'));
    }, []);
    return useModelState({ model: 'continue_watching_preview', map, init });
};

module.exports = useContinueWatchingPreview;
