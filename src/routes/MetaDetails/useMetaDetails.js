const React = require('react');
const { useServices } = require('stremio/services');

const useMetaDetails = (urlParams) => {
    const { core } = useServices();
    const [metaDetails, setMetaDetails] = React.useState([
        { resourceRef: null, groups: [] },
        { resourceRef: null, groups: [] }
    ]);
    React.useEffect(() => {
        const onNewModel = () => {
            const state = core.getState();
            const [metaResourceRef, streamsResourceRef] = state.meta_details.selected;
            const metaGroups = state.meta_details.metas.map((metaGroup) => {
                if (metaGroup.content.type === 'Ready') {
                    metaGroup.content.content.released = new Date(metaGroup.content.content.released);
                    metaGroup.content.content.videos = metaGroup.content.content.videos.map((video) => {
                        video.released = new Date(video.released);
                        video.upcoming = !isNaN(video.released.getTime()) ?
                            video.released.getTime() > Date.now()
                            :
                            false;
                        video.href = `#/metadetails/${metaGroup.content.content.type}/${metaGroup.content.content.id}/${video.id}`;
                        // TODO add href, watched and progress
                        return video;
                    });
                }

                return metaGroup;
            });
            const streamsGroups = state.meta_details.streams;
            setMetaDetails([
                { resourceRef: metaResourceRef, groups: metaGroups },
                { resourceRef: streamsResourceRef, groups: streamsGroups }
            ]);
        };
        core.on('NewModel', onNewModel);
        core.dispatch({
            action: 'Load',
            args: {
                load: 'MetaDetails',
                args: {
                    id: urlParams.id,
                    type_name: urlParams.type,
                    video_id: urlParams.videoId
                }
            }
        });
        return () => {
            core.off('NewModel', onNewModel);
        };
    }, [urlParams]);
    return metaDetails;
};

module.exports = useMetaDetails;
