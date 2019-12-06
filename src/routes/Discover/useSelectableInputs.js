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

const equalWithouExtra = (request1, request2) => {
    return request1.base === request2.base &&
        request1.path.resource === request2.path.resource &&
        request1.path.type_name === request2.path.type_name &&
        request1.path.id === request2.path.id;
};

const mapSelectableInputs = (discover) => {
    const selectedCatalogRequest = discover.catalog_resource !== null ?
        discover.catalog_resource.request
        :
        {
            base: null,
            path: {
                resource: 'catalog',
                id: null,
                type_name: null,
                extra: []
            }
        };
    const requestedPage = selectedCatalogRequest.path.extra.reduce((requestedPage, [name, value]) => {
        if (name === SKIP_EXTRA.name) {
            const skip = parseInt(value);
            if (isFinite(skip)) {
                return Math.floor(skip / CATALOG_PAGE_SIZE) + 1;
            }
        }

        return requestedPage;
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
                return type_name === selectedCatalogRequest.path.type_name;
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
            .filter(({ load_request }) => {
                return equalWithouExtra(load_request, selectedCatalogRequest);
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
        const selected = selectedCatalogRequest.path.extra
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
                base: selectedCatalogRequest.base,
                path: {
                    resource: 'catalog',
                    type_name: selectedCatalogRequest.path.type_name,
                    id: selectedCatalogRequest.path.id,
                    extra: getNextExtra(selectedCatalogRequest.path.extra, extra, event.value)
                }
            });
        };
        return { title, options, selected, renderLabelText, onSelect };
    });
    const paginationInput = discover.selectable.has_prev_page || discover.selectable.has_next_page ?
        {
            label: String(requestedPage),
            onSelect: (event) => {
                if (event.value === 'prev' && !discover.selectable.has_prev_page ||
                    event.value === 'next' && !discover.selectable.has_next_page) {
                    return;
                }

                const nextValue = event.value === 'next' ?
                    String(requestedPage * CATALOG_PAGE_SIZE)
                    :
                    String((requestedPage - 2) * CATALOG_PAGE_SIZE);
                navigateWithLoadRequest({
                    base: selectedCatalogRequest.base,
                    path: {
                        resource: 'catalog',
                        type_name: selectedCatalogRequest.path.type_name,
                        id: selectedCatalogRequest.path.id,
                        extra: getNextExtra(selectedCatalogRequest.path.extra, SKIP_EXTRA, nextValue)
                    }
                });
            }
        }
        :
        null;
    return [[typeSelect, catalogSelect, ...extraSelects], paginationInput];
};

const useSelectableInputs = (discover) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(discover);
    }, [discover]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
