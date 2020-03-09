const React = require('react');
const { useModelState } = require('stremio/common');

const initPlayerState = () => ({
    selected: null,
    meta_resource: null,
    subtitles_resources: [],
    next_video: null
});

const mapPlayerStateWithCtx = (player, ctx) => {
    const selected = player.selected;
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
                        stream: JSON.parse(urlParams.stream),
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
