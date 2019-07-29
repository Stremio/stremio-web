const React = require('react');

const useCatalogs = () => {
    const [catalogs, setCatalogs] = React.useState([]);
    React.useEffect(() => {
        const onNewState = () => {
            const state = window.stateContainer.getState();
            setCatalogs(state.groups);
        };
        window.stateContainer.on('NewState', onNewState);
        window.stateContainer.dispatch({
            action: 'Load',
            args: {
                load: 'CatalogGrouped',
                args: { extra: [] }
            }
        });
        return () => {
            window.stateContainer.off('NewState', onNewState);
        };
    }, []);
    return catalogs;
};

module.exports = useCatalogs;
