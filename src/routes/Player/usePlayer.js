const React = require('react');
const { useServices } = require('stremio/services');
const { deepLinking, useModelState } = require('stremio/common');

const initPlayerState = () => ({
    selected: null,
    meta_resource: null,
    subtitles_resources: [],
    next_video: null,
    lib_item: null
});

const mapPlayerStateWithCtx = (player, ctx) => {
    const selected = player.selected !== null ?
        {
            stream: {
                ...player.selected.stream,
                addon: ctx.profile.addons.reduce((result, addon) => {
                    if (player.selected.stream_resource_request !== null && addon.transportUrl === player.selected.stream_resource_request.base) {
                        return addon;
                    }

                    return result;
                }, null)
            },
            stream_resource_request: player.selected.stream_resource_request,
            meta_resource_request: player.selected.meta_resource_request,
            subtitles_resource_ref: player.selected.subtitles_resource_ref,
            video_id: player.selected.video_id
        }
        :
        null;
    const meta_resource = player.meta_resource !== null && player.meta_resource.content.type === 'Ready' ?
        {
            request: player.meta_resource.request,
            content: {
                type: 'Ready',
                content: {
                    ...player.meta_resource.content.content,
                    released: new Date(
                        typeof player.meta_resource.content.content.released === 'string' ?
                            player.meta_resource.content.content.released
                            :
                            NaN
                    ),
                    videos: player.meta_resource.content.content.videos.map((video) => ({
                        ...video,
                        released: new Date(
                            typeof video.released === 'string' ?
                                video.released
                                :
                                NaN
                        ),
                        // TODO add watched and progress
                        href: `#/metadetails/${player.meta_resource.content.content.type}/${player.meta_resource.content.content.id}/${video.id}`
                    }))
                }
            }
        }
        :
        player.meta_resource;
    const subtitles_resources = player.subtitles_resources.map((subtitles_resource) => {
        const request = subtitles_resource.request;
        const addon = ctx.profile.addons.reduce((result, addon) => {
            if (addon.transportUrl === subtitles_resource.request.base) {
                return addon;
            }

            return result;
        }, null);
        const content = subtitles_resource.content;
        return { request, addon, content };
    });
    const next_video = player.next_video;
    const lib_item = player.lib_item;
    return { selected, meta_resource, subtitles_resources, next_video, lib_item };
};

const usePlayer = (urlParams) => {
    const { core } = useServices();
    const loadPlayerAction = React.useMemo(() => {
        try {
            return {
                action: 'Load',
                args: {
                    model: 'Player',
                    args: {
                        stream: deepLinking.deserializeStream(urlParams.stream),
                        stream_resource_request: typeof urlParams.streamTransportUrl === 'string' && typeof urlParams.type === 'string' && typeof urlParams.videoId === 'string' ?
                            {
                                base: urlParams.streamTransportUrl,
                                path: {
                                    resource: 'stream',
                                    type_name: urlParams.type,
                                    id: urlParams.videoId,
                                    extra: []
                                }
                            }
                            :
                            null,
                        meta_resource_request: typeof urlParams.metaTransportUrl === 'string' && typeof urlParams.type === 'string' && typeof urlParams.id === 'string' ?
                            {
                                base: urlParams.metaTransportUrl,
                                path: {
                                    resource: 'meta',
                                    type_name: urlParams.type,
                                    id: urlParams.id,
                                    extra: []
                                }
                            }
                            :
                            null,
                        subtitles_resource_ref: typeof urlParams.type === 'string' && typeof urlParams.videoId === 'string' ?
                            {
                                resource: 'subtitles',
                                type_name: urlParams.type,
                                id: urlParams.videoId,
                                extra: []
                            }
                            :
                            null,
                        video_id: typeof urlParams.videoId === 'string' ?
                            urlParams.videoId
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
        core.dispatch({
            action: 'Player',
            args: {
                action: 'UpdateLibraryItemState',
                args: { time, duration }
            }
        }, 'player');
    }, []);
    const pushToLibrary = React.useCallback(() => {
        core.dispatch({
            action: 'Player',
            args: {
                action: 'PushToLibrary'
            }
        }, 'player');
    }, []);
    const player = useModelState({
        model: 'player',
        action: loadPlayerAction,
        init: initPlayerState,
        mapWithCtx: mapPlayerStateWithCtx
    });
    return [player, updateLibraryItemState, pushToLibrary];
};

module.exports = usePlayer;
