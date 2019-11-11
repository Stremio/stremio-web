const React = require('react');
const { useServices } = require('stremio/services');

const useMetaDetails = (urlParams) => {
    const { core } = useServices();
    const [metaDetails, setMetaDetails] = React.useState([null, []]);
    React.useEffect(() => {
        const onNewModel = () => {
            const state = core.getState();
            const [metaRequest] = state.meta_details.selected;
            const readyMeta = state.meta_details.metas
                .filter((meta) => meta.content.type === 'Ready')
                .map((meta) => {
                    meta.content.content.released = new Date(meta.content.content.released);
                    meta.content.content.videos = meta.content.content.videos.map((video) => ({
                        ...video,
                        released: new Date(video.released)
                    }));
                    return meta;
                })
                .shift();
            if (metaRequest) {
                if (readyMeta) {
                    setMetaDetails([readyMeta, state.meta_details.streams]);
                } else if (state.meta_details.metas.length === 0) {
                    const errMeta = {
                        content: {
                            type: 'Err',
                            content: {
                                type: 'EmptyContent'
                            }
                        }
                    };
                    setMetaDetails([errMeta, state.meta_details.streams]);
                } else if (state.meta_details.metas.every((meta) => meta.content.type === 'Err')) {
                    setMetaDetails([state.meta_details.metas[0], state.meta_details.streams]);
                } else {
                    setMetaDetails([null, state.meta_details.streams]);
                }
            } else {
                setMetaDetails([null, state.meta_details.streams]);
            }
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
