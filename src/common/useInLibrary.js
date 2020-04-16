// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('stremio/common/useModelState');

const useInLibrary = (metaItem) => {
    const { core } = useServices();
    const initLibraryItemsState = React.useCallback(() => {
        return core.getState('library_items');
    }, []);
    const libraryItems = useModelState({
        model: 'library_items',
        init: initLibraryItemsState
    });
    const addToLibrary = React.useCallback((metaItem) => {
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: metaItem
            }
        });
    }, []);
    const removeFromLibrary = React.useCallback((metaItem) => {
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: metaItem.id
            }
        });
    }, []);
    const inLibrary = React.useMemo(() => {
        return libraryItems.ids.includes(metaItem !== null ? metaItem.id : null);
    }, [metaItem, libraryItems]);
    const toggleInLibrary = React.useMemo(() => {
        return metaItem !== null ?
            () => inLibrary ? removeFromLibrary(metaItem) : addToLibrary(metaItem)
            :
            null;
    }, [metaItem, inLibrary]);
    return [inLibrary, toggleInLibrary];
};

module.exports = useInLibrary;
