const React = require('react');
const { useModelState } = require('stremio/common');

const initMetaDetailsState = () => ({
    selected: {
        meta_resource_ref: null,
        streams_resource_ref: null,
    },
    meta_resources: [],
    streams_resources: []
});

const mapMetaDetailsState = (meta_details) => {
    const selected = meta_details.selected;
    const meta_resources = meta_details.meta_resources.map((meta_resource) => {
        if (meta_resource.content.type === 'Ready') {
            meta_resource.content.content.released = new Date(meta_resource.content.content.released);
            meta_resource.content.content.videos = meta_resource.content.content.videos.map((video) => {
                video.released = new Date(video.released);
                video.upcoming = !isNaN(video.released.getTime()) ?
                    video.released.getTime() > Date.now()
                    :
                    false;
                video.href = `#/metadetails/${meta_resource.content.content.type}/${meta_resource.content.content.id}/${video.id}`;
                // TODO add watched and progress
                return video;
            });
        }

        return meta_resource;
    });
    const streams_resources = meta_details.streams_resources;
    return { selected, meta_resources, streams_resources };
};

const useMetaDetails = (urlParams) => {
    const loadMetaDetailsAction = React.useMemo(() => {
        return {
            action: 'Load',
            args: {
                model: 'MetaDetails',
                args: {
                    meta_resource_ref: {
                        resource: 'meta',
                        type_name: urlParams.type,
                        id: urlParams.id,
                        extra: []
                    },
                    streams_resource_ref: typeof urlParams.videoId === 'string' ?
                        {
                            resource: 'stream',
                            type_name: urlParams.type,
                            id: urlParams.videoId,
                            extra: []
                        }
                        :
                        null
                }
            }
        };
    }, [urlParams]);
    return useModelState({
        model: 'meta_details',
        action: loadMetaDetailsAction,
        map: mapMetaDetailsState,
        init: initMetaDetailsState
    });
};

module.exports = useMetaDetails;
