const React = require('react');
const { useServices } = require('stremio/services');

const DEFAULT_TYPE = 'movie';
const DEFAULT_ADDON_ID = 'com.linvo.cinemeta';
const DEFAULT_CATALOG_ID = 'top';

const useCatalog = (urlParams, queryParams) => {
    const { core } = useServices();
    const [selectInputs, setSelectInputs] = React.useState([]);
    React.useEffect(() => {
        const onNewModel = () => {
            const state = core.getState();
            const typeSelectInput = {
                options: [{ value: urlParams.type, label: urlParams.type }].concat(state.discover.types.map(({ type_name }) => ({
                    value: type_name,
                    label: type_name
                }))).filter((item, index, array) => {
                    // TODO findIndexRight
                    return array.findIndex(({ value }) => value === item.value) === index;
                }),
                selected: [urlParams.type].concat(state.discover.types.filter(({ is_selected }) => is_selected)
                    .map(({ type_name }) => type_name))
                    .filter((item, index, array) => {
                        return array.indexOf(item) === index;
                    }),
                onSelect: (event) => {
                    const value = event.reactEvent.currentTarget.dataset.value;
                    // TODO queryparams
                    window.location = `#/discover/${value}/${typeof urlParams.catalog === 'string' ? urlParams.catalog : ''}`;
                }
            };
            console.log(typeSelectInput);
            setSelectInputs([typeSelectInput]);
        };
        core.on('NewModel', onNewModel);
        return () => {
            core.off('NewModel', onNewModel);
        };
    }, [urlParams, queryParams]);
    React.useEffect(() => {
        const state = core.getState();
        let type = DEFAULT_TYPE;
        let addonId = DEFAULT_ADDON_ID;
        let catalogId = DEFAULT_CATALOG_ID;
        if (typeof urlParams.type === 'string' && urlParams.type.length > 0) {
            type = urlParams.type;
            addonId = null;
            catalogId = null;
            if (typeof urlParams.catalog === 'string' && urlParams.catalog.includes(':')) {
                [addonId = '', catalogId = ''] = urlParams.catalog.split(':');
            }
        }

        const [addon, catalog] = state.ctx.content.addons.reduceRight((result, addon) => {
            if (typeof addonId !== 'string' || addonId === addon.manifest.id) {
                const catalog = addon.manifest.catalogs.find((catalog) => {
                    return (typeof catalogId !== 'string' || catalogId === catalog.id) &&
                        catalog.type === type; // TODO && extraRequired.every(...);
                });
                if (catalog) {
                    return [addon, catalog];
                }
            }

            return result;
        }, []);
        if (catalog) {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogFiltered',
                    args: {
                        base: addon.transportUrl,
                        path: {
                            resource: 'catalog',
                            type_name: type,
                            id: catalog.id,
                            extra: [] // TODO
                        }
                    }
                }
            });
        } else {
            core.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogFiltered',
                    args: {
                        base: '',
                        path: {
                            resource: 'catalog',
                            type_name: type,
                            id: '',
                            extra: [] // TODO
                        }
                    }
                }
            });
        }
    }, [urlParams, queryParams]);
    return [selectInputs, []];
};

module.exports = useCatalog;
