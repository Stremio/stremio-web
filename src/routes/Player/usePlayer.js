// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const pako = require('pako');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    metaItem: null,
    subtitles: [],
    nextVideoDeepLinks: null,
    seriesInfo: null,
    libraryItem: null,
    title: null,
    addon: null,
});

const map = (player) => ({
    ...player,
    metaItem: player.metaItem !== null ?
        {
            ...player.metaItem,
            released: new Date(
                typeof player.metaItem.released === 'string' ?
                    player.metaItem.released
                    :
                    NaN
            ),
            videos: player.metaItem.videos.map((video) => ({
                ...video,
                released: new Date(
                    typeof video.released === 'string' ?
                        video.released
                        :
                        NaN
                ),
            }))
        }
        :
        null,
});

const usePlayer = (urlParams) => {
    const { core } = useServices();
    const action = React.useMemo(() => {
        try {
            return {
                action: 'Load',
                args: {
                    model: 'Player',
                    args: {
                        stream: JSON.parse(pako.inflate(atob(urlParams.stream), { to: 'string' })),
                        streamRequest: typeof urlParams.streamTransportUrl === 'string' && typeof urlParams.type === 'string' && typeof urlParams.videoId === 'string' ?
                            {
                                base: urlParams.streamTransportUrl,
                                path: {
                                    resource: 'stream',
                                    type: urlParams.type,
                                    id: urlParams.videoId,
                                    extra: []
                                }
                            }
                            :
                            null,
                        metaRequest: typeof urlParams.metaTransportUrl === 'string' && typeof urlParams.type === 'string' && typeof urlParams.id === 'string' ?
                            {
                                base: urlParams.metaTransportUrl,
                                path: {
                                    resource: 'meta',
                                    type: urlParams.type,
                                    id: urlParams.id,
                                    extra: []
                                }
                            }
                            :
                            null,
                        subtitlesPath: typeof urlParams.type === 'string' && typeof urlParams.videoId === 'string' ?
                            {
                                resource: 'subtitles',
                                type: urlParams.type,
                                id: urlParams.videoId,
                                extra: []
                            }
                            :
                            null
                    }
                }
            };
        } catch (e) {
            return {
                action: 'Unload'
            };
        }
    }, [urlParams]);
    const updateLibraryItemState = React.useCallback((time, duration) => {
        core.transport.dispatch({
            action: 'Player',
            args: {
                action: 'UpdateLibraryItemState',
                args: { time, duration }
            }
        }, 'player');
    }, []);
    const pushToLibrary = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Player',
            args: {
                action: 'PushToLibrary'
            }
        }, 'player');
    }, []);
    const player = useModelState({ model: 'player', action, init, map });
    return [player, updateLibraryItemState, pushToLibrary];
};

module.exports = usePlayer;
