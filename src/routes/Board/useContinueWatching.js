const React = require('react');
const { useServices } = require('stremio/services');

const mapContinueWatchingState = (state) => {
    const lib_items = state.continue_watching.lib_items.map((lib_item) => {
        lib_item.href = `#/metadetails/${lib_item.type}/${lib_item._id}${lib_item.state.video_id !== null ? `/${lib_item.state.video_id}` : ''}`;
        return lib_item;
    });
    return { lib_items };
};

const useContinueWatching = () => {
    const { core } = useServices();
    const [continueWatching, setContinueWatching] = React.useState(() => {
        const state = core.getState();
        const continueWatching = mapContinueWatchingState(state);
        return continueWatching;
    });
    React.useLayoutEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            const continueWatching = mapContinueWatchingState(state);
            setContinueWatching(continueWatching);
        };
        core.on('NewModel', onNewState);
        return () => {
            core.off('NewModel', onNewState);
        };
    }, []);
    return continueWatching;
};

module.exports = useContinueWatching;
