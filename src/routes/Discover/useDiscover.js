const React = require('react');
const { useServices } = require('stremio/services');

const DEFAULT_ADDON_TRANSPORT_URL = 'https://v3-cinemeta.strem.io/manifest.json';
const DEFAULT_CATALOG_ID = 'top';
const DEFAULT_TYPE = 'movie';

const useCatalog = (urlParams, queryParams) => {
    const { core } = useServices();
    const [discover, setDiscover] = React.useState([[], null, null]);
    React.useEffect(() => {
        const addonTransportUrl = typeof urlParams.addonTransportUrl === 'string' ? urlParams.addonTransportUrl : DEFAULT_ADDON_TRANSPORT_URL;
        const catalogId = typeof urlParams.catalogId === 'string' ? urlParams.catalogId : DEFAULT_CATALOG_ID;
        const type = typeof urlParams.type === 'string' ? urlParams.type : DEFAULT_TYPE;
        const onNewModel = () => {
            const state = core.getState();
            const onSelect = (event) => {
                const load = JSON.parse(event.value);
                const addonTransportUrl = encodeURIComponent(load.base);
                const catalogId = encodeURIComponent(load.path.id);
                const type = encodeURIComponent(load.path.type_name);
                const extra = new URLSearchParams(load.path.extra).toString();
                window.location = `#/discover/${addonTransportUrl}/${catalogId}/${type}?${extra}`;
            };
            const selectInputs = [
                {
                    title: 'Select type',
                    options: state.discover.types
                        .map(({ type_name, load }) => ({
                            value: JSON.stringify(load),
                            label: type_name
                        })),
                    selected: state.discover.types
                        .filter(({ is_selected }) => is_selected)
                        .map(({ load }) => JSON.stringify(load)),
                    onSelect: onSelect
                },
                {
                    title: 'Select catalog',
                    options: state.discover.catalogs
                        .filter(({ load: { path: { type_name } } }) => {
                            return type_name === type;
                        })
                        .map(({ name, load }) => ({
                            value: JSON.stringify(load),
                            label: name
                        })),
                    selected: state.discover.catalogs
                        .filter(({ is_selected }) => is_selected)
                        .map(({ load }) => JSON.stringify(load)),
                    onSelect: onSelect
                }
            ];
            const items = state.discover.content.type === 'Ready' ? state.discover.content.content : null;
            const error = state.discover.content.type === 'Err' ? JSON.stringify(state.discover.content.content) : null;
            setDiscover([selectInputs, items, error]);
        };
        core.on('NewModel', onNewModel);
        core.dispatch({
            model: 'Discover',
            args: {
                action: 'Load',
                args: {
                    load: 'CatalogFiltered',
                    args: {
                        base: addonTransportUrl,
                        path: {
                            resource: 'catalog',
                            type_name: type,
                            id: catalogId,
                            extra: [] // TODO
                        }
                    }
                }
            }
        });
        return () => {
            core.off('NewModel', onNewModel);
        };
    }, [urlParams, queryParams]);
    return discover;
};

module.exports = useCatalog;
