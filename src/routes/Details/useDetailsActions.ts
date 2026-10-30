// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback } from 'react';
import { useCore } from 'stremio/core';

const useDetailsActions = (metaItem: MetaItemMetaDetails | null, libraryItem: LibraryItem | null) => {
    const core = useCore();

    const toggleLibrary = useCallback(() => {
        if (metaItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: metaItem.inLibrary ?
                { action: 'RemoveFromLibrary', args: metaItem.id }
                :
                { action: 'AddToLibrary', args: metaItem },
        });
    }, [core, metaItem]);

    const toggleWatched = useCallback(() => {
        if (metaItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'MarkAsWatched',
                args: !metaItem.watched,
            },
        });
    }, [core, metaItem]);

    const toggleNotifications = useCallback(() => {
        if (libraryItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'ToggleLibraryItemNotifications',
                args: [libraryItem._id, !libraryItem.state.noNotif],
            },
        });
    }, [core, libraryItem]);

    const markVideoWatched = useCallback((video: Pick<Video, 'id' | 'released'>, watched: boolean) => {
        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'MarkVideoAsWatched',
                args: [{ id: video.id, released: video.released }, watched],
            },
        });
    }, [core]);

    const markSeasonWatched = useCallback((season: number, watched: boolean) => {
        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'MarkSeasonAsWatched',
                args: [season, watched],
            },
        });
    }, [core]);

    return { toggleLibrary, toggleWatched, toggleNotifications, markVideoWatched, markSeasonWatched };
};

export default useDetailsActions;
