const React = require('react');
const { deepLinking, useModelState } = require('stremio/common');

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
                            deepLinks: deepLinking.withVideo({
                                video,
                                metaTransportUrl: meta_resource.request.base,
                                metaItem: meta_resource.content.content
                            })
                        }))
                    }
                }
            }
            :
            meta_resource;
    });
    const streams_resources = meta_details.streams_resources.map((stream_resource) => {
        return stream_resource.content.type === 'Ready' ?
            {
                request: stream_resource.request,
                content: {
                    type: 'Ready',
                    content: stream_resource.content.content.map((stream) => ({
                        ...stream,
                        // TODO map progress
                        deepLinks: deepLinking.withStream({
                            stream,
                            streamTransportUrl: stream_resource.request.base,
                            // TODO metaTransportUrl should be based on state
                            metaTransportUrl: meta_details.meta_resources.reduceRight((result, meta_resource) => {
                                if (meta_resource.content.type === 'Ready') {
                                    return meta_resource.request.base;
                                }

                                return result;
                            }, ''),
                            type: selected.meta_resource_ref.type_name,
                            id: selected.meta_resource_ref.id,
                            videoId: selected.streams_resource_ref.id,
                        })
                    }))
                }
            }
            :
            stream_resource;
    });
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
