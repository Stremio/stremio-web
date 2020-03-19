const React = require('react');
const pako = require('pako');
const { useModelState } = require('stremio/common');

const initPlayerState = () => ({
    selected: null,
    meta_resource: null,
    subtitles_resources: [],
    next_video: null
});

const mapPlayerStateWithCtx = (player, ctx) => {
    const selected = player.selected !== null ?
        {
            stream: {
                ...player.selected.stream,
                subtitles: Array.isArray(player.selected.stream.subtitles) ?
                    player.selected.stream.subtitles.map(({ url, lang }) => ({
                        url,
                        lang,
                        origin: 'Stream'
                    }))
                    :
                    []
            },
            meta_resource_request: player.selected.meta_resource_request,
            subtitles_resource_ref: player.selected.subtitles_resource_ref,
            video_id: player.selected.video_id
        }
        :
        null;
    const meta_resource = player.meta_resource;
    const subtitles_resources = player.subtitles_resources.map((subtitles_resource) => {
        const request = subtitles_resource.request;
        const origin = ctx.profile.addons.reduce((origin, addon) => {
            if (addon.transportUrl === subtitles_resource.request.base) {
                return typeof addon.manifest.name === 'string' && addon.manifest.name.length > 0 ?
                    addon.manifest.name
                    :
                    addon.manifest.id;
            }

            return origin;
        }, subtitles_resource.request.base);
        const content = subtitles_resource.content.type === 'Ready' ?
            {
                type: 'Ready',
                content: subtitles_resource.content.content.map(({ url, lang }) => ({
                    url,
                    lang,
                    origin
                }))
            }
            :
            subtitles_resource.content;
        return {
            request,
            origin,
            content
        };
    });
    const next_video = player.next_video;
    return {
        selected,
        meta_resource,
        subtitles_resources,
        next_video
    };
};

const usePlayer = (urlParams) => {
    const loadPlayerAction = React.useMemo(() => {
        try {
            return {
                action: 'Load',
                args: {
                    model: 'Player',
                    args: {
                        stream: JSON.parse(pako.inflate(atob(urlParams.stream), { to: 'string' })),
                        meta_resource_request: typeof urlParams.transportUrl === 'string' && typeof urlParams.type === 'string' && typeof urlParams.id === 'string' ?
                            {
                                base: urlParams.transportUrl,
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
                        video_id: urlParams.videoId
                    }
                }
            };
        } catch (e) {
            return {
                action: 'Unload'
            };
        }
    }, [urlParams]);
    return useModelState({
        model: 'player',
        action: loadPlayerAction,
        init: initPlayerState,
        mapWithCtx: mapPlayerStateWithCtx
    });
};

module.exports = usePlayer;
