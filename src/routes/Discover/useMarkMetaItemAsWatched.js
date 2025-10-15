// Copyright (C) 2025 Stremio

const { useCallback } = require('react');
const { useServices } = require('stremio/services');

/**
 * Custom hook to handle marking a meta item as watched/unwatched in Discover
 * @param {object} metaItem - The meta item object
 * @returns {function} onMarkedAsWatched handler
 */
function useMarkMetaItemAsWatched(metaItem) {
    const { core } = useServices();
    return useCallback((watched) => {
        if (!metaItem || typeof metaItem.id !== 'string') return;
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'LibraryItemMarkAsWatched',
                args: {
                    id: metaItem.id,
                    is_watched: watched
                }
            }
        });
    }, [metaItem, core]);
}

module.exports = useMarkMetaItemAsWatched;
