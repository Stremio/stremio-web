const React = require('react');
const { useServices } = require('stremio/services');

const useMetaDetails = (urlParams) => {
    const { core } = useServices();
    const [metaDetails, setMetaDetails] = React.useState([null, []]);
    React.useEffect(() => {
        const onNewModel = () => {
            const state = core.getState();
            const selectedMeta = state.meta_details.metas.reduce((selectedMeta, meta) => {
                if (selectedMeta === null && meta.content.type === 'Ready') {
                    selectedMeta = {
                        ...meta,
                        content: {
                            ...meta.content,
                            content: {
                                ...meta.content.content,
                                released: new Date(meta.content.content.released),
                                videos: meta.content.content.videos.map((video) => ({
                                    ...video,
                                    released: new Date(video.released)
                                }))
                            }
                        }
                    };
                }

                return selectedMeta;
            }, null);
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
