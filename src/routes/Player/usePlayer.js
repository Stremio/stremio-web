// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const map = (player) => ({
    ...player,
    metaItem: player.metaItem !== null && player.metaItem.type === 'Ready' ?
        {
            ...player.metaItem,
            content: {
                ...player.metaItem.content,
                released: new Date(
                    typeof player.metaItem.content.released === 'string' ?
                        player.metaItem.content.released
                        :
                        NaN
                ),
                videos: player.metaItem.content.videos.map((video) => ({
                    ...video,
                    released: new Date(
                        typeof video.released === 'string' ?
                            video.released
                            :
                            NaN
                    ),
                }))
            }
        }
        :
        player.metaItem,
});

const usePlayer = (urlParams) => {
    const { core } = useServices();
    const action = React.useMemo(() => {
        const stream = core.transport.decodeStream(urlParams.stream);
        if (stream !== null) {
            return {
                action: 'Load',
                args: {
                    model: 'Player',
                    args: {
                        stream,
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
        } else {
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
    const player = useModelState({ model: 'player', action, map });
    return [player, updateLibraryItemState, pushToLibrary];
};

module.exports = usePlayer;
