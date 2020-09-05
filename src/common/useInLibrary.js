// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('stremio/common/useModelState');

const mapLibraryState = (ctx) => {
    return ctx.library;
};

const useInLibrary = (metaItem) => {
    const { core } = useServices();
    const initLibraryState = React.useCallback(() => {
        const ctx = core.transport.getState('ctx');
        return mapLibraryState(ctx);
    }, []);
    const library = useModelState({
        model: 'ctx',
        init: initLibraryState,
        map: mapLibraryState
    });
    const addToLibrary = React.useCallback((metaItem) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: metaItem
            }
        });
    }, []);
    const removeFromLibrary = React.useCallback((metaItem) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: metaItem.id
            }
        });
    }, []);
    const inLibrary = React.useMemo(() => {
        return metaItem !== null && metaItem.id in library && !library[metaItem.id].removed;
    }, [metaItem, library]);
    const toggleInLibrary = React.useMemo(() => {
        return metaItem !== null ?
            () => inLibrary ? removeFromLibrary(metaItem) : addToLibrary(metaItem)
            :
            null;
    }, [metaItem, inLibrary]);
    return [inLibrary, toggleInLibrary];
};

module.exports = useInLibrary;
