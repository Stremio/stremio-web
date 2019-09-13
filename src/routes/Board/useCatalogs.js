const React = require('react');

const useCatalogs = () => {
    const [catalogs, setCatalogs] = React.useState([]);
    React.useEffect(() => {
        const onNewState = () => {
            const state = window.stateContainer.getState();
            setCatalogs(state.catalogs.groups);
        };
        window.stateContainer.on('NewModel', onNewState);
        window.stateContainer.dispatch({
            action: 'Load',
            args: {
                load: 'CatalogGrouped',
                args: { extra: [] }
            }
        });
        return () => {
            window.stateContainer.off('NewModel', onNewState);
        };
    }, []);
    return catalogs;
};

module.exports = useCatalogs;
