const React = require('react');

const NONE_EXTRA_VALUE = 'None';
const CATALOG_PAGE_SIZE = 100;
const SKIP_EXTRA = {
    name: 'skip',
    optionsLimit: 1,
    isRequired: false
};

const navigateWithLoadRequest = (request) => {
    const transportUrl = encodeURIComponent(request.base);
    const type = encodeURIComponent(request.path.type_name);
    const catalogId = encodeURIComponent(request.path.id);
    const extra = new URLSearchParams(request.path.extra).toString();
    window.location.replace(`#/discover/${transportUrl}/${type}/${catalogId}?${extra}`);
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
            .map(({ name, request }) => ({
                value: JSON.stringify(request),
                label: name
            })),
        selected: discover.selectable.types
            .filter(({ request }) => {
                return selectedCatalogRequest.path.type_name === request.path.type_name;
            })
            .map(({ request }) => JSON.stringify(request)),
        onSelect: (event) => {
            navigateWithLoadRequest(JSON.parse(event.value));
        }
    };
    const catalogSelect = {
        title: 'Select catalog',
        options: discover.selectable.catalogs
            .map(({ name, request }) => ({
                value: JSON.stringify(request),
                label: name
            })),
        selected: discover.selectable.catalogs
            .filter(({ request }) => {
                return selectedCatalogRequest.base === request.base &&
                    selectedCatalogRequest.path.id === request.path.id;
            })
            .map(({ request }) => JSON.stringify(request)),
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
