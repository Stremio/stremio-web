const React = require('react');
const { useModelState } = require('stremio/common');

const initPlayerState = () => ({
    selected: {
        transport_url: null,
        type_name: null,
        id: null,
        video_id: null,
        stream: null,
    },
    meta_resource: null,
    subtitles_resources: [],
    next_video: null
});

const mapPlayerStateWithCtx = (player, ctx) => {
    const selected = player.selected;
    const meta_resource = player.meta_resource;
    const subtitles_resources = player.subtitles_resources.map((subtitles_resource) => {
        if (subtitles_resource.content.type === 'Ready') {
            const origin = ctx.content.addons.reduce((origin, addon) => {
                if (addon.transportUrl === subtitles_resource.request.base) {
                    return typeof addon.manifest.name === 'string' && addon.manifest.name.length > 0 ?
                        addon.manifest.name
                        :
                        addon.manifest.id;
                }

                return origin;
            }, subtitles_resource.request.base);
            subtitles_resource.content.content = subtitles_resource.content.content.map((subtitles) => ({
                ...subtitles,
                origin
            }));
        }

        return subtitles_resource;
    }, []);
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
            const stream = JSON.parse(urlParams.stream);
            return {
                action: 'Load',
                args: {
                    load: 'Player',
                    args: {
                        transport_url: urlParams.transportUrl,
                        type_name: urlParams.type,
                        id: urlParams.id,
                        video_id: urlParams.videoId,
                        stream: stream
                    }
                }
            };
        } catch {
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
