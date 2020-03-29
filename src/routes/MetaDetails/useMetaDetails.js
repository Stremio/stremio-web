const React = require('react');
const { useModelState } = require('stremio/common');

const initMetaDetailsState = () => ({
    selected: null,
    meta_resources: [],
    streams_resources: []
});

const mapMetaDetailsState = (meta_details) => {
    const selected = meta_details.selected;
    const meta_resources = meta_details.meta_resources.map((meta_resource) => {
        return meta_resource.content.type === 'Ready' ?
            {
                request: meta_resource.request,
                content: {
                    type: 'Ready',
                    content: {
                        ...meta_resource.content.content,
                        released: new Date(
                            typeof meta_resource.content.content.released === 'string' ?
                                meta_resource.content.content.released
                                :
                                NaN
                        ),
                        videos: meta_resource.content.content.videos.map((video) => ({
                            ...video,
                            released: new Date(
                                typeof video.released === 'string' ?
                                    video.released
                                    :
                                    NaN
                            ),
                            // TODO add watched and progress
                            href: `#/metadetails/${meta_resource.content.content.type}/${meta_resource.content.content.id}/${video.id}`
                        }))
                    }
                }
            }
            :
            meta_resource;
    });
    const streams_resources = meta_details.streams_resources;
    return { selected, meta_resources, streams_resources };
};

const useMetaDetails = (urlParams) => {
    const loadMetaDetailsAction = React.useMemo(() => {
        if (typeof urlParams.type === 'string' && typeof urlParams.id === 'string') {
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
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [urlParams]);
    return useModelState({
        model: 'meta_details',
        action: loadMetaDetailsAction,
        map: mapMetaDetailsState,
        init: initMetaDetailsState
    });
};

module.exports = useMetaDetails;
