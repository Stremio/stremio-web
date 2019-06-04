const React = require('react');

const useCatalogs = () => {
    const [catalogs, setCatalogs] = React.useState([]);
    React.useEffect(() => {
        const onNewState = () => {
            const state = window.stateContainer.getState();
            const catalogs = state.groups.reduce((catalogs, [request, response], index) => {
                if (response.type === 'Ready') {
                    catalogs.push({
                        id: `${index}${request.transport_url}`,
                        items: response.content.map((item) => {
                            return {
                                ...item,
                                posterShape: item.posterShape || 'poster'
                            };
                        })
                    });
                }

                return catalogs;
            }, []);
            setCatalogs(catalogs);
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
