const React = require('react');

const NONE_EXTRA_VALUE = 'None';
const CATALOG_PAGE_SIZE = 100;
const SKIP_EXTRA = {
    name: 'skip',
    optionsLimit: 1,
    isRequired: false
};

const navigateWithLoadRequest = (load_request) => {
    const addonTransportUrl = encodeURIComponent(load_request.base);
    const type = encodeURIComponent(load_request.path.type_name);
    const catalogId = encodeURIComponent(load_request.path.id);
    const extra = new URLSearchParams(load_request.path.extra).toString();
    window.location = `#/discover/${addonTransportUrl}/${type}/${catalogId}?${extra}`;
};

const getNextExtra = (prevExtra, extraProp, extraValue) => {
    return prevExtra
        .concat([[extraProp.name, extraValue]])
        .reduceRight((result, [name, value]) => {
            if (extraProp.name === name) {
                if (extraValue !== NONE_EXTRA_VALUE) {
                    const optionsCount = result.reduce((optionsCount, [name]) => {
                        if (extraProp.name === name) {
                            optionsCount++;
                        }

                        return optionsCount;
                    }, 0);
                    if (extraProp.optionsLimit === 1) {
                        if (optionsCount === 0) {
                            result.unshift([name, value]);
                        }
                    } else if (extraProp.optionsLimit > 1) {
                        const valueIndex = result.findIndex(([_name, _value]) => {
                            return _name === name && _value === value;
                        });
                        if (valueIndex !== -1) {
                            result.splice(valueIndex, 1);
                        } else if (extraProp.optionsLimit > optionsCount) {
                            result.unshift([name, value]);
                        }
                    }
                }
            } else {
                result.unshift([name, value]);
            }

            return result;
        }, []);
};

const mapSelectableControls = (discover) => {
    const selectedTransportUrl = discover.catalog_resource !== null ?
        discover.catalog_resource.request.base
        :
        null;
    const selectedTypeName = discover.catalog_resource !== null ?
        discover.catalog_resource.request.path.type_name
        :
        null;
    const selectedCatalogId = discover.catalog_resource !== null ?
        discover.catalog_resource.request.path.id
        :
        null;
    const selectedExtra = discover.catalog_resource !== null ?
        discover.catalog_resource.request.path.extra
        :
        [];
    const selectedPage = selectedExtra.reduce((selectedPage, [name, value]) => {
        if (name === SKIP_EXTRA.name) {
            const skip = parseInt(value);
            if (isFinite(skip)) {
                return Math.floor(skip / CATALOG_PAGE_SIZE) + 1;
            }
        }

        return selectedPage;
    }, 1);
    const typeSelect = {
        title: 'Select type',
        options: discover.selectable.types
            .map(({ name, load_request }) => ({
                value: JSON.stringify(load_request),
                label: name
            })),
        selected: discover.selectable.types
            .filter(({ load_request: { path: { type_name } } }) => {
                return type_name === selectedTypeName;
            })
            .map(({ load_request }) => JSON.stringify(load_request)),
        onSelect: (event) => {
            navigateWithLoadRequest(JSON.parse(event.value));
        }
    };
    const catalogSelect = {
        title: 'Select catalog',
        options: discover.selectable.catalogs
            .map(({ name, load_request }) => ({
                value: JSON.stringify(load_request),
                label: name
            })),
        selected: discover.selectable.catalogs
            .filter(({ load_request: { path: { id } } }) => {
                return id === selectedCatalogId;
            })
            .map(({ load_request }) => JSON.stringify(load_request)),
        onSelect: (event) => {
            navigateWithLoadRequest(JSON.parse(event.value));
        }
    };
    const extraSelects = discover.selectable.extra.map((extra) => {
        const title = `Select ${extra.name}`;
        const options = (extra.isRequired ? [] : [NONE_EXTRA_VALUE])
            .concat(extra.options)
            .map((option) => ({
                value: option,
                label: option
            }));
        const selected = selectedExtra
            .reduce((selected, [name, value]) => {
                if (name === extra.name) {
                    selected = selected
                        .filter((value) => value !== NONE_EXTRA_VALUE)
                        .concat([value]);
                }

                return selected;
            }, extra.isRequired ? [] : [NONE_EXTRA_VALUE]);
        const renderLabelText = selected.includes(NONE_EXTRA_VALUE) ?
            () => title
            :
            null;
        const onSelect = (event) => {
            navigateWithLoadRequest({
                base: selectedTransportUrl,
                path: {
                    resource: 'catalog',
                    type_name: selectedTypeName,
                    id: selectedCatalogId,
                    extra: getNextExtra(selectedExtra, extra, event.value)
                }
            });
        };
        return { title, options, selected, renderLabelText, onSelect };
    });
    const paginationInput = discover.selectable.has_prev_page || discover.selectable.has_next_page || selectedExtra.some(([name]) => name === 'skip') ?
        {
            label: String(selectedPage),
            onSelect: (event) => {
                if (event.value === 'prev' && !discover.selectable.has_prev_page ||
                    event.value === 'next' && !discover.selectable.has_next_page) {
                    return;
                }

                const nextValue = event.value === 'next' ?
                    String(selectedPage * CATALOG_PAGE_SIZE)
                    :
                    String((selectedPage - 2) * CATALOG_PAGE_SIZE);
                navigateWithLoadRequest({
                    base: selectedTransportUrl,
                    path: {
                        resource: 'catalog',
                        type_name: selectedTypeName,
                        id: selectedCatalogId,
                        extra: getNextExtra(selectedExtra, SKIP_EXTRA, nextValue)
                    }
                });
            }
        }
        :
        null;
    return [[typeSelect, catalogSelect, ...extraSelects], paginationInput];
};

const useSelectableControls = (discover) => {
    const selectableControls = React.useMemo(() => {
        return mapSelectableControls(discover);
    }, [discover]);
    return selectableControls;
};

module.exports = useSelectableControls;
