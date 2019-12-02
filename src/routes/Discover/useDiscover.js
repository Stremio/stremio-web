const React = require('react');
const { useServices } = require('stremio/services');

const mapDiscoverState = (state) => {
    const selectable = state.discover.selectable;
    const catalog_resource = state.discover.catalog_resource !== null && state.discover.catalog_resource.content.type === 'Ready' ?
        {
            ...state.discover.catalog_resource,
            content: {
                ...state.discover.catalog_resource.content,
                content: state.discover.catalog_resource.content.content.map((metaItem) => {
                    metaItem.released = new Date(metaItem.released);
                    return metaItem;
                })
            }
        }
        :
        state.discover.catalog_resource;
    return { selectable, catalog_resource };
};

const useDiscover = (urlParams, queryParams) => {
    const { core } = useServices();
    const [discover, setDiscover] = React.useState(() => ({
        selectable: {
            types: [],
            catalogs: [],
            extra: [],
            has_next_page: false,
            has_prev_page: false
        },
        catalog_resource: null
    }));
    React.useLayoutEffect(() => {
        const onNewModel = () => {
            const state = core.getState();
            if (state.discover.catalog_resource === null && state.discover.selectable.types.length > 0) {
                const load_request = state.discover.selectable.types[0].load_request;
                core.dispatch({
                    action: 'Load',
                    args: {
                        load: 'CatalogFiltered',
                        args: load_request
                    }
                }, 'Discover');
                return;
            }
            const discover = mapDiscoverState(state);
            setDiscover(discover);
        };
        core.on('NewModel', onNewModel);
        if (typeof urlParams.addonTransportUrl === 'string' && typeof urlParams.catalogId === 'string' && typeof urlParams.type === 'string') {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogFiltered',
                    args: {
                        base: urlParams.addonTransportUrl,
                        path: {
                            resource: 'catalog',
                            type_name: urlParams.type,
                            id: urlParams.catalogId,
                            extra: Array.from(queryParams.entries())
                        }
                    }
                }
            }, 'Discover');
        } else {
            const state = core.getState();
            if (state.discover.selectable.types.length > 0) {
                const load_request = state.discover.selectable.types[0].load_request;
                core.dispatch({
                    action: 'Load',
                    args: {
                        load: 'CatalogFiltered',
                        args: load_request
                    }
                }, 'Discover');
            }
        }
        return () => {
            core.off('NewModel', onNewModel);
        };
    }, [urlParams, queryParams]);
    return discover;
};

module.exports = useDiscover;
