const React = require('react');
const { useServices } = require('stremio/services');

const DEFAULT_ADDON_TRANSPORT_URL = 'https://v3-cinemeta.strem.io/manifest.json';
const DEFAULT_CATALOG_ID = 'top';
const DEFAULT_TYPE = 'movie';
const NONE_EXTRA_VALUE = 'None';

const useCatalog = (urlParams, queryParams) => {
    const { core } = useServices();
    const [discover, setDiscover] = React.useState([[], null, null]);
    React.useEffect(() => {
        const addonTransportUrl = typeof urlParams.addonTransportUrl === 'string' ? urlParams.addonTransportUrl : DEFAULT_ADDON_TRANSPORT_URL;
        const catalogId = typeof urlParams.catalogId === 'string' ? urlParams.catalogId : DEFAULT_CATALOG_ID;
        const type = typeof urlParams.type === 'string' ? urlParams.type : DEFAULT_TYPE;
        const onNewModel = () => {
            const state = core.getState();
            const navigateWithLoad = (load) => {
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
                    onSelect: (event) => {
                        navigateWithLoad(JSON.parse(event.value));
                    }
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
                    onSelect: (event) => {
                        navigateWithLoad(JSON.parse(event.value));
                    }
                },
                ...state.discover.selectable_extra
                    .map((extra) => ({
                        title: `Select ${extra.name}`,
                        options: (extra.isRequired ? [] : [NONE_EXTRA_VALUE])
                            .concat(extra.options)
                            .map((option) => ({
                                value: option,
                                label: option
                            })),
                        selected: state.discover.selected.path.extra
                            .reduce((selected, [name, value]) => {
                                if (name === extra.name) {
                                    selected = selected.filter(value => value !== NONE_EXTRA_VALUE)
                                        .concat([value]);
                                }

                                return selected;
                            }, extra.isRequired ? [] : [NONE_EXTRA_VALUE]),
                        onSelect: (event) => {
                            navigateWithLoad({
                                base: addonTransportUrl,
                                path: {
                                    resource: 'catalog',
                                    type_name: type,
                                    id: catalogId,
                                    extra: Array.from(queryParams.entries())
                                        .concat([[extra.name, event.value]])
                                        .reduceRight((result, [name, value]) => {
                                            if (extra.name === name) {
                                                if (event.value !== NONE_EXTRA_VALUE) {
                                                    const optionsCount = result.reduce((optionsCount, [name]) => {
                                                        if (extra.name === name) {
                                                            optionsCount++;
                                                        }

                                                        return optionsCount;
                                                    }, 0);
                                                    if (extra.optionsLimit === 1) {
                                                        if (optionsCount === 0) {
                                                            result.unshift([name, value]);
                                                        }
                                                    } else if (extra.optionsLimit > 1) {
                                                        const valueIndex = result.findIndex(([_name, _value]) => {
                                                            return _name === name && _value === value;
                                                        });
                                                        if (valueIndex !== -1) {
                                                            result.splice(valueIndex, 1);
                                                        } else if (extra.optionsLimit > optionsCount) {
                                                            result.unshift([name, value]);
                                                        }
                                                    }
                                                }
                                            } else {
                                                result.unshift([name, value]);
                                            }

                                            return result;
                                        }, [])
                                }
                            });
                        }
                    }))
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
                            extra: Array.from(queryParams.entries())
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
