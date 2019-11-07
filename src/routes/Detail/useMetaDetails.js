const React = require('react');
const { useServices } = require('stremio/services');

const useMetaDetails = (urlParams) => {
    const { core } = useServices();
    const [metaDetails, setMetaDetails] = React.useState([null, []]);
    React.useEffect(() => {
        const onNewModel = () => {
            const state = core.getState();
            let selectedMeta = state.meta_details.metas.find((meta) => meta.content.type === 'Ready');
            if (!selectedMeta) {
                if (state.meta_details.metas.every((meta) => meta.content.type === 'Err')) {
                    selectedMeta = {
                        content: {
                            type: 'Ready',
                            content: {}
                        }
                    };
                } else {
                    selectedMeta = null;
                }
            } else {
                selectedMeta.content.content.released = new Date(selectedMeta.content.content.released);
                selectedMeta.content.content.videos = selectedMeta.content.content.videos.map((video) => ({
                    ...video,
                    released: new Date(video.released)
                }));
            }

            setMetaDetails([selectedMeta, state.meta_details.streams]);
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
