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
            const { meta_resource_ref = null, streams_resource_ref = null } = state.meta_details.selected !== null ?
                state.meta_details.selected
                :
                {};
            const meta_groups = state.meta_details.meta_groups.map((meta_group) => {
                if (meta_group.content.type === 'Ready') {
                    meta_group.content.content.released = new Date(meta_group.content.content.released);
                    meta_group.content.content.videos = meta_group.content.content.videos.map((video) => {
                        video.released = new Date(video.released);
                        video.upcoming = !isNaN(video.released.getTime()) ?
                            video.released.getTime() > Date.now()
                            :
                            false;
                        video.href = `#/metadetails/${meta_group.content.content.type}/${meta_group.content.content.id}/${video.id}`;
                        // TODO add watched and progress
                        return video;
                    });
                }

                return meta_group;
            });
            const streams_groups = state.meta_details.streams_groups;
            setMetaDetails([
                { resourceRef: meta_resource_ref, groups: meta_groups },
                { resourceRef: streams_resource_ref, groups: streams_groups }
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
