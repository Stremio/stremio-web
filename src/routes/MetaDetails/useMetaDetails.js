// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const map = (metaDetails) => ({
    ...metaDetails,
    metaItem: metaDetails.metaItem !== null && metaDetails.metaItem.content.type === 'Ready' ?
        {
            ...metaDetails.metaItem,
            content: {
                ...metaDetails.metaItem.content,
                content: {
                    ...metaDetails.metaItem.content.content,
                    released: new Date(
                        typeof metaDetails.metaItem.content.content.released === 'string' ?
                            metaDetails.metaItem.content.content.released
                            :
                            NaN
                    ),
                    videos: metaDetails.metaItem.content.content.videos.map((video) => ({
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
        }
        :
        metaDetails.metaItem
});

const useMetaDetails = (urlParams) => {
    const action = React.useMemo(() => {
        if (typeof urlParams.type === 'string' && typeof urlParams.id === 'string') {
            return {
                action: 'Load',
                args: {
                    model: 'MetaDetails',
                    args: {
                        metaPath: {
                            resource: 'meta',
                            type: urlParams.type,
                            id: urlParams.id,
                            extra: []
                        },
                        streamPath: typeof urlParams.videoId === 'string' ?
                            {
                                resource: 'stream',
                                type: urlParams.type,
                                id: urlParams.videoId,
                                extra: []
                            }
                            :
                            null,
                        guessStream: true,
                    }
                }
            };
        } else {
            return {
                action: 'Unload'
            };
        }
    }, [urlParams]);
    return useModelState({ model: 'meta_details', action, map });
};

module.exports = useMetaDetails;
