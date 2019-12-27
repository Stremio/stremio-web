const React = require('react');
const { useModelState } = require('stremio/common');

const initPlayer = () => ({
    selected: null,
    meta_resource: null,
    subtitles_resources: [],
    next_video: null
});

const usePlayer = (urlParams) => {
    const loadPlayerAction = React.useMemo(() => {
        return {
            action: 'Load',
            args: {
                load: 'Player',
                args: {
                    transport_url: urlParams.transportUrl,
                    type_name: urlParams.type,
                    id: urlParams.id,
                    video_id: urlParams.videoId
                }
            }
        };
    }, [urlParams]);
    return useModelState({
        model: 'player',
        action: loadPlayerAction,
        init: initPlayer
    });
};

module.exports = usePlayer;
