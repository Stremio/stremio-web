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
            action: 'UserOp',
            args: {
                userOp: 'AddToLibrary',
                args: {
                    meta_item: metaItem,
                    now: new Date()
                }
            }
        });
    }, []);
    const removeFromLibrary = React.useCallback((id) => {
        core.dispatch({
            action: 'UserOp',
            args: {
                userOp: 'RemoveFromLibrary',
                args: {
                    id,
                    now: new Date()
                }
            }
        });
    }, []);
    const inLibrary = React.useMemo(() => {
        return typeof metaItem === 'object' && metaItem !== null ?
            libraryItems.ids.includes(metaItem.id)
            :
            false;
    }, [metaItem, libraryItems]);
    const toggleInLibrary = React.useMemo(() => {
        if (typeof metaItem !== 'object' || metaItem === null) {
            return null;
        }

        return () => {
            if (inLibrary) {
                removeFromLibrary(metaItem.id);
            } else {
                addToLibrary(metaItem);
            }
        };
    }, [metaItem, inLibrary]);
    return [inLibrary, toggleInLibrary];
};

module.exports = useInLibrary;
